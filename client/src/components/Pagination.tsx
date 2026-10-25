import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (change: "next" | "previous") => void;
  onLimitChange: (limitChange: number) => void;
};

export const Pagination = ({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      {/* Grouped Next/Prev buttons and Page text together */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange("previous")}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Page {page} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange("next")}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Rows per page:
        </span>
        <Select
          value={limit.toString()}
          onValueChange={(val) => onLimitChange(Number(val))}
        >
          <SelectTrigger className="w-17.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
