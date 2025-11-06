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
import { formatNumber } from "@/lib/number-utils";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { type DeliveryLocationModel } from "@/models/delivery-location.model";
import type { PaymentConditionModel } from "@/models/payment-condition.model";
import { type UserPermissionModel } from "@/models/admin/user-permission.model";
import { getUserPermissions } from "../-utils/order-utils";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FinishOrderModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { currentOrder, setCurrentOrder } = useOrder();
  const { showAppDialog } = useAppDialog();
  const [deliveryLocationsData, setDeliveryLocationsData] = useState<
    SearchComboItem[]
  >([]);
  const [paymentConditionsData, setPaymentConditionsData] = useState<
    SearchComboItem[]
  >([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionModel[]>(
    []
  );

  async function handleSendOrder() {
    onClose();
    await showAppDialog({
      type: "success",
      title: currentOrder.isBudget
        ? "Simulação Enviada com Sucesso"
        : "Pedido Enviado com sucesso!",
      message: currentOrder.isBudget
        ? "Gerada a Simulação S000000"
        : "Gerado o Pedido P000000",
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
    const grossValue = currentOrder.items.reduce(
      (accum, b) => (accum += b.quantity * b.unitPriceBase),
      0
    );

    return (
      grossValue -
      (currentOrder?.freightValue ?? 0) -
      (grossValue * (currentOrder?.discountPercentual ?? 0)) / 100
    );
  };

  const getDeliveryLocations = async () => {
    const { data } = await api.get<DeliveryLocationModel[]>(
      `/registrations/delivery-locations/${currentOrder.customerId}`
    );
    const newData = data.map((item) => {
      return {
        value: item.id,
        label: `${item.id} - ${item.address} - ${item.city} - ${item.state}`,
        extraData: item,
      };
    });

    setDeliveryLocationsData(newData);
  };

  const getOrderDeliveryLocation = () => {
    if (!deliveryLocationsData || deliveryLocationsData.length == 0)
      return undefined;

    const orderDeliveryLocation = deliveryLocationsData.find(
      (f) => f.value == currentOrder.deliveryLocationId
    );

    if (!orderDeliveryLocation) return undefined;
    return [orderDeliveryLocation];
  };

  const getPaymentConditions = async () => {
    const { data } = await api.get<PaymentConditionModel[]>(
      `/registrations/payment-conditions/all`
    );

    const newData = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.id} - ${item.name}`,
        extraData: item,
      };
    });

    setPaymentConditionsData(newData);
  };

  const getOrderPaymentCondition = () => {
    if (!paymentConditionsData || paymentConditionsData.length == 0)
      return undefined;

    const orderPaymentCondition = paymentConditionsData.find(
      (f) => f.value == currentOrder.paymentConditionId.toString()
    );

    if (!orderPaymentCondition) return undefined;
    return [orderPaymentCondition];
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

  useEffect(() => {
    if (isOpen) {
      getDeliveryLocations();
      getPaymentConditions();
      getPermissions();
    }
  }, [isOpen]);

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
            <div className="form-group">
              <Label>
                {currentOrder.isBudget ? "Tipo da Simulação" : "Tipo do Pedido"}
              </Label>
              <Select
                defaultValue="1"
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
              <Label>Nº Pedido do Cliente</Label>
              <Input />
            </div>
            <div className="form-group">
              <Label>Endereço de Entrega</Label>
              <SearchCombo
                disabled={isItemPermissionDisabled("308")}
                placeholder="Selecione o Endereço de Entrega"
                staticItems={deliveryLocationsData}
                defaultValue={getOrderDeliveryLocation()}
                onChange={function (value: string): void {
                  console.log(value);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Condição de Pagamento</Label>
              <SearchCombo
                disabled={isItemPermissionDisabled("307")}
                placeholder="Selecione a Condição de Pagamento"
                staticItems={paymentConditionsData}
                defaultValue={getOrderPaymentCondition()}
                onChange={function (value: string): void {
                  console.log(value);
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

              <div className="form-group">
                <Label>
                  <Checkbox />
                  Desconto Adicional
                </Label>
              </div>

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
            <FreightTable />
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
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  max={100}
                  min={0}
                  maxLength={6}
                  defaultValue={currentOrder.customer?.discountPercent ?? 0}
                  className={cn(
                    "file:text-foreground text-right placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-[90px] min-w-0 rounded-md border bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "read-only:bg-neutral-100",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  )}
                />
              </div>
              <div className="flex justify-between pr-2 text-sm">
                <span>Frete:</span>
                <span>R$ 0,00</span>
              </div>

              <div className="flex justify-between font-medium pr-2 bg-emerald-600 rounded-md py-2 px-2 text-white">
                <span>
                  {currentOrder.isBudget
                    ? "Total da Simulação"
                    : "Total do Pedido"}{" "}
                </span>
                <span>R$ {formatNumber(getTotal(), 2)}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose()}>
            Voltar
          </Button>
          {currentOrder.isBudget && (
            <Button
              variant="green"
              onClick={handleSendOrder}
              className="text-emerald-900"
            >
              Gravar Simulação
            </Button>
          )}
          <Button onClick={handleSendOrder}>
            {currentOrder.isBudget ? "Gerar" : "Enviar"} Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
