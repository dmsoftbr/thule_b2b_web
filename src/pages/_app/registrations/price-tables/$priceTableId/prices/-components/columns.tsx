import type { ServerTableColumn } from "@/components/server-table/server-table";
import type { PriceModel } from "@/models/registrations/price-model";

export const columns = (): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    className: "w-60",
    key: "id",
    sortable: true,
    renderItem: (item: PriceModel) => {
      return (
        <span className="text-blue-600 font-semibold">{item.productId}</span>
      );
    },
  },
  {
    title: "Cód. Curto",
    dataIndex: "referenceCode",
    key: "referenceCode",
    className: "w-40",
    sortable: true,
    renderItem: (item: PriceModel) => {
      return (
        <span className="text-blue-600 font-semibold ">
          {item.referenceCode}
        </span>
      );
    },
  },
  {
    title: "Descrição",
    dataIndex: "name",
    key: "name",
    sortable: true,
  },
  {
    title: "Preço",
    dataIndex: "price",
    key: "price",
    className: "w-60",
    sortable: true,
  },
];
