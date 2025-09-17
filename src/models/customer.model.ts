import type { CarrierModel } from "./carrier.model";
import type { DeliveryLocationModel } from "./delivery-location.model";
import type { PaymentConditionModel } from "./payment-condition.model";
import type { PriceTableModel } from "./price-table.model";
import type { RepresentativeModel } from "./representative.model";

export type CustomerModel = {
  id: number;
  name: string;
  abbreviation: string;
  documentNumber: string;
  personType: string;
  representativeId: number;
  creditLimitValue: number;
  creditLimitExpiresAt: Date;
  creditStatus: string;
  isActive: boolean;
  carrierId: number;
  paymentConditionId: number;
  branchId: string;
  discountPercent: number;

  carrier: CarrierModel;
  priceTables: PriceTableModel[];
  representative: RepresentativeModel;
  deliveryLocations: DeliveryLocationModel[];
  paymentConditions: PaymentConditionModel[];
};
