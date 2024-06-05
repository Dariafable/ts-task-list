import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import TaskList from "../TaskList";

jest.mock("../../../firebase", () => ({
  initializeApp: jest.fn(() => ({})),
  getFirestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    })),
  })),
  getStorage: jest.fn(() => ({
    ref: jest.fn(() => ({
      put: jest.fn(),
      getDownloadURL: jest.fn(),
    })),
  })),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

const mockTasks = [
  { id: "1", title: "Test Task 1", completed: false, date: "01 Jan 2024" },
  { id: "2", title: "Test Task 2", completed: true, date: "01 Jan 2024" },
];

beforeEach(() => {
  jest.clearAllMocks();
  onSnapshot.mockImplementation((q, callback) => {
    callback({
      forEach: (fn) => mockTasks.forEach((task) => fn({ id: task.id, data: () => task })),
    });
    return jest.fn();
  });
});

test("render TaskList component and displays tasks", async () => {
  render(<TaskList />);

  expect(screen.getByText(/task list/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Test Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task 2/i)).toBeInTheDocument();
  });
});

test("add a new task", async () => {
  addDoc.mockResolvedValueOnce({ id: "3" });

  const { container } = render(<TaskList />);

  fireEvent.change(container.querySelector(".input-inner"), {
    target: { value: "New Task" },
  });
  fireEvent.change(container.querySelector(".input-date"), {
    target: { value: "2024-01-01" },
  });
  fireEvent.submit(container.querySelector("#add-task-form"));

  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledWith(undefined, {
      title: "New Task",
      completed: false,
      description: "",
      file: "",
      date: "2024-01-01",
      timestamp: undefined,
    });
  });
});

test("filter tasks by active and completed", async () => {
  const { container } = render(<TaskList />);

  fireEvent.click(container.querySelector("#active-filter-button"));

  await waitFor(() => {
    expect(screen.getByText(/Test Task 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Test Task 2/i)).not.toBeInTheDocument();
  });

  fireEvent.click(container.querySelector("#completed-filter-button"));

  await waitFor(() => {
    expect(screen.queryByText(/Test Task 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Test Task 2/i)).toBeInTheDocument();
  });
});

test("delete task", async () => {
  const { container } = render(<TaskList />);

  fireEvent.click(container.querySelector("#delete-task"));

  await waitFor(() => {
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });
});
