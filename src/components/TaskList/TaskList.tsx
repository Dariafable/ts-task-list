import React from "react";
import dayjs from "dayjs";
import { FcReading } from "react-icons/fc";
import { db } from "../../firebase";
import {
  query,
  collection,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore";

import { TaskItem } from "../TaskItem";
import { AddTask } from "../AddTask";

import { Task, TaskFilter } from "../../types";

import "./TaskListStyles.scss";

const TaskList: React.FC = () => {
  const currentDate = dayjs().format("DD MMM YYYY");

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");
  const [filter, setFilter] = React.useState<TaskFilter>(TaskFilter.ALL);

  React.useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tasksArr: Task[] = [];
      querySnapshot.forEach((doc) => {
        const firestoreData = doc.data() as Task;
        tasksArr.push({ ...firestoreData, id: doc.id });
      });
      setTasks(tasksArr);
    });
    return () => unsubscribe();
  }, []);

  const addTask = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    if (!input || !date) {
      alert("Please enter a valid task");
      return;
    }
    await addDoc(collection(db, "tasks"), {
      title: input,
      completed: false,
      description: "",
      file: "",
      date: date,
      timestamp: serverTimestamp(),
    });
    setInput("");
    setDate("");
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);
  };

  const toggleCompleted = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  const handleFilterChange = (filter: TaskFilter) => {
    setFilter(filter);
  };

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const cleanCompletedTasks = async () => {
    const q = query(collection(db, "tasks"), where("completed", "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  return (
    <div className="task-container">
      <h1 className="task-head">
        <FcReading />
        task list
      </h1>
      <div className="date-box">
        <span className="current-date">{currentDate}</span>
      </div>

      <AddTask
        input={input}
        changeInput={changeInput}
        addTask={addTask}
        date={date}
        setDate={setDate}
      />

      <ul className="all-tasks">
        {tasks
          .filter(
            (task) =>
              filter === "all" ||
              (filter === "active" && !task.completed) ||
              (filter === "completed" && task.completed)
          )
          .map((task) => {
            return (
              <React.Fragment key={task.id}>
                <TaskItem task={task} toggleCompleted={toggleCompleted} deleteTask={deleteTask} />
              </React.Fragment>
            );
          })}
      </ul>

      <div className="task-bottom">
        <p className="task-length">
          {!tasks.length
            ? "you have no tasks"
            : `tasks left: ${tasks.reduce((acc, task) => acc + (task.completed ? 0 : 1), 0)}`}
        </p>

        <div className="task-buttons">
          <button
            id="all-filter-button"
            className={`task-button ${filter === TaskFilter.ALL ? "active" : ""}`}
            onClick={() => handleFilterChange(TaskFilter.ALL)}
          >
            all
          </button>
          <button
            id="active-filter-button"
            className={`task-button ${filter === TaskFilter.ACTIVE ? "active" : ""}`}
            onClick={() => handleFilterChange(TaskFilter.ACTIVE)}
          >
            active
          </button>
          <button
            id="completed-filter-button"
            className={`task-button ${filter === TaskFilter.COMPLETED ? "active" : ""}`}
            onClick={() => handleFilterChange(TaskFilter.COMPLETED)}
          >
            completed
          </button>
        </div>

        <button className="task-button" onClick={cleanCompletedTasks}>
          clean completed
        </button>
      </div>
    </div>
  );
};

export default TaskList;
