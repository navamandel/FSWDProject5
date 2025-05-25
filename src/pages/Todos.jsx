import React, { useState, useEffect } from "react";

function Todos({ userId }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({ sortBy: "id", search: "", status: "all" });
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load todos from server based on userId
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:3000/todos?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(e => {
        setError("Error loading todos");
        setLoading(false);
      });
  }, [userId]);

  // Filter and sort todos according to criteria
  const filteredTodos = todos
    .filter(todo => {
      if (filter.status === "done") return todo.completed === true;
      if (filter.status === "notdone") return todo.completed === false;
      return true; // all todos
    })
    .filter(todo => {
      if (filter.search === "") return true;
      const s = filter.search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(s) ||
        todo.id.toString().includes(s)
      );
    })
    .sort((a, b) => {
    // Sort incomplete before complete
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // a completed moves down
    }

    // If both same completion status, sort by chosen field
    if (filter.sortBy === "id") return a.id - b.id;
    if (filter.sortBy === "title") return a.title.localeCompare(b.title);
    if (filter.sortBy === "completed") return 0; // They are equal here anyway

    return 0;
    });


  // Add new todo
  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;
    const newTodo = {
      userId,
      title: newTodoTitle,
      completed: false,
    };
    // POST new todo to server
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then(res => res.json())
      .then(data => {
        setTodos(prev => [...prev, data]);
        setNewTodoTitle("");
      })
      .catch(() => alert("Error adding todo"));
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      })
      .catch(() => alert("Error updating todo"));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    fetch(`http://localhost:3000/todos/${id}`, { method: "DELETE" })
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => alert("Error deleting todo"));
  };

  return (
    <div>
      <h2>Todos for user {userId}</h2>

      <div>
        <label>
          Sort by:
          <select value={filter.sortBy} onChange={e => setFilter({...filter, sortBy: e.target.value})}>
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
            onChange={e => setFilter({...filter, search: e.target.value})}
            placeholder="Search by id or title"
          />
        </label>

        <label>
          Status:
          <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
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
      {error && <p style={{color: "red"}}>{error}</p>}

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{textDecoration: todo.completed ? "line-through" : "none"}}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.id} - {todo.title}
            <button onClick={() => deleteTodo(todo.id)} style={{marginLeft: "10px", color: "red"}}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
