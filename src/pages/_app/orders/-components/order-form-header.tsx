import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";

import { CustomersCombo } from "@/components/app/customers-combo";
import { useEffect, useState } from "react";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useOrder } from "../-hooks/use-order";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { formatNumber } from "@/lib/number-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";
import { toast } from "sonner";
import { handleError } from "@/lib/api";
import type { UserPermissionModel } from "@/models/admin/user-permission.model";
import { getUserPermissions } from "../-utils/order-utils";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  isEditing: boolean;
}

export const OrderFormHeader = ({ isEditing }: Props) => {
  const {
    clearItems,
    currentOrder,
    setCustomer,
    setPriceTable,
    setRepresentative,
    setDiscountPercent,
    setDeliveryLocation,
  } = useOrder();
  const { session } = useAuth();
  const [priceTablesData, setPriceTablesData] = useState<SearchComboItem[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionModel[]>(
    []
  );

  const getPermissions = async () => {
    const data = await getUserPermissions(session?.user.id ?? "");
    setUserPermissions(data ?? []);
  };

  const isItemPermissionDisabled = (permissionId: string) => {
    const item = userPermissions.find((f) => f.permissionId == permissionId);

    if (!item) return true;
    return !item.isPermitted;
  };

  function handleChangeCustomer(customer: CustomerModel | undefined) {
    if (!customer) return;
    setCustomer(customer);
    setRepresentative(customer.representative);
    setDiscountPercent(customer.discountPercent);

    if (customer.priceTables && customer.priceTables.length > 0) {
      setPriceTable(customer.priceTables[0]);
      convertPriceTablesToSearchComboItems(customer.priceTables ?? []);
    }

    if (customer.deliveryLocations && customer.deliveryLocations.length > 0) {
      setDeliveryLocation(customer.deliveryLocations[0]);
    }
  }

  function convertPriceTablesToSearchComboItems(data: PriceTableModel[]) {
    const newOptions = convertArrayToSearchComboItem(data, "id", "id");
    setPriceTablesData(newOptions);
  }

  function handleChangePriceTable(priceTableId: string) {
    try {
      if (
        priceTableId.toLowerCase() != currentOrder?.priceTableId.toLowerCase()
      ) {
        const pt = priceTablesData.find((f) => f.value == priceTableId);
        if (!pt) throw new Error("Tabela de Preço Inválida");

        setPriceTable(pt.extra);

        if (currentOrder.items.length > 0) {
          clearItems();
        }
      }
    } catch (error) {
      toast.error(handleError(error));
    }
  }

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <>
      <div className=" grid grid-cols-5 gap-x-4 p-2 bg-neutral-50">
        <div className="space-y-2 col-span-2">
          <div className="form-group">
            <Label>Cliente</Label>
            <CustomersCombo
              defaultValue={currentOrder.customerId || undefined}
              disabled={!isEditing}
              onSelect={(customer) => handleChangeCustomer(customer)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Tabela de Preço</Label>
            {currentOrder.orderClassificationId == 6 && (
              <Input value="Outlet" readOnly />
            )}
            {currentOrder.orderClassificationId < 6 && (
              <SearchCombo
                disabled={!isEditing || isItemPermissionDisabled("316")}
                key={priceTablesData.length > 0 ? 1 : 0}
                placeholder="Selecione a Tabela de Preço"
                staticItems={priceTablesData}
                defaultValue={[
                  currentOrder.priceTable
                    ? {
                        value: currentOrder.priceTable.id ?? "",
                        label: currentOrder.priceTable.id ?? "",
                      }
                    : { value: "", label: "" },
                ]}
                onChange={(priceTableId: string) =>
                  handleChangePriceTable(priceTableId)
                }
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Representante</Label>
            <Input
              readOnly
              defaultValue={currentOrder.representative?.abbreviation ?? ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>% Desconto</Label>
            <Input
              className="text-right"
              readOnly
              value={formatNumber(currentOrder.discountPercentual, 2) ?? "0,00"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
