export type PaymentConditionModel = {
  id: number;
  name: string;
  isActive: boolean;
  additionalDiscountPercent: number;
  minOrderValue: number;
};
