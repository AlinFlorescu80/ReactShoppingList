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
  const [newHour, setNewHour] = useState("00:00"); // New hour state

  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editHour, setEditHour] = useState("00:00"); // New hour state

  const tasksCollectionRef = collection(db, "tasks");

  const createTask = async () => {
    await addDoc(tasksCollectionRef, {
      title: newTitle,
      description: newDescription,
      dueDate: newDueDate,
      hour: newHour, // Include hour in task creation
    });
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
    setNewHour("00:00");
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
      <h1>Task Manager</h1>
      <input
        placeholder="Task Title..."
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
      />
      <textarea
        placeholder="Task Description..."
        value={newDescription}
        onChange={(event) => setNewDescription(event.target.value)}
      />
      <input
        type="date"
        value={newDueDate}
        onChange={(event) => setNewDueDate(event.target.value)}
      />
      <input
        type="time" // Use type="time" for the hour field
        value={newHour}
        onChange={(event) => setNewHour(event.target.value)}
      />
      <button onClick={createTask}>Create Task</button>
      {tasks.map((task) => {
        const isEditing = task.id === editingTaskId;

        return (
          <div key={task.id} className={`task ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
              <div>
                <input
                  value={editTitle}
                  placeholder="New Title..."
                  onChange={(event) => setEditTitle(event.target.value)}
                />
                <textarea
                  value={editDescription}
                  placeholder="New Description..."
                  onChange={(event) => setEditDescription(event.target.value)}
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(event) => setEditDueDate(event.target.value)}
                />
                <input
                  type="time" // Use type="time" for the hour field
                  value={editHour}
                  onChange={(event) => setEditHour(event.target.value)}
                />
                <button
                  onClick={() => {
                    const updatedFields = {
                      title: editTitle,
                      description: editDescription,
                      dueDate: editDueDate,
                      hour: editHour, // Include hour in updated fields
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
                <h2>{task.title}</h2>
                <p>Description: {task.description}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Hour: {task.hour}</p>
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setEditDueDate(task.dueDate);
                    setEditHour(task.hour);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Sigur vrei sa stergi asta varule?")) {
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
