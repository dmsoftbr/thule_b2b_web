import type { ProductFamilyModel } from "./product-family.model";
import type { ProductGroupModel } from "./registrations/product-group.model";

export type ProductModel = {
  id: string;
  description: string;
  measureUnity: string;
  groupId: number;
  familyId: string;
  commercialFamilyId: string;
  productTypeId: string;
  isActive: boolean;
  referenceCode: string;
  // nav props
  group?: ProductGroupModel;
  productFamily?: ProductFamilyModel;
  imageUrl: string;

  suggestUnitPrice: number;
  unitPriceInTable: number;
  quantity: number;
};
