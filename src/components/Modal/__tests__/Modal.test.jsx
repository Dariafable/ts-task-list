import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Modal from "../Modal";

const mockSetOpen = jest.fn();
const mockHandleEditTask = jest.fn();
const mockHandleChangeTask = jest.fn();

const defaultProps = {
  open: true,
  setOpen: mockSetOpen,
  newValueTask: {
    title: "Test Task",
    description: "Test Description",
    date: "2024-01-01",
  },
  handleChangeTask: mockHandleChangeTask,
  handleEditTask: mockHandleEditTask,
};

describe("Modal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the modal with task details", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText(/task/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Test Task/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Test Description/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
  });

  test("closes the modal when the close icon is clicked", () => {
    const { container } = render(<Modal {...defaultProps} />);

    const closeButton = container.querySelector("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test("calls handleEditTask and closes the modal when the save button is clicked", () => {
    render(<Modal {...defaultProps} />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    expect(mockHandleEditTask).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
