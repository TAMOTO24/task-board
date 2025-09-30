type Status = "done" | "undone";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: Status;
  priority: number;
}

export { Task, Status };