import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { UserProfile } from "../../features/auth/types";

export type NavigationItem = {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  implemented: boolean;
  roles: UserProfile["role"][];
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    implemented: true,
    roles: ["APP_ADMIN", "CLIENT_ADMIN", "CLIENT_USER"],
  },
  {
    label: "Issues",
    path: "/issues",
    icon: ClipboardList,
    implemented: true,
    roles: ["APP_ADMIN", "CLIENT_ADMIN", "CLIENT_USER"],
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
    implemented: true,
    roles: ["APP_ADMIN", "CLIENT_ADMIN", "CLIENT_USER"],
  },
  {
    label: "User management",
    path: "/users",
    icon: UsersRound,
    implemented: false,
    roles: ["APP_ADMIN", "CLIENT_ADMIN"],
  },
  {
    label: "Verification queue",
    path: "/verification",
    icon: ShieldCheck,
    implemented: false,
    roles: ["APP_ADMIN", "CLIENT_ADMIN"],
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
    implemented: true,
    roles: ["APP_ADMIN", "CLIENT_ADMIN", "CLIENT_USER"],
  },
];
