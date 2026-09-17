import type { PageResponse } from "../projects/types";

export type ManagedUser = {
  id: number;
  email: string;
  role: "APP_ADMIN" | "CLIENT_ADMIN" | "CLIENT_USER";
  name: string;
  mobile: string | null;
  designation: string | null;
  office: string | null;
  active: boolean;
};

export type ManagedUserPage = PageResponse<ManagedUser>;
