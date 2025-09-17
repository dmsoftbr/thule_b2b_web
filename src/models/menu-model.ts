export type MenuModel = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  children?: MenuModel[];
  isActive?: boolean;
};
