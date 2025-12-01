export type CalcOrderFreightsRequestDto = {
  orderId: string;
  customerAbbreviation: string;
  deliveryLocationId: string;
  totalOrder: number;
};

export type CalcOrderFreightsItem = {
  productId: string;
  quantity: number;
  sequence: number;
};
