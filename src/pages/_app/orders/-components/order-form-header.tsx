import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

import {
  CustomersCombo,
  type CustomersComboHandle,
} from "@/components/app/customers-combo";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { formatCpfCnpj } from "@/lib/string-utils";
import { useOrder } from "../-context/order-context";
import { SearchCombo } from "@/components/ui/search-combo";
import { usePermissions } from "@/hooks/use-permissions";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const OrderFormHeader = () => {
  const {
    order,
    setCustomer,
    setRepresentative,
    setDiscountPercentual,
    setDeliveryLocation,
    clearItems,
    mode,
    isBudget,
    setOrder,
  } = useOrder();
  const { showAppDialog } = useAppDialog();
  const { has } = usePermissions();
  const canEditDiscount = has("318");
  const canEditBranch = has("309");
  const canEditRepresentative = has("319");
  const isEditing = mode == "NEW" || mode == "EDIT";
  const isNew = isEditing && order.orderId == "";
  const customersComboRef = useRef<CustomersComboHandle>(null);

  // Foca o combo de cliente ao entrar na tela de novo pedido — economiza um
  // clique e deixa o usuário pronto para Enter/digitar imediatamente.
  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => {
      customersComboRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [isNew]);

  function handleChangeCustomer(customer?: CustomerModel) {
    if (!customer) return false;
    if (customer.creditStatus == "3" || customer.creditStatus == "4") {
      showAppDialog({
        title: "Cliente",
        message: `Cliente suspenso para implantação de ${isBudget ? "simulações" : "pedidos"}, por favor, entre em contato com a Thule.`,
        type: "warning",
      });
      return false;
    }

    if (!customer.salesGroup || customer.salesGroup.length === 0) {
      showAppDialog({
        title: "Cliente",
        message: `Cliente não possui grupo de venda associado. Não é possível incluir ${isBudget ? "simulação" : "pedido"} para este cliente.`,
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
    cancel: () => void,
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
        message: `Se trocar o cliente ${isBudget ? "a atual simulação será apagada" : "o atual pedido será apagado"}`,
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

  // Troca de estabelecimento: mesmo fluxo da troca de cliente — se houver itens,
  // pede confirmação e zera o pedido antes de aplicar o novo estabelecimento.
  const handleChangeBranch = async (branchId: string) => {
    if (branchId === order.branchId) return;

    // Sem itens, aplica direto
    if (order.items.length === 0) {
      setOrder({ ...order, branchId });
      return;
    }

    const dialogResult = await showAppDialog({
      message: `Se trocar o estabelecimento ${isBudget ? "a atual simulação será apagada" : "o atual pedido será apagado"}`,
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
      setOrder({ ...order, branchId, items: [] });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 gap-y-3 p-2 bg-neutral-50">
        <div className="space-y-2 sm:col-span-2 min-w-0">
          <div className="form-group min-w-0">
            <Label>Cliente</Label>
            {(!isEditing || !isNew) && (
              <div className="truncate text-sm border px-2.5 rounded-md py-1.5 bg-neutral-100 text-black font-medium">
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
                ref={customersComboRef}
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
              disabled={!isEditing || !canEditRepresentative}
              showValueInSelectedItem
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>% Desconto</Label>
            <NumericFormat
              // Força o remount ao trocar de cliente para o campo ressincronizar
              // com o desconto do cliente — o react-number-format (controlado)
              // não atualiza o valor exibido após o usuário já ter digitado.
              key={`discount-${order.customerId}`}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              readOnly={!isEditing || !canEditDiscount}
              max={100}
              min={0}
              maxLength={6}
              value={order.discountPercentual ?? 0}
              className={cn(
                "file:text-foreground text-right placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 disabled:border-none disabled:shadow-none",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "read-only:bg-neutral-100",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              )}
              onValueChange={(value) => {
                const v = value.floatValue ?? 0;
                if (v < 0 || v > 100) return;
                setDiscountPercentual(v);
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Estabelecimento</Label>
            <div className="flex items-center gap-x-2">
              <Select
                value={order.branchId}
                onValueChange={(value) => handleChangeBranch(value)}
                disabled
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                </SelectContent>
              </Select>
              <Label className="whitespace-nowrap">
                <Checkbox
                  disabled={!isEditing || !canEditBranch}
                  checked={order.branchId == "1"}
                  onCheckedChange={(checked) => {
                    if (!!checked) {
                      handleChangeBranch("1");
                    } else {
                      handleChangeBranch(order.customer?.branchId ?? "1");
                    }
                  }}
                />
                Trocar Estabelecimento
              </Label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
