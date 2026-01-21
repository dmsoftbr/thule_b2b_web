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
import { FreightTable } from "./freight-table";
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
import { formatNumber, roundNumber } from "@/lib/number-utils";
import { api, handleError } from "@/lib/api";
import { useEffect, useState } from "react";
import { type UserPermissionModel } from "@/models/admin/user-permission.model";
import { getUserPermissions } from "../-utils/order-utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2Icon, Undo2Icon } from "lucide-react";
import { AppTooltip } from "@/components/layout/app-tooltip";
import type {
  CalcOrderFreightsItem,
  CalcOrderFreightsRequestDto,
} from "@/models/dto/requests/calc-freights-request.model";
import type { CalcFreightsResposeDto } from "@/models/dto/responses/calculated-freights-response.model";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";
import { InputMask } from "@/components/ui/input-mask";
import { useOrder } from "../-context/order-context";
import { TaxesModal } from "./taxes-modal";

interface Props {
  isOpen: boolean;
  //isEditing: boolean;
  onClose: () => void;
}

export const FinishOrderModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { order, mode, setOrder, getOrderTotalTaxes } = useOrder();
  const { showAppDialog } = useAppDialog();

  const isEditing = mode == "NEW" || mode == "EDIT";

  const [orderValidationMessage, setOrderValidationMessage] = useState("");
  const [paymentConditionsData, setPaymentConditionsData] = useState<
    SearchComboItem[]
  >([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionModel[]>(
    []
  );
  const [freightsData, setFreightsData] = useState<CalcFreightsResposeDto[]>(
    []
  );

  const [selectedPaymentCondition, setSelectedPaymentCondition] = useState<
    PaymentConditionModel | undefined
  >(undefined);

  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
  const [isFreightError, setIsFreightError] = useState(false);

  async function handleSendOrder() {
    //save the order / budget
    let savedOrderId = "";
    const orderData = { ...order, history: [] };

    orderData.items.map((item) => (item.taxes = []));

    if (order.id) {
      // update
      const { data } = await api.patch(`/orders`, orderData);
      savedOrderId = data.orderId;
    } else {
      // add
      const { data } = await api.post(`/orders`, orderData);
      savedOrderId = data.orderId;
    }

    if (orderData.maxBillingDate) {
      await showAppDialog({
        title: "ATENÇÃO",
        message:
          "Você informou uma Data Mínima de Faturamento. Favor entrar em contato com a THULE pelo e-mail <b>pedidos.itupeva@thule.com<b/> e solicitar a alocação do estoque para este Pedido.",
        type: "info",
      });
    }

    onClose();
    await showAppDialog({
      type: "success",
      title: order.isBudget
        ? "Simulação Enviada com Sucesso"
        : "Pedido Enviado com sucesso!",
      message: order.isBudget
        ? `Gerada a Simulação ${savedOrderId}`
        : `Gerado o Pedido ${savedOrderId}`,
      buttons: [
        { text: "OK", variant: "primary", value: "ok", autoClose: true },
      ],
    });
    if (order.isBudget) navigate({ to: "/budgets" });
    else navigate({ to: "/orders" });
  }

  const getSubTotal = () => {
    return order.items.reduce(
      (accum, b) => (accum += b.orderQuantity * b.inputPrice),
      0
    );
  };

  const getTotal = () => {
    let grossValue = order.items.reduce(
      (accum, b) => (accum += b.orderQuantity * b.inputPrice),
      0
    );

    if (order.additionalDiscount > 0) {
      grossValue = roundNumber(
        grossValue - (grossValue * (order?.additionalDiscount ?? 0)) / 100,
        2
      );
    }

    grossValue = roundNumber(
      grossValue -
        (grossValue * (order?.discountPercentual ?? 0)) / 100 +
        (order?.freightValue ?? 0),
      2
    );

    return grossValue;
  };

  const getSelectedDeliveryLocation = () => {
    if (!order.customer) return undefined;
    const deliveryLocation = order.customer.deliveryLocations.filter(
      (f) => f.id == order.deliveryLocationId
    );

    if (!deliveryLocation) return undefined;
    const dlArray = convertArrayToSearchComboItem(
      deliveryLocation,
      "id",
      (item) => `${item.id} - ${item.address} - ${item.city} - ${item.state}`
    );
    return [dlArray[0]];
  };

  const getPaymentConditions = async () => {
    const { data } = await api.get<PaymentConditionModel[]>(
      `/registrations/payment-conditions/all?onlyActives=true`
    );

    const newData = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.id} - ${item.name}`,
        extra: item,
      };
    });

    setPaymentConditionsData(newData);
  };

  const getOrderPaymentCondition = () => {
    const orderPaymentCondition = paymentConditionsData.find(
      (f) => f.value == order.paymentConditionId.toString()
    );

    if (!orderPaymentCondition) return undefined;

    return [orderPaymentCondition];
  };

  const getPermissions = async () => {
    const data = await getUserPermissions(session?.user.id ?? "");
    setUserPermissions(data ?? []);
  };

  const isItemPermissionDisabled = (permissionId: string) => {
    if (session?.user.role == 0) return false;

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

    order.discountPercentual = newPercentual;
    setOrder({ ...order });
  };

  const getFreights = async () => {
    if (!isEditing) return;
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
        { ttParam: ttParam, ttItems: ttItems }
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
        order.freightValue =
          order.freightPaymentId == 1 ? 0 : sortedCarriers[0].freightValue;
        setFreightsData(sortedCarriers);
        setOrder({
          ...order,
          freightValue: sortedCarriers[0].freightValue,
          carrierId: sortedCarriers[0].carrierId,
        });
      }
    } catch (error) {
      setIsFreightError(true);
      console.log(error);
      toast.error(handleError(error));
    } finally {
      setIsCalculatingFreight(false);
    }
  };

  const getTaxes = async () => {
    try {
      if (!isEditing) return;
      if (order.items.length == 0) return;
      const params: any[] = [];
      order.items.map((item) => {
        params.push({
          siteCode: order.branchId,
          customerCode: order.customerId,
          itemCode: item.productId,
          quantity: item.orderQuantity,
          negotiatedPrice: item.inputPrice,
        });
      });

      const { data } = await api.post(`/order-items/calc-item-taxes`, params);
      if (data) {
        console.log(data);
      }
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  useEffect(() => {
    if (isOpen) {
      getPaymentConditions();
      getPermissions();
      getFreights();
      getTaxes();
    }
  }, [isOpen]);

  useEffect(() => {
    setOrderValidationMessage("");
    const orderTotal = getTotal();
    if (selectedPaymentCondition) {
      if (
        selectedPaymentCondition.minOrderValue > 0 &&
        orderTotal < selectedPaymentCondition.minOrderValue
      ) {
        setOrderValidationMessage(
          `Para comprar com a condição de pagamento selecionada, seu pedido deve ser de no mínimo R$ ${formatNumber(selectedPaymentCondition.minOrderValue, 2)}`
        );
      }
    }

    if (order.customer) {
      if (
        order.customer.minValuePayedFreight > 0 &&
        order.freightPaymentId == 1 &&
        orderTotal < order.customer.minValuePayedFreight
      ) {
      }
    }
  }, [selectedPaymentCondition, order.grossTotalValue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Finalizar " : "Resumo de "}{" "}
            {order.isBudget ? "Simulação" : "Pedido"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col space-y-4 mt-2">
            <div className="grid grid-cols-2 space-x-4">
              <div className="form-group">
                <Label>
                  {order.isBudget ? "Tipo da Simulação" : "Tipo do Pedido"}
                </Label>
                <Select
                  defaultValue={order.orderClassificationId.toString()}
                  disabled={!isEditing || isItemPermissionDisabled("317")}
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
                    <SelectItem value="6">Outlet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label>Nº Pedido Distribuidor</Label>
                <Input disabled={!isEditing} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <Label>Nº Whatsapp</Label>
                <InputMask
                  value={order.whatAppPhoneNumber}
                  onChange={(value) => {
                    order.whatAppPhoneNumber = value ?? "";
                    setOrder(order);
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
                    `${item.id} - ${item.address} - ${item.city} - ${item.state}`
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
                  onChange={function (value: string): void {
                    const newOrder = { ...order };
                    const pc = paymentConditionsData.find(
                      (f) => f.value == value
                    )?.extra as PaymentConditionModel;
                    newOrder.paymentConditionId = Number(value);
                    if (pc && pc.additionalDiscountPercent > 0)
                      newOrder.additionalDiscount =
                        pc.additionalDiscountPercent;

                    setOrder(newOrder);
                    setSelectedPaymentCondition(pc);
                  }}
                />
              )}
            </div>
            <div className="form-group">
              <Label>Estabelecimento</Label>
              <div className="flex items-center gap-x-2">
                <Select
                  defaultValue={order.branchId}
                  disabled={!isEditing || isItemPermissionDisabled("309")}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                  </SelectContent>
                </Select>
                <Label>
                  <Checkbox disabled={!isEditing} />
                  Importadora
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 ">
              <div className="form-group">
                <Label>Faturar em</Label>
                <DatePicker
                  disabled={!isEditing || isItemPermissionDisabled("312")}
                />
              </div>
              <div className="form-group">
                <Label>Faturar no Máximo até</Label>
                <DatePicker
                  disabled={!isEditing || isItemPermissionDisabled("312")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 space-y-2">
              <div className="form-group">
                <Label>
                  <Checkbox
                    disabled={!isEditing}
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
                    disabled={!isEditing || isItemPermissionDisabled("314")}
                    checked={order.freightPaymentId == 3}
                    onCheckedChange={(checked) => {
                      const newOrder = {
                        ...order,
                        freightPaymentId: checked ? 3 : 1,
                      };
                      setOrder(newOrder);
                    }}
                  />
                  Frete Pago
                </Label>
              </div>
              <div className="form-group">
                <Label>
                  <Checkbox
                    disabled={!isEditing || isItemPermissionDisabled("315")}
                    checked={order.useCustomerCarrier}
                    onCheckedChange={(checked) => {
                      console.log("aki");
                      const newOrder = {
                        ...order,
                        useCustomerCarrier: checked ? true : false,
                      };
                      if (checked == true) {
                        newOrder.freightValue = 0;
                        newOrder.freightTypeId = 4;
                        newOrder.carrierId = newOrder.customer?.carrierId ?? 0;
                      }
                      setOrder(newOrder);
                      if (!checked) {
                        setTimeout(() => {
                          getFreights();
                        }, 1000);
                      }
                    }}
                  />
                  Usa Transportadora do Cliente
                </Label>
              </div>
              <div className="form-group">
                <Label>
                  <Checkbox disabled={!isEditing} />
                  Enviar Display com o Pedido
                </Label>
              </div>
            </div>
          </div>
          {/* Segunda coluna */}
          <div className="border-l px-4">
            {!isEditing && (
              <div className="mb-2 form-group">
                <Label>Transportadora</Label>
                <Input
                  readOnly
                  value={`${order.carrier?.id} - ${order.carrier?.abbreviation}`}
                />
              </div>
            )}
            {isEditing && (
              <>
                {" "}
                <h3 className="font-semibold text-xl">
                  Selecione uma opção de Frete
                </h3>
                <div>
                  {isCalculatingFreight && (
                    <div className="flex items-center justify-center h-[100px] border">
                      <Loader2Icon className="animate-spin mr-1.5 text-blue-600" />
                      <span>Caculando Frete. Aguarde...</span>
                    </div>
                  )}
                  {!isCalculatingFreight && (
                    <FreightTable
                      data={freightsData}
                      onRefreshCalc={() => getFreights()}
                    />
                  )}
                </div>
              </>
            )}
            <div className="bg-neutral-100 px-4 rounded-md py-2 space-y-2">
              <div className="flex justify-between pr-2">
                <span>
                  Sub-Total {order.isBudget ? "da Simulação" : "do Pedido"}:
                </span>
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
                    disabled
                    max={100}
                    min={0}
                    maxLength={6}
                    value={order.discountPercentual ?? 0}
                    className={cn(
                      "file:text-foreground text-right placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-[90px] min-w-0 rounded-md border bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 disabled:border-none disabled:shadow-none",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "read-only:bg-neutral-100",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    )}
                    onValueChange={(value) =>
                      handleChangeDiscountPercentual(value.floatValue ?? 0)
                    }
                  />
                  {isEditing && (
                    <AppTooltip message="Desfazer">
                      <button
                        className="hover:bg-neutral-200 bg-neutral-50 p-1 rounded border border-neutral-300"
                        onClick={() => {
                          handleChangeDiscountPercentual(
                            order.customer?.discountPercent ?? 0
                          );
                        }}
                      >
                        <Undo2Icon className="size-4" />
                      </button>
                    </AppTooltip>
                  )}
                </div>
              </div>
              {selectedPaymentCondition &&
                selectedPaymentCondition.additionalDiscountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <Label className="text-orange-500">
                      % Desconto Adicional:
                    </Label>
                    <div className="flex gap-x-1.5 items-center">
                      <Input
                        value={formatNumber(order.additionalDiscount, 2)}
                        readOnly
                        className="max-w-[120px] text-right text-orange-600 font-semibold"
                      />
                    </div>
                  </div>
                )}
              <div className="flex justify-between pr-2 text-sm">
                <span>Frete:</span>
                <span>R$ {formatNumber(order.freightValue, 2)}</span>
              </div>
              <div className="flex justify-between pr-2 text-sm">
                <div className="flex">
                  <TaxesModal />
                  Impostos:
                </div>

                <span>R$ {formatNumber(getOrderTotalTaxes(), 2)}</span>
              </div>
              <div className="flex justify-between font-medium pr-2 bg-emerald-600 rounded-md py-2 px-2 text-white">
                <span>
                  {order.isBudget
                    ? "Total da Simulação"
                    : "Total do Pedido"}{" "}
                </span>
                <span>R$ {formatNumber(getTotal(), 2)}</span>
              </div>

              {orderValidationMessage && (
                <div className="flex items-center justify-center font-medium bg-red-200 text-whit p-2">
                  {orderValidationMessage}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose()}>
            Voltar
          </Button>
          {order.isBudget && isEditing && (
            <Button
              disabled={isCalculatingFreight || isFreightError}
              variant="green"
              onClick={handleSendOrder}
              className="text-emerald-900"
            >
              Gravar Simulação
            </Button>
          )}

          {isEditing && (
            <Button onClick={handleSendOrder} disabled={isCalculatingFreight}>
              {order.isBudget ? "Gerar" : "Enviar"} Pedido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
