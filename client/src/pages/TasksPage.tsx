import { useCallback, useEffect, useState } from "react";
import type { TaskStatus, PaginatedTasks, Priority, Task } from "../types/task";
import * as taskService from "../services/task.service";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

// Components
import { TaskItem } from "../components/TaskItem";
import { TaskForm } from "../components/TaskForm";
import { TaskFilters } from "../components/TaskFilters";
import { Pagination } from "../components/Pagination";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const TasksPage = () => {
  const [paginatedTasks, setPaginatedTasks] = useState<PaginatedTasks | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSuccess = async (savedTask: Task) => {
    if (editingTask) {
      setPaginatedTasks((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === savedTask.id ? savedTask : t)),
        };
      });
    } else {
      await loadTasks();
    }
    setIsCreating(false);
    setEditingTask(null);
  };

  const handleFilterChange = (
    filterName: "status" | "priority",
    value: string,
  ) => {
    setPage(1);
    if (filterName === "status") {
      setStatusFilter((value as TaskStatus) || "");
    } else {
      setPriorityFilter((value as Priority) || "");
    }
  };

  const handlePageChange = async (change: "next" | "previous") => {
    if (change === "next") {
      setPage((page) => page + 1);
    } else {
      setPage((page) => page - 1);
    }
  };

  const handleLimitChange = async (limitChange: number) => {
    setLimit(limitChange);
    setPage(1);
  };

  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const paginatedTasks = await taskService.getTasks({
        status: statusFilter === "" ? undefined : statusFilter,
        priority: priorityFilter === "" ? undefined : priorityFilter,
        page,
        limit,
      });
      setPaginatedTasks(paginatedTasks);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setPaginatedTasks(null);
      setError(err.message || "Sorry, something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, page, limit]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      await loadTasks();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to delete task", err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTask(null);
  };

  // Determine if the form modal should be open
  const isFormOpen = isCreating || editingTask !== null;

  let content;
  if (isLoading) {
    content = (
      <div className="text-center py-10 text-muted-foreground">
        Loading Tasks...
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-10 text-destructive font-medium">
        Error: {error}
      </div>
    );
  } else if (paginatedTasks?.tasks.length === 0) {
    content = (
      <div className="text-center py-20 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">
          No tasks found. Get started by creating one!
        </p>
        <Button onClick={() => setIsCreating(true)}>Create Task</Button>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedTasks?.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">Manage and track your tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button onClick={() => setIsCreating(true)}>+ Create Task</Button>
        </div>
      </header>

      {/* Filters Area */}
      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Main Grid Content */}
      <main className="grow">{content}</main>

      {/* Pagination Area */}
      <div className="mt-auto pt-6">
        <Pagination
          page={page}
          limit={limit}
          total={paginatedTasks?.total || 1}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* 
        The Dialog component wraps your form. 
        It stays hidden until isFormOpen becomes true.
      */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel(); // Automatically clears state if user clicks the blurred backdrop
        }}
      >
        {/* We strip out the default Dialog background/padding so your Card looks perfect floating in the center */}
        <DialogContent className="sm:max-w-150 p-0 border-none bg-transparent shadow-none">
          {/* A hidden title is strictly required by Radix UI for accessibility screen readers */}
          <DialogHeader className="sr-only">
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>

          <TaskForm
            key={editingTask ? editingTask.id : "create-form"}
            initialData={editingTask}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
