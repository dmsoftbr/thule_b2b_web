import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/number-utils";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";
import { EditIcon } from "lucide-react";

interface Props {
  fnEdit: (data: PaymentConditionModel) => void;
  fnDelete: (data: PaymentConditionModel) => void;
  fnConfig: (data: PaymentConditionModel) => void;
}

export const columns = ({ fnEdit }: Props): ServerTableColumn[] => [
  {
    title: "Código",
    dataIndex: "id",
    key: "id",
    sortable: true,
    renderItem: (item: PaymentConditionModel) => {
      return <span className="text-blue-600 font-semibold">{item.id}</span>;
    },
  },
  {
    title: "Descrição",
    dataIndex: "name",
    key: "name",
    sortable: true,
  },
  {
    title: "Ativa p/Venda?",
    dataIndex: "isActive",
    key: "isActive",
    sortable: false,
    renderItem: (row: PaymentConditionModel) => (
      <span>{row.isActive ? "Sim" : "Não"}</span>
    ),
  },
  {
    title: "% Desconto Adicional",
    dataIndex: "additionalDiscountPercent",
    key: "additionalDiscountPercent",
    sortable: true,
    renderItem: (row: PaymentConditionModel) => (
      <span>
        {row.additionalDiscountPercent > 0
          ? formatNumber(row.additionalDiscountPercent, 2)
          : ""}
      </span>
    ),
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    renderItem: (row: PaymentConditionModel) => (
      <div className="flex flex-wrap gap-x-1 items-center">
        <Button
          size="sm"
          type="button"
          onClick={() => {
            fnEdit(row);
          }}
        >
          <EditIcon className="size-4" />
        </Button>
        {/* <Button
          size="sm"
          variant="destructive"
          type="button"
          onClick={() => {
            fnDelete(row);
          }}
        >
          <TrashIcon className="size-4" />
        </Button> */}
      </div>
    ),
  },
];
