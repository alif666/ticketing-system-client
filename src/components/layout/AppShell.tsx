import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background lg:pl-[280px]"><Sidebar open={open} onClose={() => setOpen(false)} /><header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card/95 px-4 backdrop-blur lg:hidden"><button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><p className="ml-3 text-sm font-semibold">Support tracker</p></header>{children}</div>;
}
