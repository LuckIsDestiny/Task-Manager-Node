import type { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export type TaskItemProps = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export const TaskItem = ({ task, onDelete, onEdit }: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <CardTitle className="text-lg font-bold leading-tight break-all">
            {task.title}
          </CardTitle>
          <div className="flex gap-2 shrink-0 text-xs font-semibold">
            <span className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full capitalize">
              Status: {task.status}
            </span>
            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full capitalize">
              Priority: {task.priority}
            </span>
          </div>
        </div>
        {task.description && (
          <div className="mt-1">
            <CardDescription className={isExpanded ? "" : "line-clamp-2"}>
              Description: {task.description}
            </CardDescription>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary font-medium mt-1 hover:underline cursor-pointer"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent className="grow text-sm text-muted-foreground">
        {task.dueDate && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="font-medium">Due:</span>
            {task.dueDate.slice(0, 10)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t pt-4 mt-auto">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
