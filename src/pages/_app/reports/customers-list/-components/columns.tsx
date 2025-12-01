import type { ServerTableColumn } from "@/components/server-table/server-table";
import { formatNumber } from "@/lib/number-utils";
import { formatCpfCnpj } from "@/lib/string-utils";
import type { CustomerModel } from "@/models/registrations/customer.model";

export const columns = (): ServerTableColumn[] => [
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (customer: CustomerModel) => (
      <span className="font-semibold text-blue-600 ">{customer.id}</span>
    ),
    sortable: true,
  },
  {
    key: "abbreviation",
    dataIndex: "abbreviation",
    title: "Nome Abreviado",
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
    renderItem: (customer: CustomerModel) => <span>{customer.name}</span>,
    sortable: true,
  },
  {
    key: "groupName",
    dataIndex: "groupName",
    title: "Descr.Grupo Cliente",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.group?.name}</span>
    ),
    sortable: true,
  },
  {
    key: "address",
    dataIndex: "address",
    title: "Endereço",
    renderItem: (customer: CustomerModel) => <span>{customer.address}</span>,
    sortable: true,
  },
  {
    key: "city",
    dataIndex: "city",
    title: "Cidade",
    renderItem: (customer: CustomerModel) => <span>{customer.city}</span>,
    sortable: true,
  },
  {
    key: "state",
    dataIndex: "state",
    title: "UF",
    renderItem: (customer: CustomerModel) => <span>{customer.state}</span>,
    sortable: true,
  },
  {
    key: "documentNumber",
    dataIndex: "documentNumber",
    title: "CPF/CNPJ",
    renderItem: (customer: CustomerModel) => (
      <span>{formatCpfCnpj(customer.documentNumber)}</span>
    ),
    sortable: true,
  },
  {
    key: "contactName",
    dataIndex: "contactName",
    title: "Contato",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.contactName}</span>
    ),
    sortable: true,
  },
  {
    key: "carrierId",
    dataIndex: "carrierId",
    title: "Transportadora",
    renderItem: (customer: CustomerModel) => (
      <span>{customer.carrier.abbreviation}</span>
    ),
    sortable: true,
  },
  {
    key: "discountPercent",
    dataIndex: "discountPercent",
    title: "% Desconto",
    renderItem: (customer: CustomerModel) => (
      <span>{formatNumber(customer.discountPercent, 2)}</span>
    ),
    sortable: false,
  },
];
