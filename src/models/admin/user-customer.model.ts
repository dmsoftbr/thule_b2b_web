import type { CustomerModel } from "@/models/registrations/customer.model";

export type UserCustomerModel = {
  userId: string;
  customerId: number;
  customer?: CustomerModel;
};
