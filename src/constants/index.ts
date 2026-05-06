export const USER_ROLES = [
  { id: "1", name: "ADMINISTRATIVO" },
  { id: "2", name: "REPRESENTANTE" },
  { id: "3", name: "CLIENTE" },
];

/** Roles consideradas administrativas com acesso global. */
export const ADMIN_ROLE_IDS = ["0", "1"] as const;
export const isAdminRole = (role: string | number | undefined | null) =>
  role !== undefined && role !== null && ADMIN_ROLE_IDS.includes(String(role) as any);

export const PRODUCT_ACTIVE_STATES = [
  "",
  "Ativo",
  "Obsoleto Ordens Automáticas",
  "Obsoleto Todas as Ordens",
  "Totalmente Obsoleto",
];

export const ORDER_CLASSIFICATIONS = [
  { id: "1", label: "Venda" },
  { id: "2", label: "Venda Cliente Final" },
  { id: "3", label: "Bonificação" },
  { id: "4", label: "Remessa Consignação" },
  { id: "5", label: "Garantia" },
  { id: "6", label: "Outlet" },
];
