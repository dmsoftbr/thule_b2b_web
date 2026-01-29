import type { ProductFamilyModel } from "./product-family.model";
import type { ProductCommercialFamilyModel } from "./registrations/product-commercial-family.model";
import type { ProductGroupModel } from "./registrations/product-group.model";

export type ProductModel = {
  id: string;
  description: string;
  measureUnity: string;
  groupId: number;
  familyId: string;
  commercialFamilyId: string;
  productTypeId: string;
  isActive: number;
  referenceCode: string;
  orderMessage: string;
  // nav props
  productGroup?: ProductGroupModel;
  productFamily?: ProductFamilyModel;
  productCommercialFamily?: ProductCommercialFamilyModel;
  imageUrl?: string;
  suggestUnitPrice: number;
  unitPriceInTable: number;
  quantity: number;
};
