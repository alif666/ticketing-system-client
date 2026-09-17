import { Button } from "../../../components/ui/button";

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground"><span>Page {page + 1} of {totalPages}</span><div className="flex gap-2"><Button type="button" disabled={page === 0} onClick={() => onChange(page - 1)} className="h-8 bg-secondary px-3 text-secondary-foreground">Previous</Button><Button type="button" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)} className="h-8 bg-secondary px-3 text-secondary-foreground">Next</Button></div></div>;
}
