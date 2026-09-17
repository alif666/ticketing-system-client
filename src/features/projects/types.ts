export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type Project = {
  id: number;
  name: string;
  shortCode: string;
  description: string;
  active: boolean;
};

export type Module = {
  id: number;
  projectId: number;
  name: string;
  description: string;
  active: boolean;
};
