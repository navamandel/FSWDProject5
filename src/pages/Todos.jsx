import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Todos.css';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    setUserId(user.id);

    axios.get(`http://localhost:3000/todos?userId=${user.id}`).then(res => {
      setTodos(res.data);
      setFilteredTodos(res.data);
    });
  }, []);

  // Search & sort
  useEffect(() => {
    let filtered = [...todos];

    if (search.trim() !== '') {
      const s = search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(s) ||
        todo.id.toString().includes(s) ||
        (todo.completed ? 'done' : 'not done').includes(s)
      );
    }

    if (sortBy === 'id') filtered.sort((a, b) => a.id - b.id);
    else if (sortBy === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'status') filtered.sort((a, b) => a.completed - b.completed);

    setFilteredTodos(filtered);
  }, [search, sortBy, todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = {
      userId,
      title: newTodo,
      completed: false,
    };
    axios.post(`http://localhost:3000/todos`, todo).then(res => {
      setTodos([...todos, res.data]);
      setNewTodo('');
    });
  };

  const updateTodo = (id, updatedFields) => {
    axios.patch(`http://localhost:3000/todos/${id}`, updatedFields).then(res => {
      setTodos(todos.map(t => (t.id === id ? res.data : t)));
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`).then(() => {
      setTodos(todos.filter(t => t.id !== id));
    });
  };

  return (
    <div className="todos-container">
      <h2>Todos</h2>

      <div className="add-todo">
        <input
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="todos-controls">
        <label>Sort by: </label>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="">--</option>
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>
        <input
          type="text"
          placeholder="Search by id/title/status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            <strong>{todo.id}</strong>
            <input
              type="text"
              value={todo.title}
              onChange={(e) => updateTodo(todo.id, { title: e.target.value })}
            />
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => updateTodo(todo.id, { completed: e.target.checked })}
            />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;