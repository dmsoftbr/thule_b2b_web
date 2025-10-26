import type { UserGroupModel } from "./user-group.model";

export type UserModel = {
  id: string;
  name: string;
  email: string;
  role: string;
  networkDomain: string;
  groupId: string;
  representativeId: number;
  customerId: number;
  isActive: boolean;
  group?: UserGroupModel;
};
