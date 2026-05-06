export type MenuModel = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  children?: MenuModel[];
  isActive?: boolean;
  /**
   * Quando definida, o item só é exibido se o usuário possuir essa permissão.
   * Sem `permissionId`, o item é sempre exibido.
   */
  permissionId?: string;
};
