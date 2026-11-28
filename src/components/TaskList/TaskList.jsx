/* eslint-disable react/prop-types */
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useDroppable } from "@dnd-kit/core";
import { sortOpenTasks } from "../../utils/dueDate";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import Loader from "../Loader/Loader";
import Task from "../Task/Task";
import TaskInput from "../TaskInput/TaskInput";
import "./TaskList.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Popup from "reactjs-popup";
import { MdDelete } from "react-icons/md";
import { doc } from "firebase/firestore";
import { MdBrush } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const TaskList = (props) => {
  const [task, setTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [isTaskLoading, setTaskLoading] = useState(true);
  const [isCompletedTaskCollapsed, setCompletedTaskCollapsed] = useState(false);
  // The whole list is a drop target for tasks dragged from other lists.
  const { setNodeRef, isOver } = useDroppable({ id: props.taskList.id });

  // Live tasks for this list; the listener is removed when the list goes away.
  useEffect(() => {
    const q = query(
      collection(db, "Task"),
      where("uid", "==", auth.currentUser.uid),
      where("tasklist_id", "==", props.taskList.id)
    );
    return onSnapshot(q, (querySnapshot) => {
      const list = [];
      const completedList = [];
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().isCompleted === true)
          completedList.push({ id: doc.id, ...doc.data() });
        else list.push({ id: doc.id, ...doc.data() });
      });
      list.sort(sortOpenTasks);
      setTask(list);
      setCompletedTask(completedList);
      setTaskLoading(false);
    });
  }, [props.taskList.id]);

  return (
    <div
      ref={setNodeRef}
      className={`tasklist__container${isOver ? " is-drop-target" : ""}`}
      style={{ backgroundColor: props.taskList.color }}
    >
      {/* TODO: tasklist header */}
      <div className="tasklist__header">
        <div className="tasklist__header__name">
          <span>{props.taskList.tasklist_name}</span>
          <Popup
            trigger={
              <div className="task__options">
                <BsThreeDotsVertical />
              </div>
            }
            position="right top"
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{ padding: 0, border: "none" }}
            arrowStyle={{ color: "#3A3C45" }}
            arrow={true}
          >
            <MenuOptions taskList={props.taskList} />
          </Popup>
        </div>
      </div>

      <div className="tasklist__tasks">
        {isTaskLoading ? (
          <Loader />
        ) : (
          <>
            <TaskInput tasklist_id={props.taskList.id} />
            {task?.map((item) => (
              <div key={item.id}>
                <Task task={item} />
              </div>
            ))}
            <div
              className="tasklist_completed_container"
              onClick={() =>
                setCompletedTaskCollapsed(!isCompletedTaskCollapsed)
              }
            >
              <p className="tasklist_completed">
                Completed ({completedTask.length})
              </p>
              {isCompletedTaskCollapsed ? (
                <IoIosArrowUp className="up_arrow" />
              ) : (
                <IoIosArrowDown className="down_arrow" />
              )}
            </div>
            {isCompletedTaskCollapsed &&
              completedTask?.map((item) => (
                <div key={item.id}>
                  <Task task={item} isCompleted={true} />
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

const MenuOptions = (props) => {
  // Deleting a list also deletes its tasks, so none are left behind.
  const DeleteTask = async (id) => {
    if (!window.confirm(`Delete "${props.taskList.tasklist_name}" and its tasks?`)) return;
    const tasks = await getDocs(query(collection(db, "Task"), where("uid", "==", auth.currentUser.uid), where("tasklist_id", "==", id)));
    const batch = writeBatch(db);
    tasks.docs.forEach((t) => batch.delete(t.ref));
    batch.delete(doc(db, "TaskList", id));
    await batch.commit();
  };

  const SetListColor = async (color) => {
    const docRef = doc(db, "TaskList", props.taskList.id);
    await updateDoc(docRef, {
      color: color,
    });
  };

  return (
    <div className="menu">
      <div className="menu-item" onClick={() => DeleteTask(props.taskList.id)}>
        <MdDelete className="menu-icon" />
        Delete list
      </div>
      <div
        className="menu-item"
        // onClick={() => DeleteTask(id)}
      >
        <MdBrush className="menu-icon" />
        Set Color - &nbsp;
        <input
          type="color"
          value={props.taskList.color}
          onChange={(e) => SetListColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TaskList;
