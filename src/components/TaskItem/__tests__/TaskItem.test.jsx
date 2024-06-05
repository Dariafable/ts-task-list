import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { updateDoc } from "firebase/firestore";
import TaskItem from "../TaskItem";

jest.mock("firebase/firestore", () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(() => ({})),
  getFirestore: jest.fn(),
}));

const mockTask = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  date: "01 Jan 2024",
  completed: false,
};

describe("TaskItem Component", () => {
  test("renders task item with correct title and description", () => {
    render(<TaskItem task={mockTask} toggleCompleted={() => {}} />);

    const taskTitle = screen.getByText(/Test Task/i);

    expect(taskTitle).toBeInTheDocument();
  });

  test("toggles task completion when checkbox is clicked", () => {
    const toggleCompleted = jest.fn();
    const { container } = render(<TaskItem task={mockTask} toggleCompleted={toggleCompleted} />);
    const checkbox = container.querySelector("[name='isCompleted']");
    fireEvent.click(checkbox);
    expect(toggleCompleted).toHaveBeenCalledWith(mockTask);
  });

  test("uploads file when file input is changed", async () => {
    const { container } = render(<TaskItem task={mockTask} uploadFile={() => {}} />);
    const fileInput = container.querySelector("input[name='file']");
    fireEvent.change(fileInput, { target: { files: [{ name: "testFile.txt" }] } });
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  test("deletes file when file remover is clicked", async () => {
    const taskWithFile = { ...mockTask, file: "testFile.txt" };
    const { container } = render(<TaskItem task={taskWithFile} deleteFile={() => {}} />);
    const fileRemover = container.querySelector("#file-remover");

    await act(async () => {
      fireEvent.click(fileRemover);
    });

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { file: "" });
  });

  test("opens modal when edit icon is clicked", async () => {
    const { container } = render(<TaskItem task={mockTask} />);
    const editIcon = container.querySelector("#edit-task");
    fireEvent.click(editIcon);
    const modalTitles = await screen.findAllByText(/task/i);
    const isModalTitlePresent = modalTitles.some((title) => title.textContent === "task");
    expect(isModalTitlePresent).toBeTruthy();
  });

  test("deletes task when delete icon is clicked", async () => {
    const deleteTask = jest.fn();
    const { container } = render(<TaskItem task={mockTask} deleteTask={deleteTask} />);
    const deleteIcon = container.querySelector("#delete-task");
    fireEvent.click(deleteIcon);
    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(mockTask.id);
    });
  });
});
