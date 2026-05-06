export type PermissionItem = {
  id: string;
  label: string;
  /** rota TanStack a ser bloqueada quando a permissão não está concedida; opcional */
  path?: string;
};

export const PERMISSIONS_DASHBOARDS: PermissionItem[] = [
  { id: "1002", label: "Vendas por Período", path: "/dashboards/dashboard1" },
  { id: "1003", label: "Vendas por Família", path: "/dashboards/dashboard2" },
  { id: "1004", label: "Ano Atual x Anterior", path: "/dashboards/dashboard3" },
  { id: "1005", label: "Vendas por UF", path: "/dashboards/dashboard4" },
  { id: "1006", label: "Partner", path: "/dashboards/dashboard5" },
  { id: "1007", label: "Grupo de Produto", path: "/dashboards/dashboard6" },
  { id: "1008", label: "Ranking Produtos", path: "/dashboards/dashboard7" },
  { id: "1009", label: "Metas x Realizado", path: "/dashboards/dashboard8" },
  { id: "1010", label: "País x Ano", path: "/dashboards/dashboard9" },
];

export const PERMISSIONS_OUTLET: PermissionItem[] = [
  { id: "18", label: "Outlet", path: "/outlet" },
];

export const PERMISSIONS_ORDERS: PermissionItem[] = [
  { id: "16", label: "Pedidos", path: "/orders" },
];

export const PERMISSIONS_BUDGETS: PermissionItem[] = [
  { id: "17", label: "Simulações", path: "/budgets" },
];

export const PERMISSIONS_ORDER_CONFIRMATION: PermissionItem[] = [
  { id: "15", label: "Confirmação Pedido", path: "/order-confirmation" },
];

export const PERMISSIONS_QUERIES: PermissionItem[] = [
  { id: "19", label: "Estoque Disponível", path: "/stock/product-stock" },
  { id: "20", label: "ESLI011", path: "/stock/esli011" },
];

export const PERMISSIONS_REPORTS: PermissionItem[] = [
  { id: "206", label: "Comissão", path: "/reports/comissao" },
  { id: "201", label: "Lista de Clientes", path: "/reports/customers-list" },
  { id: "202", label: "Lista de Pedidos", path: "/reports/lista-pedidos" },
  { id: "203", label: "Prod. Vendidos Período", path: "/reports/prod-vendidos-periodo" },
  { id: "209", label: "Prod. Vendidos Mensal", path: "/reports/prod-vendidos-mensal" },
  { id: "204", label: "Faturamento Cliente", path: "/reports/faturamento-cliente" },
  { id: "210", label: "Faturamento Fiscal", path: "/reports/faturamento-fiscal" },
  { id: "207", label: "Títulos Financeiros", path: "/reports/titulos-financeiros" },
  { id: "211", label: "Lista de Preço", path: "/reports/lista-preco" },
  { id: "205", label: "Análise de Desempenho" },
  { id: "208", label: "Itens sem Saldo" },
];

export const PERMISSIONS_APPROVALS: PermissionItem[] = [
  { id: "9", label: "Aprovações", path: "/approvals" },
  { id: "10", label: "Aprovações" },
];

export const PERMISSIONS_REGISTRATIONS: PermissionItem[] = [
  { id: "1", label: "Metas Representantes", path: "/registrations/representative-goals" },
  { id: "6", label: "Alçadas de Aprovação", path: "/registrations/approval-levels" },
  { id: "7", label: "Produtos", path: "/registrations/products" },
  { id: "21", label: "Mensagens SKU", path: "/registrations/sku-messages" },
  { id: "22", label: "Tipo Item", path: "/registrations/item-types" },
  { id: "8", label: "Clientes", path: "/registrations/customers" },
  { id: "2", label: "Cond. de Pagamento", path: "/registrations/payment-conditions" },
  { id: "3", label: "Tabelas de Preço", path: "/registrations/price-tables" },
  { id: "4", label: "Grupos de Venda", path: "/registrations/sales-group" },
  { id: "5", label: "Avisos", path: "/admin/notices" },
];

export const PERMISSIONS_APP_ADMIN: PermissionItem[] = [
  { id: "101", label: "Notificações" },
  { id: "102", label: "Comunicados" },
  { id: "103", label: "Links Úteis" },
];

export const PERMISSIONS_SETTINGS: PermissionItem[] = [
  { id: "11", label: "Grupos de Usuários", path: "/admin/user-groups" },
  { id: "12", label: "Usuários", path: "/admin/users" },
  { id: "13", label: "Configurações", path: "/admin/settings" },
  { id: "14", label: "Sincronização", path: "/system/sync-status" },
];

export const PERMISSIONS_SALES: PermissionItem[] = [
  { id: "301", label: "Alterar Pedido Aprovado" },
  { id: "302", label: "Reprovar Pedido Aprovado" },
  { id: "303", label: "Reintegrar Pedido com Erro" },
  { id: "318", label: "Alterar % Desconto no Pedido" },
  { id: "305", label: "Alterar Preço" },
  { id: "307", label: "Alterar Condição de Pagamento" },
  { id: "308", label: "Alterar Local de Entrega" },
  { id: "309", label: "Alterar Estabelecimento" },
  { id: "310", label: "Alterar Moeda" },
  { id: "311", label: "Alterar Transportadora" },
  { id: "312", label: "Alterar Datas Mínima/Máxima de Faturamento" },
  { id: "313", label: "Alterar Pedido Faturado Parcial" },
  { id: "314", label: "Alterar Frete Pago" },
  { id: "315", label: "Alterar Usa Transportadora do Cliente" },
  { id: "316", label: "Alterar Tabela de Preço" },
  { id: "317", label: "Alterar Classificação do Pedido" },
];

export const ALL_PERMISSIONS: PermissionItem[] = [
  ...PERMISSIONS_DASHBOARDS,
  ...PERMISSIONS_OUTLET,
  ...PERMISSIONS_ORDERS,
  ...PERMISSIONS_BUDGETS,
  ...PERMISSIONS_ORDER_CONFIRMATION,
  ...PERMISSIONS_QUERIES,
  ...PERMISSIONS_REPORTS,
  ...PERMISSIONS_APPROVALS,
  ...PERMISSIONS_REGISTRATIONS,
  ...PERMISSIONS_APP_ADMIN,
  ...PERMISSIONS_SETTINGS,
  ...PERMISSIONS_SALES,
];
