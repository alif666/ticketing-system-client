import { Button } from "../ui/button";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function PaginationControls({ page, totalPages, pageSize, pageSizeOptions = [8, 16, 32], onPageChange, onPageSizeChange }: PaginationControlsProps) {
  return <div className="mt-4 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><label className="flex items-center gap-2">Records per page<select aria-label="Records per page" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"><option value={pageSize}>{pageSize}</option>{pageSizeOptions.filter((size) => size !== pageSize).map((size) => <option key={size} value={size}>{size}</option>)}</select></label><div className="flex items-center justify-between gap-3 sm:justify-end"><span>Page {Math.min(page + 1, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}</span><div className="flex gap-2"><Button type="button" disabled={page === 0} onClick={() => onPageChange(page - 1)} className="h-8 bg-secondary px-3 text-secondary-foreground">Previous</Button><Button type="button" disabled={totalPages === 0 || page + 1 >= totalPages} onClick={() => onPageChange(page + 1)} className="h-8 bg-secondary px-3 text-secondary-foreground">Next</Button></div></div></div>;
}
