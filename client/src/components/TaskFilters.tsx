import type { Priority, TaskStatus } from "../types/task";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskFiltersProps = {
  statusFilter: TaskStatus | "";
  priorityFilter: Priority | "";
  onFilterChange: (filterName: "status" | "priority", value: string) => void;
};

export const TaskFilters = ({
  statusFilter,
  priorityFilter,
  onFilterChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
      <div className="grid gap-2 w-full sm:w-45">
        <Label htmlFor="status">Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 w-full sm:w-45">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priorityFilter}
          onValueChange={(value) => onFilterChange("priority", value)}
        >
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
