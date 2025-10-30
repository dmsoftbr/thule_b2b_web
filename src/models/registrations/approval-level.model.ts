import type { ApprovalLevelLimitModel } from "./approval-level-limit.model";

export type ApprovalLevelModel = {
  id: string;
  description: string;
  type: string;
  limits?: ApprovalLevelLimitModel[];
};
