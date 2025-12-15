import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CustomersCombo } from "@/components/app/customers-combo";
import { formatNumber } from "@/lib/number-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { formatCpfCnpj } from "@/lib/string-utils";
import { useOrder } from "../-context/order-context";
import { SearchCombo } from "@/components/ui/search-combo";

export const OrderFormHeader = () => {
  const {
    order,
    setCustomer,
    setRepresentative,
    setDiscountPercentual,
    setDeliveryLocation,
    clearItems,
    mode,
  } = useOrder();
  const { showAppDialog } = useAppDialog();
  const isEditing = mode == "NEW" || mode == "EDIT";
  const isNew = isEditing && order.orderId == "";

  function handleChangeCustomer(customer?: CustomerModel) {
    if (!customer) return false;
    if (customer.creditStatus == "3" || customer.creditStatus == "4") {
      showAppDialog({
        title: "Cliente",
        message:
          "Cliente suspenso para implantação de pedidos, por favor, entre em contato com a Thule.",
        type: "warning",
      });
      return false;
    }

    setCustomer(customer);
    setRepresentative(customer.representative);
    setDiscountPercentual(customer.discountPercent);

    if (customer.deliveryLocations && customer.deliveryLocations.length > 0) {
      setDeliveryLocation(customer.deliveryLocations[0]);
    }

    return true;
  }

  const handlePreSelect = async (
    newCustomer: CustomerModel | undefined,
    currentCustomer: CustomerModel | undefined,
    confirm: () => void,
    cancel: () => void
  ) => {
    // Se não há cliente atual (primeira seleção), confirma direto
    if (!currentCustomer) {
      confirm();
      return;
    }
    console.log(newCustomer?.id);
    // Se há itens no pedido, pede confirmação
    if (order.items.length > 0) {
      const dialogResult = await showAppDialog({
        message: "Se trocar o cliente o pedido será redefinido",
        title: "Atenção",
        type: "confirm",
        buttons: [
          { text: "Trocar", variant: "danger", value: true, autoClose: true },
          {
            text: "Cancelar",
            variant: "secondary",
            value: false,
            autoClose: true,
          },
        ],
      });
      if (dialogResult) {
        clearItems();
        confirm();
      } else cancel();
    } else {
      // Se não há itens, confirma direto
      confirm();
    }
  };

  return (
    <>
      <div className=" grid grid-cols-5 gap-x-4 p-2 bg-neutral-50">
        <div className="space-y-2 col-span-2">
          <div className="form-group">
            <Label>Cliente</Label>
            {(!isEditing || !isNew) && (
              <div className="text-sm border px-2.5 rounded-md py-1.5 bg-neutral-100 text-black font-medium">
                {`${order.customerId} - ${order.customer?.abbreviation}`}
                {" - "}
                <span className="text-xs text-muted-foreground">
                  CPF/CNPJ:{" "}
                  {formatCpfCnpj(order.customer?.documentNumber ?? "")}
                </span>
              </div>
            )}
            {isNew && (
              <CustomersCombo
                defaultValue={order.customerId || undefined}
                disabled={!isEditing}
                onSelect={(customer) => handleChangeCustomer(customer)}
                closeOnSelect
                onPreSelect={handlePreSelect}
              />
            )}{" "}
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Representante</Label>
            <SearchCombo
              defaultValue={order.representativeId.toString()}
              apiEndpoint="/registrations/representatives/all"
              labelProp="abbreviation"
              valueProp="id"
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>% Desconto</Label>
            <Input
              className="text-right"
              readOnly
              value={formatNumber(order.discountPercentual, 2) ?? "0,00"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
