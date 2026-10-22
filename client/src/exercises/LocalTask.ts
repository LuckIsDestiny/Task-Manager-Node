export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export const FILTERS = ["all", "active", "done"] as const;
export type Filter = (typeof FILTERS)[number];
