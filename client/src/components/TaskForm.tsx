import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  CreateTaskInput,
  Priority,
  Task,
  TaskStatus,
} from "../types/task";
import { createTask, updateTask } from "../services/task.service";

type TaskFormProps = {
  initialData?: Task | null;
  onSuccess: (task: Task) => void;
  onCancel: () => void;
};

export const TaskForm = ({
  initialData,
  onSuccess,
  onCancel,
}: TaskFormProps) => {
  const [task, setTask] = useState<CreateTaskInput>({
    title: initialData?.title || "",
    description: initialData?.description || undefined,
    status: initialData?.status || "TODO",
    priority: initialData?.priority || "MEDIUM",
    dueDate: initialData?.dueDate
      ? initialData.dueDate.slice(0, 10)
      : undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const minDate = initialData?.dueDate
    ? initialData.dueDate.slice(0, 10)
    : today;

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      let savedTask: Task;
      if (initialData) {
        savedTask = await updateTask(initialData.id, task);
      } else {
        savedTask = await createTask(task);
      }
      onSuccess(savedTask);
      setTask({ title: "" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Task" : "Create New Task"}</CardTitle>
        <CardDescription>
          Fill out the details below to add a new task to your board.
        </CardDescription>
      </CardHeader>

      {/* Wrapped the content and footer inside the form so the submit button works natively */}
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="E.g., Update database schema"
              value={task.title}
              onChange={handleChangeInput}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide more details about this task..."
              value={task.description || ""}
              onChange={handleChangeInput}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={task.status || "TODO"}
                onValueChange={(value) =>
                  setTask({ ...task, status: value as TaskStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority || "MEDIUM"}
                onValueChange={(value) =>
                  setTask({ ...task, priority: value as Priority })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              name="dueDate"
              id="dueDate"
              min={minDate}
              value={task.dueDate || ""}
              onChange={handleChangeInput}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
