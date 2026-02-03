import { type PagedRequestModel } from "./paged-request.model";

export type ProductPagedRequestModel = PagedRequestModel & {
  familyIds?: string[];
  groupIds?: number[];
  commercialFamilyIds?: string[];
  itemTypeIds?: string[];
};
