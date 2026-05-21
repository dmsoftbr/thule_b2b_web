import type { CustomerModel } from "./registrations/customer.model";
import type { UserGroupModel } from "./user-group.model";

export type UserRelatedRef = {
  id: number;
  name: string;
  abbreviation: string;
};

export type UserModel = {
  id: string;
  name: string;
  email: string;
  role: string;
  networkDomain: string;
  groupId: string;
  representativeId: number;
  isActive: boolean;
  group?: UserGroupModel;
  customers: CustomerModel[];
  representative?: UserRelatedRef;
};
