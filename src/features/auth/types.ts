export type UserProfile = { id: number; email: string; role: "APP_ADMIN" | "CLIENT_ADMIN" | "CLIENT_USER"; name: string; mobile?: string; designation?: string; office?: string; clientId?: number };
export type LoginResponse = { token: string; user: UserProfile };
