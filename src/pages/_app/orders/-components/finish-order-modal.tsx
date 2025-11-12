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
import { useOrder } from "../-hooks/use-order";
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
import type { CalcOrderFreightsRequestDto } from "@/models/dto/requests/calc-freights-request.model";
import type { CalcFreightsResposeDto } from "@/models/dto/responses/calculated-freights-response.model";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FinishOrderModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { currentOrder, setCurrentOrder } = useOrder();
  const { showAppDialog } = useAppDialog();
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
    if (currentOrder.id) {
      // update
      const { data } = await api.patch(`/orders`, currentOrder);
      savedOrderId = data.orderId;
    } else {
      // add
      const { data } = await api.post(`/orders`, currentOrder);
      savedOrderId = data.orderId;
    }

    onClose();
    await showAppDialog({
      type: "success",
      title: currentOrder.isBudget
        ? "Simulação Enviada com Sucesso"
        : "Pedido Enviado com sucesso!",
      message: currentOrder.isBudget
        ? `Gerada a Simulação ${savedOrderId}`
        : `Gerado o Pedido ${savedOrderId}`,
      buttons: [
        { text: "OK", variant: "primary", value: "ok", autoClose: true },
      ],
    });
    navigate({ to: "/orders" });
  }

  const getSubTotal = () => {
    return currentOrder.items.reduce(
      (accum, b) => (accum += b.quantity * b.unitPriceBase),
      0
    );
  };

  const getTotal = () => {
    let grossValue = currentOrder.items.reduce(
      (accum, b) => (accum += b.quantity * b.unitPriceBase),
      0
    );

    if (currentOrder.additionalDiscount > 0) {
      grossValue = roundNumber(
        grossValue -
          (grossValue * (currentOrder?.additionalDiscount ?? 0)) / 100,
        2
      );
    }

    grossValue = roundNumber(
      grossValue -
        (grossValue * (currentOrder?.discountPercentual ?? 0)) / 100 +
        (currentOrder?.freightValue ?? 0),
      2
    );

    // const newOrder = { ...currentOrder, grossValue };
    // setCurrentOrder(newOrder);

    return grossValue;
  };

  const getSelectedDeliveryLocation = () => {
    if (!currentOrder.customer) return undefined;

    const deliveryLocation = currentOrder.customer.deliveryLocations.filter(
      (f) => f.id == currentOrder.deliveryLocationId
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
    if (
      !currentOrder.customer?.paymentConditions ||
      currentOrder.customer?.paymentConditions.length == 0
    )
      return undefined;

    const orderPaymentCondition = currentOrder.customer?.paymentConditions.find(
      (f) => f.id == currentOrder.paymentConditionId
    );

    if (!orderPaymentCondition) return undefined;
    const opt: SearchComboItem = {
      value: orderPaymentCondition.id.toString(),
      label: orderPaymentCondition.name,
      extra: orderPaymentCondition,
      keyworks: [
        orderPaymentCondition.id.toString(),
        orderPaymentCondition.name,
      ],
    };
    return [opt];
  };

  const getPermissions = async () => {
    const data = await getUserPermissions(session?.user.id ?? "");
    setUserPermissions(data ?? []);
  };

  const isItemPermissionDisabled = (permissionId: string) => {
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

    currentOrder.discountPercentual = newPercentual;
    setCurrentOrder({ ...currentOrder });
  };

  const getFreights = async () => {
    setIsCalculatingFreight(true);
    setIsFreightError(false);
    try {
      setFreightsData([]);
      const params: CalcOrderFreightsRequestDto = {
        customerAbbreviation: currentOrder.customer?.abbreviation ?? "",
        deliveryLocationId:
          currentOrder.customer?.deliveryLocations[0].id ?? "",
        orderId: currentOrder.id ?? "",
        totalOrder: getTotal(),
        items: currentOrder.items.map((item) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
            sequence: item.sequence,
          };
        }),
      };
      const { data } = await api.post<CalcFreightsResposeDto[]>(
        `/orders/calculate-freights`,
        params
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
        currentOrder.freightValue =
          currentOrder.freightPaymentId == 1
            ? 0
            : sortedCarriers[0].freightValue;
        setFreightsData(sortedCarriers);
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
    if (currentOrder.items.length == 0) return;
    const params: any[] = [];
    currentOrder.items.map((item) => {
      params.push({
        siteCode: currentOrder.branchId,
        customerCode: currentOrder.customerId,
        itemCode: item.productId,
        quantity: item.quantity,
        negotiatedPrice: item.unitPriceBase,
      });
    });

    const { data } = await api.post(`/order-items/calc-item-taxes`, params);
    console.log(data);
  };

  useEffect(() => {
    if (isOpen) {
      getPaymentConditions();
      console.log(currentOrder.customer);
      getPermissions();
      getFreights();
      getTaxes();
    }
  }, [isOpen]);

  useEffect(() => {
    setOrderValidationMessage("");
    if (selectedPaymentCondition) {
      const orderTotal = getTotal();
      if (
        selectedPaymentCondition.minOrderValue > 0 &&
        orderTotal < selectedPaymentCondition.minOrderValue
      ) {
        setOrderValidationMessage(
          `Para comprar com a condição de pagamento selecionada, seu pedido deve ser de no mínimo R$ ${formatNumber(selectedPaymentCondition.minOrderValue, 2)}`
        );
      }
    }
  }, [selectedPaymentCondition]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70%]">
        <DialogHeader>
          <DialogTitle>
            {currentOrder.isBudget ? "Finalizar Simulação" : "Finalizar Pedido"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col space-y-4 mt-2">
            <div className="grid grid-cols-2 space-x-4">
              <div className="form-group">
                <Label>
                  {currentOrder.isBudget
                    ? "Tipo da Simulação"
                    : "Tipo do Pedido"}
                </Label>
                <Select
                  defaultValue={currentOrder.orderClassificationId.toString()}
                  disabled={isItemPermissionDisabled("317")}
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
                <Input />
              </div>
            </div>
            <div className="form-group">
              <Label>Endereço de Entrega</Label>
              <SearchCombo
                disabled={isItemPermissionDisabled("308")}
                placeholder="Selecione o Endereço de Entrega"
                staticItems={convertArrayToSearchComboItem(
                  currentOrder.customer?.deliveryLocations ?? [],
                  "id",
                  (item) =>
                    `${item.id} - ${item.address} - ${item.city} - ${item.state}`
                )}
                defaultValue={getSelectedDeliveryLocation()}
                onChange={function (value: string): void {
                  console.log(value);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Condição de Pagamento</Label>
              <SearchCombo
                placeholder="Selecione a Condição de Pagamento"
                staticItems={paymentConditionsData}
                defaultValue={getOrderPaymentCondition()}
                onChange={function (value: string): void {
                  const newOrder = { ...currentOrder };
                  const pc = paymentConditionsData.find((f) => f.value == value)
                    ?.extra as PaymentConditionModel;
                  newOrder.paymentConditionId = Number(value);
                  if (pc && pc.additionalDiscountPercent > 0)
                    newOrder.additionalDiscount = pc.additionalDiscountPercent;

                  setCurrentOrder(newOrder);
                  setSelectedPaymentCondition(pc);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Estabelecimento</Label>
              <div className="flex items-center gap-x-2">
                <Select
                  defaultValue={currentOrder.branchId}
                  disabled={isItemPermissionDisabled("309")}
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
                  <Checkbox />
                  Importadora
                </Label>
              </div>
            </div>
            {!isItemPermissionDisabled("312") && (
              <div className="grid grid-cols-2 gap-x-4 ">
                <div className="form-group">
                  <Label>Data Mínima de Faturamento</Label>
                  <DatePicker />
                </div>
                <div className="form-group">
                  <Label>Data Máxima de Faturamento</Label>
                  <DatePicker />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 space-y-2">
              <div className="form-group">
                <Label>
                  <Checkbox
                    checked={currentOrder.isParcialBilling}
                    onCheckedChange={(checked) => {
                      const newOrder = {
                        ...currentOrder,
                        isParcialBilling: checked ? true : false,
                      };
                      setCurrentOrder(newOrder);
                    }}
                  />
                  Fatura Parcial
                </Label>
              </div>
              <div className="form-group">
                {!isItemPermissionDisabled("314") && (
                  <Label>
                    <Checkbox
                      checked={currentOrder.freightPaymentId == 3}
                      onCheckedChange={(checked) => {
                        const newOrder = {
                          ...currentOrder,
                          freightPaymentId: checked ? 3 : 1,
                        };
                        setCurrentOrder(newOrder);
                      }}
                    />
                    Frete Pago
                  </Label>
                )}
              </div>
              <div className="form-group">
                {!isItemPermissionDisabled("315") && (
                  <Label>
                    <Checkbox
                      checked={currentOrder.useCustomerCarrier}
                      onCheckedChange={(checked) => {
                        const newOrder = {
                          ...currentOrder,
                          useCustomerCarrier: checked ? true : false,
                        };
                        setCurrentOrder(newOrder);
                      }}
                    />
                    Usa Transportadora do Cliente
                  </Label>
                )}
              </div>

              {/* {selectedPaymentCondition &&
                selectedPaymentCondition.additionalDiscountPercent > 0 && (
                  <div className="form-group">
                    <Label>
                      <Checkbox />
                      Desconto Adicional
                    </Label>
                  </div>
                )} */}

              <div className="form-group">
                <Label>
                  <Checkbox />
                  Enviar Display com o Pedido
                </Label>
              </div>
            </div>
          </div>
          {/* Segunda coluna */}
          <div className="border-l px-4">
            <h3 className="font-semibold text-xl">
              Selecione uma opção de Frete
            </h3>
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
            <div className="bg-neutral-100 px-4 rounded-md py-2 space-y-2">
              <div className="flex justify-between pr-2">
                <span>
                  Sub-Total{" "}
                  {currentOrder.isBudget ? "da Simulação" : "do Pedido"}:
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
                    max={100}
                    min={0}
                    maxLength={6}
                    value={currentOrder.discountPercentual ?? 0}
                    className={cn(
                      "file:text-foreground text-right placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-[90px] min-w-0 rounded-md border bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "read-only:bg-neutral-100",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    )}
                    onValueChange={(value) =>
                      handleChangeDiscountPercentual(value.floatValue ?? 0)
                    }
                  />
                  <AppTooltip message="Desfazer">
                    <button
                      className="hover:bg-neutral-200 bg-neutral-50 p-1 rounded border border-neutral-300"
                      onClick={() => {
                        handleChangeDiscountPercentual(
                          currentOrder.customer?.discountPercent ?? 0
                        );
                      }}
                    >
                      <Undo2Icon className="size-4" />
                    </button>
                  </AppTooltip>
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
                        value={formatNumber(currentOrder.additionalDiscount, 2)}
                        readOnly
                        className="max-w-[120px] text-right text-orange-600 font-semibold"
                      />
                    </div>
                  </div>
                )}
              <div className="flex justify-between pr-2 text-sm">
                <span>Frete:</span>
                <span>R$ {formatNumber(currentOrder.freightValue, 2)}</span>
              </div>

              <div className="flex justify-between font-medium pr-2 bg-emerald-600 rounded-md py-2 px-2 text-white">
                <span>
                  {currentOrder.isBudget
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
          {currentOrder.isBudget && (
            <Button
              disabled={isCalculatingFreight || isFreightError}
              variant="green"
              onClick={handleSendOrder}
              className="text-emerald-900"
            >
              Gravar Simulação
            </Button>
          )}

          <Button onClick={handleSendOrder} disabled={isCalculatingFreight}>
            {currentOrder.isBudget ? "Gerar" : "Enviar"} Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
