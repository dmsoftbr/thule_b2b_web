export type CalcOrderFreightsRequestDto = {
  orderId: string;
  customerAbbreviation: string;
  deliveryLocationId: string;
  totalOrder: number;
  items: CalcOrderFreightsItem[];
};

export type CalcOrderFreightsItem = {
  productId: string;
  quantity: number;
  sequence: number;
};
