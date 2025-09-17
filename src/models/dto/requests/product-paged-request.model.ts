import { type PagedRequestModel } from "./paged-request.model";

export type ProductPagedRequestModel = PagedRequestModel & {
  familyIds?: string[];
  groupIds?: number[];
  commercialFamilyIds?: string[];
  productTypeIds?: string[];
};
