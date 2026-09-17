import type { IssueStage } from "../types";

export const boardStages: IssueStage[] = [
  "SUBMITTED",
  "RECEIVED",
  "UNDER_DEVELOPMENT",
  "TESTING",
  "DEPLOYED",
  "RESOLVED",
];

export const administrativeTransitions: Partial<
  Record<IssueStage, IssueStage[]>
> = {
  SUBMITTED: ["RECEIVED", "DECLINED"],
  RECEIVED: ["UNDER_DEVELOPMENT"],
  UNDER_DEVELOPMENT: ["TESTING", "RESOLVED"],
  TESTING: ["DEPLOYED", "RESOLVED"],
  DEPLOYED: ["RESOLVED"],
};

const stageLabels: Record<IssueStage, string> = {
  SUBMITTED: "Submitted",
  RECEIVED: "Received",
  UNDER_DEVELOPMENT: "In development",
  TESTING: "Testing",
  DEPLOYED: "Deployed",
  DECLINED: "Declined",
  RESOLVED: "Resolved",
};

export function formatStage(stage: IssueStage) {
  return stageLabels[stage];
}
