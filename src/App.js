import React, { useState, useEffect } from 'react';
import './App.css';
const App = () => {
  const [todos, setTodos] = useState([]);

  const shoppingOptions = [
    { name: 'Groceries', price: '$20.00' },
    { name: 'Electronics', price: '$100.00' },
    { name: 'Clothing', price: '$50.00' },
    { name: 'Books', price: '$30.00' },
  ];
    useEffect(() => {
      const fetchTodos = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/todos');
          const data = await response.json();
          setTodos(data);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };
      fetchTodos();
    }, []);
  

    const handleAddTodo = async (selectedOption) => {
      if (selectedOption.trim() !== '') {
        try {
          const response = await fetch('http://localhost:3001/api/todos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: selectedOption, checked: false }),
          });
          const newTodo = await response.json();
          setTodos((prevTodos) => [...prevTodos, newTodo]);
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
    };


  const handleToggleCheck = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].checked = !updatedTodos[index].checked;
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      });

      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
    const updatedTodos = [...todos];
    const [draggedTodo] = updatedTodos.splice(draggedIndex, 1);
    updatedTodos.splice(targetIndex, 0, draggedTodo);
    setTodos(updatedTodos);
  };
  const calculateTotalAmount = () => {
    return todos.reduce((total, todo) => {
      const matchingOption = shoppingOptions.find((option) => option.name === todo.text);
      return total + (matchingOption ? parseFloat(matchingOption.price.slice(1)) : 0);
    }, 0);
  };
  return (
    <div className="App">
      <h1>To-Do List Dashboard</h1>
      <div className="options-container">

        {shoppingOptions.map((option, index) => (
          <div key={index} className="card">
            <div>
              <strong>{option.name}</strong>
              <p>{option.price}</p>
            </div>
            <button onClick={() => handleAddTodo(option.name)}>Add Todo</button>
          </div>
        ))}

      </div>
      <table className="todo-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <td>
                <input
                  type="checkbox"
                  checked={todo.checked}
                  onChange={() => handleToggleCheck(index)}
                />
                <span style={{ textDecoration: todo.checked ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              </td>
              <td>
                {shoppingOptions
                  .filter((option) => option.name === todo.text)
                  .map((matchingOption) => matchingOption.price)}
              </td>
              <td>{todo.checked ? 'Completed' : 'Pending'}</td>
              <td>
              <button onClick={() => handleDeleteTodo(todo._id) }className="DeleteBtn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='totalAmount'>
        <strong>Total Amount:</strong> ${calculateTotalAmount().toFixed(2)}
      </div>
    </div>
  );
};

export default App;
