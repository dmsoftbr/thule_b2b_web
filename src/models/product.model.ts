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
  itemTypeId: string;
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
  // Tabela de exceção (resolução feita no backend):
  isBlockedByException?: boolean;
  exceptionMarginPercent?: number | null;
  // Estabelecimentos pelos quais o produto bloqueado PODE ser vendido (1o = sugestão).
  allowedExceptionBranches?: string[];
  // Grupo de desconto (tabela de exceção) que cobre o produto. Usado para impedir
  // misturar produtos de grupos diferentes no mesmo pedido.
  exceptionTableId?: string | null;
};
