// Todos.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import "../styles/todo.css";

function Todos({ userId }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({ sortBy: "id", search: "", status: "all" });
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || !user.id) return;
    setLoading(true);
    fetch(`http://localhost:3000/todos?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(e => {
        setError("Error loading todos");
        setLoading(false);
      });
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter.status === "done") return todo.completed === true;
      if (filter.status === "notdone") return todo.completed === false;
      return true;
    })
    .filter(todo => {
      if (filter.search === "") return true;
      const s = filter.search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(s) ||
        todo.id.toString().includes(s)
      );
    })
   // Inside sort function

    .sort((a, b) => {
      // Always move completed todos to bottom, unless sorting explicitly by 'completed'
      if (filter.sortBy !== "completed") {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
      }

      if (filter.sortBy === "completed") {
        // Sort by completion status first (false before true)
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        // If equal, fallback to ID sorting
        return a.id - b.id;
      }

      if (filter.sortBy === "id") return a.id - b.id;
      if (filter.sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
});



  const handleAddTodo = () => {
  if (!newTodoTitle.trim()) return;

  // No manual id generation here
  const newTodo = {
    userId: user.id,
    title: newTodoTitle,
    completed: false,
  };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add todo");
      return res.json();
    })
    .then(data => {
      setTodos(prev => [...prev, data]);  // use backend-generated todo with unique id
      setNewTodoTitle("");
    })
    .catch(() => alert("Error adding todo"));
  };


 const toggleTodo = (id) => {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !todo.completed }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to update todo with id ${id}`);
      return res.json();
    })
    .then(updatedFields => {
      // Merge updated fields into existing todo
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t))
      );
    })
    .catch(() => alert("Error updating todo"));
};



  const deleteTodo = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" })
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => alert("Error deleting todo"));
  };

  if (!user) return null;

  return (
    <div className="todos-container">
      <Navbar user={user} onLogout={handleLogout} />
      <h2>{user?.username ? `Todos for ${user.username}` : `Todos for user ${user.id}`}</h2>

      <div>
        <label>
          Sort by:
          <select value={filter.sortBy} onChange={e => setFilter({ ...filter, sortBy: e.target.value })}>
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Status</option>
          </select>
        </label>

        <label>
          Search:
          <input
            type="text"
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            placeholder="Search by id or title"
          />
        </label>

        <label>
          Status:
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="notdone">Not Done</option>
          </select>
        </label>
      </div>

      <div>
        <input
          type="text"
          placeholder="New todo title"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      {loading && <p>Loading todos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.id} - {todo.title} 
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
