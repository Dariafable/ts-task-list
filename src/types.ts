export interface Task {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  file: string;
  date: string;
  timestamp: string;
}

export enum TaskFilter {
  ALL = "all",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export interface TaskItemProps {
  task: Task;
  toggleCompleted: (task: Task) => void;
  deleteTask: (id: string) => void;
}

export type TimeDurationProps = {
  date: string;
};

export interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newValueTask: {
    title: string;
    description: string;
    date: string;
  };
  handleChangeTask: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEditTask: () => void;
}

export interface AddTaskProps {
  input: string;
  date: string;
  addTask: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement>) => void;
  changeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDate: (date: string) => void;
}
