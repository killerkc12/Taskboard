import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import "./Home.css";
import TaskList from "../TaskList/TaskList";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { auth, db } from "../../firebase/firebase";
import Navbar from "../Navbar/Navbar";
import TaskListInput from "../TaskListInput/TaskListInput";
import Loader from "../Loader/Loader";
import BoardPicker from "../BoardPicker/BoardPicker";
import Sidebar from "../Sidebar/Sidebar";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const boardId = state?.default_board;
  const [boards, setBoards] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [isTaskListLoading, setTaskListLoading] = useState(true);
  const [dragging, setDragging] = useState(null); // task being dragged, for the overlay
  const [menuOpen, setMenuOpen] = useState(false);

  // All of this user's boards.
  useEffect(() => {
    if (!state?.uid) return undefined;
    const q = query(collection(db, "Board"), where("uid", "==", auth.currentUser.uid));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.createdOn?.seconds ?? 0) - (b.createdOn?.seconds ?? 0));
      setBoards(list);
    });
  }, [state?.uid]);

  // Lists on the current board; re-subscribes when the board changes.
  useEffect(() => {
    if (!boardId) return undefined;
    setTaskListLoading(true);
    const q = query(
      collection(db, "TaskList"),
      where("uid", "==", auth.currentUser.uid),
      where("board_id", "==", boardId)
    );
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1));
      setTaskList(list);
      setTaskListLoading(false);
    });
  }, [boardId]);

  // Remember the chosen board on this device and in the user's profile.
  const switchBoard = async (id) => {
    if (!id || id === boardId) return;
    const next = { ...state, default_board: id };
    localStorage.setItem("user", JSON.stringify(next));
    dispatch({ type: "USER", payload: next });
    await updateDoc(doc(db, "User", state.uid), { default_board: id });
  };

  // Drag a task onto another list to move it. A small movement threshold keeps clicks working;
  // on touch screens press and hold briefly to start dragging so scrolling still works.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = async ({ active, over }) => {
    setDragging(null);
    const task = active.data.current?.task;
    if (!task || !over || over.id === task.tasklist_id) return;
    await updateDoc(doc(db, "Task", task.id), { tasklist_id: over.id });
  };

  const currentBoard = boards.find((b) => b.id === boardId);

  return (
    <div className="main__container">
      {state?.uid && <Navbar onMenu={() => setMenuOpen(true)} />}
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        boards={boards}
        currentId={boardId}
        onSwitch={switchBoard}
      />
      <div className="home__container">
        <div className="board_container">
          <BoardPicker
            boards={boards}
            current={currentBoard}
            onSwitch={switchBoard}
          />
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setDragging(active.data.current?.task || null)}
          onDragCancel={() => setDragging(null)}
          onDragEnd={onDragEnd}
        >
          <div className="home__tasklist">
            {isTaskListLoading ? (
              <Loader />
            ) : (
              <>
                {taskList.map((item) => (
                  <div key={item.id}>
                    <TaskList taskList={item} />
                  </div>
                ))}
                <TaskListInput board_id={boardId} />
              </>
            )}
          </div>
          <DragOverlay dropAnimation={null}>
            {dragging ? <div className="task__drag-overlay">{dragging.task_name}</div> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Home;
