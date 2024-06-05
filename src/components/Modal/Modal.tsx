import { RiCloseLine } from "react-icons/ri";

import { ModalProps } from "../../types";

import "./ModalStyles.scss";

const Modal: React.FC<ModalProps> = ({
  open,
  setOpen,
  newValueTask,
  handleChangeTask,
  handleEditTask,
}) => {
  const clickSave = () => {
    handleEditTask();
    setOpen(false);
  };

  return (
    <div className={`overlay animated ${open ? "show" : ""}`}>
      <div className="modal">
        <RiCloseLine id="#close-button" className="icon-modal" onClick={() => setOpen(false)} />

        <div className="task-wrapper">
          <p className="modal-title">task</p>
          <input
            className="modal-input"
            name="title"
            type="text"
            value={newValueTask.title}
            onChange={handleChangeTask}
          />
        </div>

        <div className="desc-wrapper">
          <p className="modal-title">description</p>
          <textarea
            className="desc-textarea"
            name="description"
            value={newValueTask.description}
            onChange={handleChangeTask}
            data-testid="task-description"
          />
        </div>

        <div className="modal-title">final date</div>
        <input
          type="date"
          name="date"
          className="modal-date"
          value={newValueTask.date}
          onChange={handleChangeTask}
        />

        <button className="save-change" onClick={clickSave}>
          save
        </button>
      </div>
    </div>
  );
};

export default Modal;
