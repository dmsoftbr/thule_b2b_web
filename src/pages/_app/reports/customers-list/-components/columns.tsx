import type { ServerTableColumn } from "@/components/server-table/server-table";
import { formatNumber } from "@/lib/number-utils";
import { formatCpfCnpj } from "@/lib/string-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";

export const columns = (): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span className="font-semibold text-blue-600 ">{customer.id}</span>
    ),
    sortable: true,
  },
  {
    key: "abbreviation",
    dataIndex: "abbreviation",
    title: "Nome Abreviado",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span className="font-semibold text-blue-600 ">
        {customer.abbreviation}
      </span>
    ),
    sortable: true,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Razão Social",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => <span>{customer.name}</span>,
    sortable: true,
  },
  {
    key: "groupName",
    dataIndex: "groupName",
    title: "Descr.Grupo Cliente",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.group?.name}</span>
    ),
    sortable: true,
  },
  {
    key: "priceExceptionTables",
    dataIndex: "priceExceptionTables",
    title: "Grupo de Desconto",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>
        {customer.priceExceptionTables
          ?.map((e) => e.exceptionTableId)
          .filter(Boolean)
          .join(", ")}
      </span>
    ),
    sortable: false,
  },
  {
    key: "address",
    dataIndex: "address",
    title: "Endereço",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => <span>{customer.address}</span>,
    sortable: true,
  },
  {
    key: "city",
    dataIndex: "city",
    title: "Cidade",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => <span>{customer.city}</span>,
    sortable: true,
  },
  {
    key: "state",
    dataIndex: "state",
    title: "UF",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => <span>{customer.state}</span>,
    sortable: true,
  },
  {
    key: "documentNumber",
    dataIndex: "documentNumber",
    title: "CPF/CNPJ",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>{formatCpfCnpj(customer.documentNumber)}</span>
    ),
    sortable: true,
  },
  {
    key: "contactName",
    dataIndex: "contactName",
    title: "Contato",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.contactName}</span>
    ),
    sortable: true,
  },
  {
    key: "carrierId",
    dataIndex: "carrierId",
    title: "Transportadora",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.carrier.abbreviation}</span>
    ),
    sortable: true,
  },
  {
    key: "discountPercent",
    dataIndex: "discountPercent",
    title: "% Desconto",
    className: "text-xs",
    cellClassName: "text-xs",
    renderItem: (customer: CustomerModel) => (
      <span>{formatNumber(customer.discountPercent, 2)}</span>
    ),
    sortable: false,
  },
];
