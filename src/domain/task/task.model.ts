export interface Task {
  name: string;
  description: string;
  id?: number;
}

export const TaskLists: Task[] = [
  {
    name: "write code",
    description: "code review",
    id: 1,
  },
  {
    name: "write code 1",
    description: "code review",
    id: 2,
  },
  {
    name: "write code 2",
    description: "code review",
    id: 3,
  },
  {
    name: "write code 3",
    description: "code review",
    id: 4,
  },
];
