import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FreightTable, FreightTableSkeleton } from "./freight-table";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { useNavigate } from "@tanstack/react-router";
import { formatNumber } from "@/lib/number-utils";
import { api, handleError } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { type UserPermissionModel } from "@/models/admin/user-permission.model";
import {
  buildTaxesDetailFromOrderItems,
  calcItemVisibleTaxesTotal,
  calcOrderGrossSubtotal,
  calcOrderTaxes,
  calcOrderTotalWithTaxes,
  getUserPermissions,
  withPricingSnapshot,
} from "../-utils/order-utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Loader2Icon,
  LoaderIcon,
  TriangleAlertIcon,
  Undo2Icon,
} from "lucide-react";
import { AppTooltip } from "@/components/layout/app-tooltip";
import type {
  CalcOrderFreightsItem,
  CalcOrderFreightsRequestDto,
} from "@/models/dto/requests/calc-freights-request.model";
import type { CalcFreightsResposeDto } from "@/models/dto/responses/calculated-freights-response.model";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { orderDisplayNumber } from "@/lib/order-number";
import type { OrderModel } from "@/models/orders/order-model";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";
import { InputMask } from "@/components/ui/input-mask";
import { useOrder } from "../-context/order-context";
import { TaxesModal } from "./taxes-modal";
import * as uuid from "uuid";
import type { TaxResponseDto } from "@/models/dto/responses/tax-response.model";

interface Props {
  isOpen: boolean;
  //isEditing: boolean;
  onClose: () => void;
}

export const FinishOrderModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { order, mode, isBudget, setOrder } = useOrder();
  const { showAppDialog } = useAppDialog();

  const isEditing = mode == "NEW" || mode == "EDIT";
  const [isSaving, setIsSaving] = useState(false);
  const [orderValidationMessage, setOrderValidationMessage] = useState("");
  const [paymentConditionsData, setPaymentConditionsData] = useState<
    SearchComboItem[]
  >([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionModel[]>(
    [],
  );
  const [freightsData, setFreightsData] = useState<CalcFreightsResposeDto[]>(
    [],
  );
  const [taxesData, setTaxesData] = useState<TaxResponseDto>();

  const [selectedPaymentCondition, setSelectedPaymentCondition] = useState<
    PaymentConditionModel | undefined
  >(undefined);

  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
  const [isCalculatingTaxes, setIsCalculatingTaxes] = useState(false);
  const [isFreightError, setIsFreightError] = useState(false);
  const [isTaxesError, setIsTaxesError] = useState(false);
  const freightAbortControllerRef = useRef<AbortController | null>(null);
  const taxesAbortControllerRef = useRef<AbortController | null>(null);

  // "Impostos" do pedido = soma dos impostos POR ITEM (mesma fonte e método da
  // coluna "Impostos" de cada linha — item.taxes). Antes era recalculado aqui
  // via calcOrderTaxes, o que divergia da tabela (ex.: 395,59 vs 322,01).
  // Os tributos em item.taxes já vêm descontados do Datasul — não se reaplica
  // fator (ver calcItemVisibleTaxesTotal).
  const totalTaxes = order.items.reduce(
    (acc, item) => acc + calcItemVisibleTaxesTotal(item),
    0,
  );

  async function handleSendOrder() {
    try {
      //save the order / budget
      let savedOrder: OrderModel | null = null;
      // Força o isBudget do context (fonte de verdade da rota /budgets vs /orders).
      // O order.isBudget pode estar dessincronizado se o objeto tiver passado por
      // um reset (ex.: NEW_ORDER_EMPTY com isBudget=false).
      const orderData = { ...order, isBudget, history: [] };

      // SIMULAÇÃO: tipo sempre "Venda" (1), frete zerado e transportadora =
      // a do cliente. Não há cálculo nem escolha de frete na simulação.
      if (isBudget) {
        orderData.orderClassificationId = 1;
        orderData.freightValue = 0;
        orderData.carrierId = orderData.customer?.carrierId ?? 0;
      }

      setIsSaving(true);

      // BLOQUEIO DE IMPOSTOS — regra de negócio: não se grava pedido/simulação
      // sem os tributos calculados pelo Datasul. Recalcula de forma SÍNCRONA
      // aqui (não confia no taxesData de fundo, que pode estar em voo/abortado)
      // e, se a chamada falhar (erro da API) ou vier vazia, ABORTA a gravação.
      let taxesResult: TaxResponseDto | undefined;
      try {
        taxesResult = await calcOrderTaxes(orderData);
      } catch (error) {
        setIsTaxesError(true);
        setIsSaving(false);
        toast.error(
          `Não foi possível calcular os impostos: ${handleError(error)}. ${isBudget ? "A simulação não foi gravada" : "O pedido não foi gravado"}.`,
        );
        return;
      }
      if (
        !taxesResult ||
        !taxesResult.itens ||
        taxesResult.itens.length === 0
      ) {
        setIsTaxesError(true);
        setIsSaving(false);
        toast.error(
          `Não foi possível calcular os impostos. ${isBudget ? "A simulação não foi gravada" : "O pedido não foi gravado"}.`,
        );
        return;
      }
      // const → preserva o narrowing (não-undefined) dentro dos closures abaixo.
      const taxes = taxesResult;
      setIsTaxesError(false);
      setTaxesData(taxes);

      // Congela o snapshot de preço calculado (grossItemValue/netItemValue) em
      // cada item, para o pedido gravar exatamente o valor exibido ao usuário.
      // Roda ANTES da reescrita de tributos abaixo, pois lê o IPI cru exibido
      // em tela; cria novos objetos para não mutar o state do contexto.
      orderData.items = orderData.items.map((it) => ({
        ...withPricingSnapshot(it, order),
        // Rede de segurança: o CFOP vem do endpoint matriz-cfop-item como
        // text/plain e, sendo só dígitos, o axios o converte em número. O
        // backend exige string em fiscalOperationId — garante a coerção aqui
        // independentemente de como o item entrou no pedido.
        fiscalOperationId: String(it.fiscalOperationId ?? ""),
      }));

      // Os tributos já vêm do Datasul calculados sobre o preço COM desconto
      // (calcOrderTaxes envia UnitaryValue já descontado). Gravamos como vieram
      // — NÃO se reaplica o fator de desconto aqui, senão IPI/ICMS-ST e o total
      // da nota ficariam descontados em dobro.
      orderData.items.forEach((orderItem) => {
        orderItem.taxes = [];
        taxes.itens.forEach((taxItem) => {
          if (taxItem.produto.codigo_produto == orderItem.productId) {
            //cofins
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: taxItem.produto.base_calculo_cofins,
              taxBaseReduction: 0,
              taxName: "COFINS",
              taxPercentual: taxItem.produto.aliquota_cofins,
              taxValue: taxItem.produto.valor_cofins,
              mva: 0,
            });

            //pis
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: taxItem.produto.base_calculo_pis,
              taxBaseReduction: 0,
              taxName: "PIS",
              taxPercentual: taxItem.produto.aliquota_pis,
              taxValue: taxItem.produto.valor_pis,
              mva: 0,
            });

            // ipi
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: taxItem.produto.base_calculo_ipi,
              taxBaseReduction: 0,
              taxName: "IPI",
              taxPercentual: taxItem.produto.aliquota_ipi,
              taxValue: taxItem.produto.valor_ipi,
              mva: 0,
            });

            // csll
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: 0,
              taxBaseReduction: 0,
              taxName: "CSLL",
              taxPercentual: taxItem.produto.aliquota_csll,
              taxValue: taxItem.produto.valor_csll,
              mva: 0,
            });

            // icms
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: taxItem.produto.base_calculo_icms,
              taxBaseReduction: 0,
              taxName: "ICMS",
              taxPercentual: taxItem.produto.aliquota_icms,
              taxValue: taxItem.produto.valor_icms,
              mva: 0,
            });

            // st
            orderItem.taxes.push({
              id: uuid.v4(),
              itemId: orderItem.id,
              orderId: orderItem.orderId,
              taxBase: taxItem.produto.base_calculo_st,
              taxBaseReduction: 0,
              taxName: "ICMS-ST",
              taxPercentual: taxItem.produto.aliquota_st,
              taxValue: taxItem.produto.valor_st,
              mva: 0,
            });

            taxItem.produto.reforma.forEach((taxReforma) => {
              // impostos da reforma
              orderItem.taxes.push({
                id: uuid.v4(),
                itemId: orderItem.id,
                orderId: orderItem.orderId,
                taxBase: taxReforma.base_tributo,
                taxBaseReduction: taxReforma.perc_reducao_governamental,
                taxName: taxReforma.tipo_tributo_descricao,
                taxPercentual: taxReforma.aliquota,
                taxValue: taxReforma.valor_tributo,
                mva: 0,
              });
            });
          }
        });
      });

      // Garante que TODO item recebeu seus tributos. Se algum produto não veio
      // na resposta do Datasul, o item ficaria com taxes=[] (imposto zerado) —
      // bloqueia a gravação em vez de gravar pedido/simulação inconsistente.
      const itemWithoutTaxes = orderData.items.find(
        (it) => it.taxes.length === 0,
      );
      if (itemWithoutTaxes) {
        setIsTaxesError(true);
        setIsSaving(false);
        toast.error(
          `Não foi possível calcular os impostos do item ${itemWithoutTaxes.productId}. ${isBudget ? "A simulação não foi gravada" : "O pedido não foi gravado"}.`,
        );
        return;
      }

      if (order.id) {
        // update
        const { data } = await api.patch(`/orders`, orderData);
        savedOrder = data;
      } else {
        // add
        orderData.id = uuid.v4();
        const { data } = await api.post(`/orders`, orderData);
        savedOrder = data;
      }

      // Numeração deferida: pedido pode voltar sem orderId (Datasul indisponível) — nesse
      // caso exibimos o código provisório e avisamos que a integração ocorrerá depois.
      const displayNumber = savedOrder ? orderDisplayNumber(savedOrder) : "";
      const integrationPending =
        !!savedOrder && !isBudget && !savedOrder.integratedAt;

      if (orderData.maxBillingDate) {
        await showAppDialog({
          title: "ATENÇÃO",
          message:
            "Você informou uma Data Mínima de Faturamento. Favor entrar em contato com a THULE pelo e-mail <b>pedidos.itupeva@thule.com</b> e solicitar a alocação do estoque para este Pedido.",
          type: "info",
        });
      }
      setIsSaving(false);
      onClose();
      await showAppDialog({
        type: integrationPending ? "info" : "success",
        title: isBudget
          ? "Simulação Enviada com Sucesso"
          : integrationPending
            ? "Pedido Registrado"
            : "Pedido Enviado com sucesso!",
        message: isBudget
          ? `Gerada a Simulação ${displayNumber}`
          : integrationPending
            ? `Pedido registrado (${displayNumber}). Aguardando integração com o ERP${
                savedOrder?.integrationMessage
                  ? `: ${savedOrder.integrationMessage}`
                  : "."
              }`
            : `Gerado o Pedido ${displayNumber}`,
        buttons: [
          { text: "OK", variant: "primary", value: "ok", autoClose: true },
        ],
      });

      if (!isBudget) {
        await showAppDialog({
          type: "success",
          title: "ATENÇÃO!",
          message: `Pedido encontra-se em análise financeira e serão checados a partir das 11:30,14:30 e 16:30.
Os produtos não serão reservados e poderão sofrer alterações na data de entrega.`,
          buttons: [
            { text: "OK", variant: "primary", value: "ok", autoClose: true },
          ],
        });
      }

      if (isBudget) navigate({ to: "/budgets" });
      else navigate({ to: "/orders" });
    } catch (error) {
      toast.error(`ATENÇÃO: ${handleError(error)}`);
    } finally {
      setIsSaving(false);
      setIsCalculatingFreight(false);
      setIsCalculatingTaxes(false);
    }
  }

  // Gera um Pedido a partir de uma Simulação já gravada: abre a tela de inclusão
  // PRÉ-PREENCHIDA com os dados da simulação. O pedido só é criado quando o usuário
  // confirmar (fluxo normal de Concluir). O vínculo/imutabilidade e a trava anti-
  // duplicidade são resolvidos no backend ao gravar (a partir do budgetId).
  function handleGenerateOrder() {
    if (!order.id) {
      toast.warning("Grave a simulação antes de gerar o pedido.");
      return;
    }
    if (order.generatedOrderId) {
      toast.warning(
        `Esta simulação já gerou o pedido ${order.generatedOrderId}.`,
      );
      return;
    }
    onClose();
    navigate({
      to: "/orders/new-order",
      search: { fromBudget: order.id },
    });
  }

  // Sub-total bruto e total c/impostos — centralizados em order-utils.
  const getSubTotal = () => calcOrderGrossSubtotal(order);
  const getTotal = () => calcOrderTotalWithTaxes(order, totalTaxes);

  const getSelectedDeliveryLocation = () => {
    if (!order.customer) return undefined;
    const deliveryLocation = order.customer.deliveryLocations.filter(
      (f) => f.id == order.deliveryLocationId,
    );

    if (!deliveryLocation) return undefined;
    const dlArray = convertArrayToSearchComboItem(
      deliveryLocation,
      "id",
      (item) => `${item.id} - ${item.address} - ${item.city} - ${item.state}`,
    );
    return [dlArray[0]];
  };

  const getPaymentConditions = async () => {
    const { data } = await api.get<PaymentConditionModel[]>(
      `/registrations/payment-conditions/all?onlyActives=true`,
    );

    const newData = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.id} - ${item.name}`,
        extra: item,
      };
    });

    setPaymentConditionsData(newData);
    setSelectedPaymentCondition(order.paymentCondition);
  };

  const getOrderPaymentCondition = () => {
    const orderPaymentCondition = paymentConditionsData.find(
      (f) => f.value == order.paymentConditionId.toString(),
    );

    if (!orderPaymentCondition) return undefined;

    return [orderPaymentCondition];
  };

  const getPermissions = async () => {
    const data = await getUserPermissions(session?.user.id ?? "");
    setUserPermissions(data ?? []);
  };

  const isItemPermissionDisabled = (permissionId: string) => {
    if (session?.user.role == 0 || session?.user.role == 1) return false;

    const item = userPermissions.find((f) => f.permissionId == permissionId);

    if (!item) return true;
    return !item.isPermitted;
  };

  const handleChangeDiscountPercentual = (newPercentual: number) => {
    if (newPercentual < 0) {
      toast.warning("Percentual Inválido!");
      return;
    }

    if (newPercentual > 100) {
      toast.warning("Percentual Inválido!");
      return;
    }

    setOrder({ ...order, discountPercentual: newPercentual });
  };

  const getFreights = async () => {
    if (!isEditing) return;
    // Simulação não calcula frete: usa sempre a transportadora do cliente,
    // frete zerado (ver useEffect de defaults da simulação e handleSendOrder).
    if (isBudget) return;
    if (order.useCustomerCarrier) return;
    if (order.freightPaymentId == 3) return;

    freightAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    freightAbortControllerRef.current = abortController;

    setIsCalculatingFreight(true);
    setIsFreightError(false);
    try {
      setFreightsData([]);
      const ttParam: CalcOrderFreightsRequestDto[] = [
        {
          customerAbbreviation: order.customer?.abbreviation ?? "",
          deliveryLocationId: order.customer?.deliveryLocations[0].id ?? "",
          orderId: order.id ?? "",
          totalOrder: getTotal(),
        },
      ];

      const ttItems: CalcOrderFreightsItem[] = order.items.map((item) => {
        return {
          productId: item.productId,
          quantity: item.orderQuantity,
          sequence: item.sequence,
        };
      });

      const { data } = await api.post<CalcFreightsResposeDto[]>(
        `/orders/calculate-freights`,
        { ttParam: ttParam, ttItems: ttItems },
        { signal: abortController.signal },
      );

      if (data && data.length > 0) {
        const sortedCarriers = data.sort((a, b) => {
          if (a.carrierId === 0 && b.carrierId !== 0) {
            return 1;
          }
          if (a.carrierId !== 0 && b.carrierId === 0) {
            return -1;
          }
          return a.freightValue - b.freightValue;
        });
        setFreightsData(sortedCarriers);
        setOrder({
          ...order,
          freightValue: sortedCarriers[0].freightValue,
          carrierId: sortedCarriers[0].carrierId,
        });
      } else {
        // Retorno vazio do TOTVS é tratado como falha (exibe a tela de erro
        // com o botão de tentar novamente, não o skeleton infinito).
        setIsFreightError(true);
      }
    } catch (error) {
      if (abortController.signal.aborted) return;
      setIsFreightError(true);
      toast.error(handleError(error));
    } finally {
      setIsCalculatingFreight(false);
    }
  };

  const getTaxes = async () => {
    if (!isEditing) return;
    if (order.items.length == 0) return;

    taxesAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    taxesAbortControllerRef.current = abortController;

    setIsCalculatingTaxes(true);
    try {
      // Recalcula apenas para alimentar o detalhamento (TaxesModal). O TOTAL
      // exibido vem de item.taxes (totalTaxes derivado acima), igual à tabela.
      const data = await calcOrderTaxes(order, abortController.signal);
      if (data && data.itens && data.itens.length > 0) {
        setTaxesData(data);
        setIsTaxesError(false);
      } else {
        // Resposta vazia do Datasul = falha de cálculo. Sinaliza erro para
        // bloquear a gravação do pedido/simulação.
        setIsTaxesError(true);
      }
    } catch (error) {
      if (abortController.signal.aborted) return;
      // Erro na API de impostos: marca erro para bloquear a gravação.
      setIsTaxesError(true);
    } finally {
      setIsCalculatingTaxes(false);
    }
  };

  const handleChangePaymentCondition = (value: string) => {
    const newOrder = { ...order };
    const pc = paymentConditionsData.find((f) => f.value == value);
    if (!pc) return;

    newOrder.paymentConditionId = Number(value);
    if (pc && pc.extra?.additionalDiscountPercent > 0)
      newOrder.additionalDiscount = pc.extra.additionalDiscountPercent;

    setOrder(newOrder);
    setSelectedPaymentCondition(pc.extra);
  };

  useEffect(() => {
    if (isOpen) {
      getPaymentConditions();
      getPermissions();
    }
    return () => {
      freightAbortControllerRef.current?.abort();
      taxesAbortControllerRef.current?.abort();
    };
  }, [isOpen]);

  // Defaults da SIMULAÇÃO: tipo sempre "Venda" (1), frete zerado e
  // transportadora = a do cliente. Simulação não tem cálculo/escolha de frete.
  useEffect(() => {
    if (!isOpen || !isBudget || !isEditing) return;
    setOrder({
      ...order,
      orderClassificationId: 1,
      freightValue: 0,
      carrierId: order.customer?.carrierId ?? 0,
    });
    // Roda ao abrir; depende do cliente do pedido estar carregado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isBudget]);

  // Recalcula o frete sempre que o modal abre ou os flags que afetam o frete
  // mudam. Reage ao estado ATUAL do order (evita o stale closure que existia no
  // setTimeout dos checkboxes). getFreights já sai cedo nos modos "Usa
  // Transportadora do Cliente" e "Frete Pago", e ao calcular já seleciona/grava
  // a transportadora mais barata (sortedCarriers[0]).
  useEffect(() => {
    if (!isOpen) return;
    getFreights();
  }, [isOpen, order.useCustomerCarrier, order.freightPaymentId]);

  useEffect(() => {
    setOrderValidationMessage("");

    const orderTotal = getTotal();
    if (selectedPaymentCondition) {
      if (
        selectedPaymentCondition.minOrderValue > 0 &&
        orderTotal < selectedPaymentCondition.minOrderValue
      ) {
        setOrderValidationMessage(
          `Para comprar com a condição de pagamento selecionada, ${isBudget ? "sua simulação deve ser" : "seu pedido deve ser"} de no mínimo R$ ${formatNumber(selectedPaymentCondition.minOrderValue, 2)}`,
        );
      }
    }
  }, [selectedPaymentCondition, order.grossTotalValue]);

  useEffect(() => {
    getTaxes();
    return () => {
      taxesAbortControllerRef.current?.abort();
    };
  }, [
    order.items,
    order.freightValue,
    order.discountPercentual,
    order.paymentConditionId,
  ]);

  // Linhas do resumo (sub-total, desconto, frete, impostos, total). Renderizadas
  // em DOIS lugares conforme a largura: dentro da coluna direita em telas grandes
  // (xl, layout original) e como barra fixa acima do rodapé em telas menores.
  const summaryRows = (
    <>
      <div className="flex justify-between pr-2">
        <span>Sub-Total {isBudget ? "da Simulação" : "do Pedido"}:</span>
        <span>R$ {formatNumber(getSubTotal(), 2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <Label>% Desconto:</Label>
        <div className="flex gap-x-1.5 items-center">
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            readOnly={!isEditing || isItemPermissionDisabled("318")}
            max={100}
            min={0}
            maxLength={6}
            value={order.discountPercentual ?? 0}
            className={cn(
              "file:text-foreground text-right placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-[90px] min-w-0 rounded-md border bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 disabled:border-none disabled:shadow-none",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "read-only:bg-neutral-100",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            )}
            onValueChange={(value) =>
              handleChangeDiscountPercentual(value.floatValue ?? 0)
            }
          />
          {isEditing && order.orderClassificationId != 6 && (
            <AppTooltip message="Desfazer">
              <button
                className="hover:bg-neutral-200 bg-neutral-50 p-1 rounded border border-neutral-300"
                onClick={() => {
                  handleChangeDiscountPercentual(
                    order.customer?.discountPercent ?? 0,
                  );
                }}
              >
                <Undo2Icon className="size-4" />
              </button>
            </AppTooltip>
          )}
        </div>
      </div>
      {order.orderClassificationId != 6 &&
        (selectedPaymentCondition?.additionalDiscountPercent ?? 0) > 0 && (
          <div className="flex justify-between items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">
            <Label className="flex items-center gap-2 text-amber-800">
              % Desconto Adicional:
            </Label>
            <div className="flex gap-x-1.5 items-center">
              <span>{formatNumber(order.additionalDiscount, 2)}%</span>
              <Checkbox
                defaultChecked={
                  (selectedPaymentCondition?.additionalDiscountPercent ?? 0) > 0
                }
                onCheckedChange={(checked) => {
                  setOrder({
                    ...order,
                    additionalDiscount: checked
                      ? (selectedPaymentCondition?.additionalDiscountPercent ??
                        0)
                      : 0,
                  });
                }}
              />
            </div>
          </div>
        )}
      {!isBudget && (
        <div className="flex justify-between pr-2 text-sm">
          <span>Frete:</span>
          <span>R$ {formatNumber(order.freightValue, 2)}</span>
        </div>
      )}
      <div className="flex justify-between pr-2 text-sm">
        <div className="flex">
          <TaxesModal
            data={isEditing ? taxesData : buildTaxesDetailFromOrderItems(order)}
          />
          Impostos:
        </div>
        {isCalculatingTaxes && (
          <div className="text-xs min-w-fit flex items-center">
            <LoaderIcon className="size-3 animate-spin mr-1" />
            Calculando...
          </div>
        )}
        {!isCalculatingTaxes && <span>R$ {formatNumber(totalTaxes, 2)}</span>}
      </div>
      <div className="flex justify-between font-medium pr-2 bg-emerald-600 rounded-md py-2 px-2 text-white">
        <span>
          {isBudget ? "Total da Simulação" : "Total do Pedido"} c/Impostos
        </span>
        {isCalculatingFreight || isCalculatingTaxes ? (
          <span className="size-4 flex items-center justify-center mr-1">
            <LoaderIcon className="size-4 animate-spin" />
          </span>
        ) : (
          <span>R$ {formatNumber(getTotal(), 2)}</span>
        )}
      </div>
      {isBudget && (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">
          <TriangleAlertIcon className="size-4 shrink-0 mt-0.5" />
          <span className="text-xs">
            O Valor de Frete será calculado e adicionado ao total do pedido, no
            momento do envio do Pedido
          </span>
        </div>
      )}

      {orderValidationMessage && (
        <div className="flex items-center justify-center font-medium bg-red-200 text-white p-2">
          {orderValidationMessage}
        </div>
      )}

      {isTaxesError && (
        <div className="flex items-center justify-center font-medium bg-red-600 text-white p-2 rounded-md">
          Não foi possível calcular os impostos.{" "}
          {isBudget
            ? "A simulação não pode ser gravada"
            : "O pedido não pode ser enviado"}{" "}
          até que o cálculo seja refeito com sucesso.
        </div>
      )}
    </>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Bloqueia fechar enquanto grava — evita usuário sair no meio da
        // submissão e gerar pedido inconsistente / duplicado.
        if (isSaving) return;
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="w-[95vw] max-w-[95vw] sm:max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden gap-0"
        onEscapeKeyDown={(e) => {
          if (isSaving) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isSaving) e.preventDefault();
        }}
        onInteractOutside={(e) => {
          if (isSaving) e.preventDefault();
        }}
      >
        {/* Overlay de bloqueio enquanto grava — cobre todo o conteúdo do
            modal e captura cliques/foco. fieldset abaixo já desabilita os
            controles nativos; o overlay garante a UX visual e impede
            interações com componentes customizados (Radix Select, etc.). */}
        {isSaving && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-lg cursor-wait animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-4 px-10 py-8 bg-white shadow-2xl rounded-2xl border border-slate-200 min-w-[280px]">
              <div className="relative size-14">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-base font-semibold text-slate-800">
                  Gravando {isBudget ? "simulação" : "pedido"}
                </span>
                <span className="text-xs text-slate-500">
                  Por favor, aguarde — não feche esta janela.
                </span>
              </div>
            </div>
          </div>
        )}
        <fieldset disabled={isSaving} className="contents">
          <DialogHeader className="shrink-0 border-b pb-3">
            <DialogTitle>
              {isEditing ? "Finalizar " : "Resumo de "}{" "}
              {isBudget ? "Simulação" : "Pedido"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* Corpo rolável — header/footer ficam fixos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-4 flex-1 min-h-0 overflow-y-auto py-4 pr-1">
            <div className="flex flex-col space-y-4 mt-2">
              <div className="grid grid-cols-2 space-x-4">
                <div className="form-group">
                  <Label>
                    {isBudget ? "Tipo da Simulação" : "Tipo do Pedido"}
                  </Label>
                  <Select
                    value={(isBudget
                      ? 1
                      : order.orderClassificationId
                    ).toString()}
                    onValueChange={(value) => {
                      setOrder({
                        ...order,
                        orderClassificationId: Number(value),
                      });
                    }}
                    disabled={
                      isBudget || // simulação é sempre "Venda"
                      !isEditing ||
                      isItemPermissionDisabled("317") ||
                      order.orderClassificationId == 6 // outlet
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Venda</SelectItem>
                      <SelectItem value="2">Venda Cliente Final</SelectItem>
                      <SelectItem value="3">Bonificação</SelectItem>
                      <SelectItem value="4">Remessa Consignação</SelectItem>
                      <SelectItem value="5">Garantia</SelectItem>
                      <SelectItem value="6" disabled>
                        Outlet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <Label>Nº Pedido Distribuidor</Label>
                  <Input
                    disabled={!isEditing}
                    value={order.orderRepId}
                    onChange={(e) => {
                      setOrder({ ...order, orderRepId: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <Label>Nº Whatsapp</Label>
                  <InputMask
                    value={order.whatAppPhoneNumber}
                    onChange={(value) => {
                      setOrder({ ...order, whatAppPhoneNumber: value ?? "" });
                    }}
                    disabled={!isEditing}
                    mask="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="form-group">
                <Label>Endereço de Entrega</Label>
                <SearchCombo
                  disabled={!isEditing || isItemPermissionDisabled("308")}
                  placeholder="Selecione o Endereço de Entrega"
                  staticItems={convertArrayToSearchComboItem(
                    order.customer?.deliveryLocations ?? [],
                    "id",
                    (item) =>
                      `${item.id} - ${item.address} - ${item.city} - ${item.state}`,
                  )}
                  defaultValue={getSelectedDeliveryLocation()}
                />
              </div>
              <div className="form-group">
                <Label>Condição de Pagamento</Label>
                {!isEditing && (
                  <Input
                    readOnly
                    value={`${order.paymentConditionId} - ${order.paymentCondition?.name}`}
                  />
                )}
                {isEditing && (
                  <SearchCombo
                    placeholder="Selecione a Condição de Pagamento"
                    staticItems={paymentConditionsData}
                    defaultValue={getOrderPaymentCondition()}
                    onChange={(value: string) => {
                      handleChangePaymentCondition(value);
                    }}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 ">
                <div className="form-group">
                  <Label>Faturar em</Label>
                  <DatePicker
                    defaultValue={order.minBillingDate ?? undefined}
                    onValueChange={(date) => {
                      setOrder({ ...order, minBillingDate: date ?? null });
                    }}
                    disabled={!isEditing || isItemPermissionDisabled("312")}
                  />
                </div>
                <div className="form-group">
                  <Label>Faturar no Máximo até</Label>
                  <DatePicker
                    defaultValue={order.maxBillingDate ?? undefined}
                    onValueChange={(date) => {
                      setOrder({ ...order, maxBillingDate: date ?? null });
                    }}
                    disabled={!isEditing || isItemPermissionDisabled("312")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 space-y-2">
                <div className="form-group">
                  <Label>
                    <Checkbox
                      disabled={!isEditing || order.orderClassificationId == 6}
                      checked={order.isParcialBilling}
                      onCheckedChange={(checked) => {
                        const newOrder = {
                          ...order,
                          isParcialBilling: checked ? true : false,
                        };
                        setOrder(newOrder);
                      }}
                    />
                    Fatura Parcial
                  </Label>
                </div>
                <div className="form-group">
                  <Label>
                    <Checkbox
                      disabled={
                        isBudget || // simulação não usa opções de frete
                        !isEditing ||
                        isItemPermissionDisabled("314") ||
                        order.orderClassificationId == 6
                      }
                      checked={order.freightPaymentId == 3}
                      onCheckedChange={(checked) => {
                        const newOrder = {
                          ...order,
                          freightPaymentId: checked ? 3 : 1,
                        };
                        if (checked == true) {
                          freightAbortControllerRef.current?.abort();
                          setIsCalculatingFreight(false);
                          newOrder.freightValue = 0;
                          newOrder.freightTypeId = 4;
                          newOrder.carrierId =
                            newOrder.customer?.carrierId ?? 0;
                        }
                        setOrder(newOrder);
                      }}
                    />
                    Frete Pago
                  </Label>
                </div>
                <div className="form-group">
                  <Label>
                    <Checkbox
                      disabled={
                        isBudget || // simulação usa sempre a transp. do cliente
                        !isEditing ||
                        isItemPermissionDisabled("315")
                      }
                      checked={order.useCustomerCarrier}
                      onCheckedChange={(checked) => {
                        const newOrder = {
                          ...order,
                          useCustomerCarrier: checked ? true : false,
                        };
                        if (checked == true) {
                          freightAbortControllerRef.current?.abort();
                          setIsCalculatingFreight(false);
                          newOrder.freightValue = 0;
                          newOrder.freightTypeId = 4;
                          newOrder.carrierId =
                            newOrder.customer?.carrierId ?? 0;
                        }
                        setOrder(newOrder);
                      }}
                    />
                    Usa Transportadora do Cliente
                  </Label>
                </div>
                <div className="form-group">
                  <Label>
                    <Checkbox
                      disabled={isBudget || !isEditing}
                      onCheckedChange={(value) => {
                        if (!!value) {
                          window.open(
                            "https://form.jotformz.com/210402780488657",
                            "_blank",
                          );
                        }
                      }}
                    />
                    Enviar Display com {isBudget ? "a Simulação" : "o Pedido"}
                  </Label>
                </div>
              </div>
            </div>
            {/* Segunda coluna — vira seção empilhada (borda no topo) abaixo de lg */}
            <div className="border-t pt-4 xl:border-t-0 xl:pt-0 xl:border-l xl:px-4">
              {!isEditing && (
                <div className="mb-2 form-group">
                  <Label>Transportadora</Label>
                  <Input
                    readOnly
                    value={`${order.carrier?.id} - ${order.carrier?.abbreviation}`}
                  />
                </div>
              )}
              {/* Simulação: sem opções de frete — exibe a transportadora do
                  cliente (gravada com frete = 0 e carrierId = customer.carrierId). */}
              {isEditing && isBudget && (
                <div className="mb-2 form-group">
                  <Label>Transportadora</Label>
                  <Input
                    readOnly
                    value={`${order.customer?.carrier?.id ?? ""} - ${
                      order.customer?.carrier?.name ??
                      order.customer?.carrier?.abbreviation ??
                      ""
                    }`}
                  />
                </div>
              )}
              {isEditing &&
                !isBudget &&
                !order.useCustomerCarrier &&
                order.freightPaymentId != 3 && (
                  <>
                    {" "}
                    <h3 className="font-semibold text-xl">
                      Selecione uma opção de Frete
                    </h3>
                    <div>
                      {/* Skeleton enquanto consulta o frete (e no estado inicial,
                        antes do fetch começar). A tela de erro só aparece em
                        falha real (isFreightError), evitando o "flash" de erro
                        enquanto os dados ainda não chegaram. */}
                      {isCalculatingFreight ||
                      (!isFreightError && freightsData.length === 0) ? (
                        <FreightTableSkeleton />
                      ) : (
                        <FreightTable
                          data={freightsData}
                          selectedCarrierId={order.carrierId}
                          onRefreshCalc={() => getFreights()}
                          onValueChange={(carrierId, value) => {
                            setOrder({
                              ...order,
                              carrierId,
                              freightValue: value,
                            });
                          }}
                        />
                      )}
                    </div>
                  </>
                )}
              {/* Resumo — telas GRANDES (xl): dentro da coluna direita, rola
                  junto com o corpo (layout original, total na 2ª coluna). */}
              <div className="hidden xl:block mt-3 bg-neutral-100 px-4 rounded-md py-2 space-y-2">
                {summaryRows}
              </div>
            </div>
          </div>
          {/* Barra do total — telas MÉDIAS/PEQUENAS (< xl): fixa entre o corpo
              rolável e o rodapé, sempre visível. */}
          <div className="xl:hidden shrink-0 bg-neutral-100 px-4 rounded-md py-2 mt-2 space-y-2 border border-neutral-200">
            {summaryRows}
          </div>
          <DialogFooter className="shrink-0 border-t pt-3">
            <Button variant="secondary" onClick={() => onClose()}>
              Voltar
            </Button>
            {isBudget && isEditing && (
              <Button
                disabled={isSaving || isCalculatingTaxes || isTaxesError}
                variant="green"
                onClick={handleSendOrder}
                className="text-white bg-emerald-600 hover:bg-emerald-600/90"
              >
                {isSaving ? (
                  <div>
                    <Loader2Icon className="size-4" />
                  </div>
                ) : (
                  "Gravar Simulação"
                )}
              </Button>
            )}

            {isEditing && (
              <Button
                onClick={isBudget ? handleGenerateOrder : handleSendOrder}
                disabled={
                  isSaving ||
                  (!isBudget &&
                    (isCalculatingFreight ||
                      isCalculatingTaxes ||
                      isTaxesError)) ||
                  (isBudget && (!order.id || !!order.generatedOrderId))
                }
              >
                {isSaving ? (
                  <div>
                    <Loader2Icon className="size-4" />
                  </div>
                ) : (
                  <span>{isBudget ? "Gerar Pedido" : "Enviar Pedido"}</span>
                )}
              </Button>
            )}
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
};
