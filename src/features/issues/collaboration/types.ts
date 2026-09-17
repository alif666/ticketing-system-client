import type { PageResponse } from "../../projects/types";

export type Comment = {
  id: number;
  issueId: number;
  authorId: number;
  body: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Attachment = {
  id: number;
  issueId: number;
  uploaderId: number;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export type CollaborationPages = {
  comments: PageResponse<Comment> | null;
  attachments: PageResponse<Attachment> | null;
};
