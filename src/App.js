import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("Low");

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Low");

  const tasksCollectionRef = collection(db, "tasks");

  const createTask = async () => {
    await addDoc(tasksCollectionRef, {
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate,
      priority: newPriority,
    });
  };

  const updateTask = async (id, updatedFields) => {
    const taskDoc = doc(db, "tasks", id);
    await updateDoc(taskDoc, updatedFields);
  };

  const deleteTask = async (id) => {
    const taskDoc = doc(db, "tasks", id);
    await deleteDoc(taskDoc);
  };

  useEffect(() => {
    const getTasks = async () => {
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getTasks();
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Task Title..."
        onChange={(event) => {
          setNewTitle(event.target.value);
        }}
      />
      <textarea
        placeholder="Task Description..."
        onChange={(event) => {
          setNewDescription(event.target.value);
        }}
      />
      <input
        type="date"
        onChange={(event) => {
          setNewDueDate(event.target.value);
        }}
      />
      <select
        onChange={(event) => {
          setNewPriority(event.target.value);
        }}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={createTask}>Create Task</button>
      {tasks.map((task) => {
        const isEditing = task.id === editingTaskId;

        return (
          <div key={task.id}>
            {isEditing ? (
              <div>
                <input
                  value={editTitle}
                  placeholder="New Title..."
                  onChange={(event) => {
                    setEditTitle(event.target.value);
                  }}
                />
                <textarea
                  value={editDescription}
                  placeholder="New Description..."
                  onChange={(event) => {
                    setEditDescription(event.target.value);
                  }}
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(event) => {
                    setEditDueDate(event.target.value);
                  }}
                />
                <select
                  value={editPriority}
                  onChange={(event) => {
                    setEditPriority(event.target.value);
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button
                  onClick={() => {
                    const updatedFields = {
                      title: editTitle,
                      description: editDescription,
                      dueDate: editDueDate,
                      priority: editPriority,
                    };
                    updateTask(task.id, updatedFields);
                    setEditingTaskId(null);
                  }}
                >
                  Save
                </button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>Title: {task.title}</h2>
                <p>Description: {task.description}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Priority: {task.priority}</p>
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setEditDueDate(task.dueDate);
                    setEditPriority(task.priority);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this task?")) {
                      deleteTask(task.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
