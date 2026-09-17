import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Settings, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { navigationItems } from "./navigation";

type SidebarProps = { open: boolean; collapsed: boolean; onClose: () => void; onToggle: () => void };

export function Sidebar({ open, collapsed, onClose, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const items = navigationItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/10 bg-[#123f5c] text-white shadow-2xl transition-[width,transform] duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[78px]" : "lg:w-[280px]"}`}
      >
        <div
          className={`flex h-[88px] items-center ${
            collapsed ? "justify-center px-2" : "justify-between px-6"
          }`}
        >
          <div className={collapsed ? "text-center" : ""}>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">
              {collapsed ? "P" : "Pridesys"}
            </p>
            {!collapsed && <p className="mt-1 text-lg font-semibold">Support tracker</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-7 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50 lg:flex"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`mx-3 mb-5 flex rounded-xl border border-white/10 bg-white/10 p-2.5 text-left hover:bg-white/15 ${
                collapsed ? "justify-center" : "items-center gap-3"
              }`}
              aria-label="Open account menu"
            >
              <Avatar className="h-9 w-9 border-white/20">
                <AvatarFallback>{roleInitials(user?.role)}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{user?.name}</span>
                    <span className="mt-1 block truncate text-xs text-sky-100/70">
                      {user?.role.replace("_", " ")}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-sky-100/70" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuLabel>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="mt-1 font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" onClick={onClose}>
                <Settings className="mr-2 h-4 w-4" />
                Profile settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={logout}
              className="text-red-700 focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl py-3 text-sm font-medium transition ${
                    collapsed ? "justify-center px-0" : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-white text-[#123f5c] shadow-lg"
                      : "text-sky-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {!item.implemented && (
                      <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-sky-100/60">
                        Soon
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className={`border-t border-white/10 p-4 ${collapsed ? "text-center" : ""}`}>
          <p className="text-xs text-sky-100/50">
            {collapsed ? "•" : "Internal support operations"}
          </p>
        </div>
      </aside>
    </>
  );
}

function roleInitials(role?: string) {
  return role === "APP_ADMIN" ? "AA" : role === "CLIENT_ADMIN" ? "CA" : "CU";
}
