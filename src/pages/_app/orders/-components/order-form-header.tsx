import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";

import { CustomersCombo } from "@/components/app/customers-combo";
import { useState } from "react";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useOrder } from "../-hooks/use-order";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import { formatNumber } from "@/lib/number-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";

export const OrderFormHeader = () => {
  const {
    clearItems,
    currentOrder,
    setCustomer,
    setPriceTable,
    setRepresentative,
    setDiscountPercent,
  } = useOrder();
  const [priceTablesData, setPriceTablesData] = useState<SearchComboItem[]>([]);

  function handleChangeCustomer(customer: CustomerModel | undefined) {
    if (!customer) return;
    setCustomer(customer);
    setRepresentative(customer.representative);
    setDiscountPercent(customer.discountPercent);

    if (customer.priceTables && customer.priceTables.length > 0) {
      setPriceTable(customer.priceTables[0]);
      convertPriceTablesToSearchComboItems(customer.priceTables ?? []);
    }
  }

  function convertPriceTablesToSearchComboItems(data: PriceTableModel[]) {
    const newOptions = convertArrayToSearchComboItem(data, "id", "id");
    setPriceTablesData(newOptions);
  }

  function handleChangePriceTable(priceTableId: string) {
    if (
      priceTableId.toLowerCase() != currentOrder?.priceTableId.toLowerCase()
    ) {
      if (currentOrder.items.length > 0) {
        clearItems();
      }
    }
  }

  return (
    <>
      <div className=" grid grid-cols-5 gap-x-4 p-2 bg-neutral-50">
        <div className="space-y-2 col-span-2">
          <div className="form-group">
            <Label>Cliente</Label>
            <CustomersCombo
              onSelect={(customer) => handleChangeCustomer(customer)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="form-group">
            <Label>Tabela de Preço</Label>
            <SearchCombo
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
              value={
                formatNumber(currentOrder.customer?.discountPercent, 2) ??
                "0,01"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
