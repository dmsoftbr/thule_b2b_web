export type UserPermissionModel = {
  permissionId: string;
  userId: string;
  isPermitted: boolean;
};

export type EffectivePermissionModel = {
  permissionId: string;
  isPermitted: boolean;
  fromGroup: boolean;
};
