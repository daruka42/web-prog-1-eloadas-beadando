import React, { useState, useEffect } from "react";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  
  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, text: e.target.value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: new Date().getTime(),
          text: todo.trim(),
          completed: false,
        },
      ]);
    }
    
    setTodo("");
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(removeItem);
  }

  function handleUpdateTodo(id, updatedTodo) {
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });
    setIsEditing(false);
    setTodos(updatedItem);
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  function handleToggleComplete(id) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  }
  
  return (
    <div className="todo-container">
      {isEditing ? (
        <form onSubmit={handleEditFormSubmit} className="todo-form">
          <h2>Teendő szerkesztése</h2>
          <input
            name="editTodo"
            type="text"
            placeholder="Teendő szerkesztése"
            value={currentTodo.text}
            onChange={handleEditInputChange}
          />
          <button type="submit">Frissítés</button>
          <button onClick={() => setIsEditing(false)}>Mégse</button>
        </form>
      ) : (
        <form onSubmit={handleFormSubmit} className="todo-form">
          <h2>Teendők listája</h2>
          <input
            name="todo"
            type="text"
            placeholder="Új teendő hozzáadása"
            value={todo}
            onChange={handleInputChange}
          />
          <button type="submit">Hozzáadás</button>
        </form>
      )}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <div className="todo-text">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              <span>{todo.text}</span>
            </div>
            <div className="todo-actions">
              <button onClick={() => handleEditClick(todo)}>Szerkesztés</button>
              <button onClick={() => handleDeleteClick(todo.id)}>Törlés</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  }
  
  export default TodoList;
  