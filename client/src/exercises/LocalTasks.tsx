import { useState, type SubmitEvent } from "react";
import { FILTERS, type Filter, type Task } from "./LocalTask";

export type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <li>
      <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
        {task.title}
      </span>
      <button type="button" onClick={onToggle}>
        {task.done ? "Undo" : "Done"}
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
};

export const LocalTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTasks = tasks.filter(
    (task) =>
      filter === "all" ||
      (filter === "active" && !task.done) ||
      (filter === "done" && task.done),
  );
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const emptyState =
    tasks.length === 0 ? <p>No tasks yet</p> : <p>No matching tasks</p>;

  return (
    <>
      <div>
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={newTaskTitle}
            type="text"
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <h2>Task List</h2>
        <label htmlFor="filter">Show</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        {visibleTasks.length === 0 ? (
          emptyState
        ) : (
          <ul>
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
