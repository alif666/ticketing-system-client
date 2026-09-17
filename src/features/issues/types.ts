import type { PageResponse } from "../projects/types";

export type IssueStage =
  | "SUBMITTED"
  | "RECEIVED"
  | "UNDER_DEVELOPMENT"
  | "TESTING"
  | "DEPLOYED"
  | "DECLINED"
  | "RESOLVED";
export type IssueType = "BUG" | "ENHANCEMENT" | "NEW_FEATURE";
export type IssuePriority =
  "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" | "URGENT";
export type VerificationStatus =
  "NOT_REQUIRED" | "PENDING_VERIFICATION" | "ACCEPTED" | "REJECTED";

export type Issue = {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  stage: IssueStage;
  verificationStatus: VerificationStatus;
  projectId: number;
  moduleId: number | null;
  reporterId: number;
  createdAt: string;
  updatedAt: string;
};

export type IssueAudit = {
  id: number;
  issueId: number;
  actorId: number;
  action: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
};

export type IssuePage = PageResponse<Issue>;
