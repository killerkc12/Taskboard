/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./Task.css";
import { BsCircle } from "react-icons/bs";
import { MdDone, MdDelete, MdEvent, MdEventBusy, MdDragIndicator } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Popup from "reactjs-popup";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { useDraggable } from "@dnd-kit/core";
import { db } from "../../firebase/firebase";
import { describeDue } from "../../utils/dueDate";

const DeleteTask = async (id) => {
  await deleteDoc(doc(db, "Task", id));
};

const SetDueDate = async (id, value) => {
  await updateDoc(doc(db, "Task", id), { due_date: value ? value : deleteField() });
};

const DueChip = ({ due, done }) => {
  const info = describeDue(due);
  if (!info) return null;
  return <span className={`task__due task__due--${done ? "done" : info.tone}`}><MdEvent />{info.label}</span>;
};

const Task = (props) => {
  const [isHover, setHover] = useState(false);
  const [isHoverCompleted, setHoverCompleted] = useState(false);
  const done = !!props.task.isCompleted;

  // Open tasks can be dragged onto another list.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.task.id,
    data: { task: props.task },
    disabled: done,
  });

  const UpdateTaskStatus = async () => {
    const docRef = doc(db, "Task", props.task.id);
    await updateDoc(docRef, {
      isCompleted: props.isCompleted ? false : true,
    });
  };

  return (
    <div
      ref={setNodeRef}
      className={`task__container${isDragging ? " is-dragging" : ""}`}
      onMouseMove={() => setHoverCompleted(true)}
      onMouseOut={() => setHoverCompleted(false)}
    >
      {!done && (
        <span className="task__handle" {...listeners} {...attributes} aria-label={`Drag "${props.task.task_name}" to another list`}>
          <MdDragIndicator />
        </span>
      )}
      <div className="task__start">
        {done ? (
          <div className="task__start">
            <div className="task__icon" onClick={UpdateTaskStatus}>
              <MdDone className="task__icon__done" />
            </div>
            <div className="task__text">
              <div className="task__name__completed">{props.task.task_name}</div>
              <DueChip due={props.task.due_date} done />
            </div>
          </div>
        ) : (
          <div className="task__start">
            <div className="task__icon" onClick={UpdateTaskStatus}>
              {!isHover && (
                <BsCircle
                  onMouseMove={() => setHover(true)}
                  className="task__icon__circle"
                />
              )}
              {isHover && (
                <MdDone
                  onMouseOut={() => setHover(false)}
                  className="task__icon__done"
                />
              )}
            </div>
            <div className="task__text">
              <div className="task__name">{props.task.task_name}</div>
              <DueChip due={props.task.due_date} />
            </div>
          </div>
        )}
      </div>
      {done ? (
        isHoverCompleted && (
          <MdDelete
            className="menu-icon"
            onClick={() => DeleteTask(props.task.id)}
          />
        )
      ) : (
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
          <MenuOptions task={props.task} />
        </Popup>
      )}
    </div>
  );
};

const MenuOptions = ({ task }) => {
  return (
    <div className="menu">
      <label className="menu-item menu-item--date">
        <MdEvent className="menu-icon" />
        Due date
        <input
          type="date"
          value={task.due_date || ""}
          onChange={(e) => SetDueDate(task.id, e.target.value)}
        />
      </label>
      {task.due_date && (
        <div className="menu-item" onClick={() => SetDueDate(task.id, "")}>
          <MdEventBusy className="menu-icon" />
          Clear due date
        </div>
      )}
      <div className="menu-item" onClick={() => DeleteTask(task.id)}>
        <MdDelete className="menu-icon" />
        Delete
      </div>
    </div>
  );
};

export default Task;
