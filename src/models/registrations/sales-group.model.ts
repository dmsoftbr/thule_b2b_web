import type { SalesGroupDetailModel } from "./sales-group-detail.model";

export type SalesGroupModel = {
  id: string;
  name: string;
  details?: SalesGroupDetailModel[];
};
