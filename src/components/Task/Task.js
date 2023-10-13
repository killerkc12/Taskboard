/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./Task.css";
import { BsCircle } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Popup from "reactjs-popup";
import { MdDelete } from "react-icons/md";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const DeleteTask = async (id) => {
  await deleteDoc(doc(db, "Task", id));
};

const Task = (props) => {
  const [isHover, setHover] = useState(false);
  const [isHoverCompleted, setHoverCompleted] = useState(false);

  const UpdateTaskStatus = async () => {
    const docRef = doc(db, "Task", props.task.id);
    await updateDoc(docRef, {
      isCompleted: props.isCompleted ? false : true,
    });
  };

  return (
    <div
      className="task__container"
      onMouseMove={() => setHoverCompleted(true)}
      onMouseOut={() => setHoverCompleted(false)}
    >
      <div className="task__start">
        {props.task.isCompleted ? (
          <div className="task__start">
            <div className="task__icon" onClick={UpdateTaskStatus}>
              <MdDone className="task__icon__done" />
            </div>
            <div className="task__name__completed">{props.task.task_name}</div>
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
            <div className="task__name">{props.task.task_name}</div>
          </div>
        )}
      </div>
      {props.task.isCompleted ? (
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
          <MenuOptions id={props.task.id} />
        </Popup>
      )}
    </div>
  );
};

const MenuOptions = ({ id }) => {
  return (
    <div className="menu">
      <div className="menu-item" onClick={() => DeleteTask(id)}>
        <MdDelete className="menu-icon" />
        Delete
      </div>
    </div>
  );
};

export default Task;
