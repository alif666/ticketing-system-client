import { Construction } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export function PlaceholderPage({ title, description }: { title: string; description: string }) { return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10"><div className="mb-8"><p className="text-sm text-muted-foreground">Support tracker</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1></div><Card className="max-w-2xl"><CardContent className="flex items-start gap-4 py-8"><div className="rounded-xl bg-accent p-3 text-primary"><Construction className="h-5 w-5" /></div><div><p className="font-semibold">This workspace is coming next</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div></CardContent></Card></main>; }
