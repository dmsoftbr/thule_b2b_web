export type ProductPriceEstimatedDateModel = {
  product: {
    productGroup: {
      id: number;
      name: string;
    };
    productFamily: {
      id: string;
      name: string;
    };
    productCommercialFamily: {
      id: string;
      name: string;
    };
    productType: {
      id: string;
      name: string;
    };
    suggestUnitPrice: number;
    unitPriceInTable: number;
    id: string;
    description: string;
    measureUnity: string;
    groupId: number;
    familyId: string;
    commercialFamilyId: string;
    productTypeId: string;
    isActive: number;
    referenceCode: string;
  };
  productId: string;
  stockAvailable: number;
  suggestUnitPrice: number;
  estimatedDate: string;
};
