import React, { useState, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [timer, setTimer] = useState(0);
  const [workSessions, setWorkSessions] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchTodos(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    filterTodos('all');
  }, [todos]);

  const fetchUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    setUsers(data);
  };

  const fetchTodos = async (userId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    const data = await response.json();
    setTodos(data);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const filterTodos = (filter) => {
    switch (filter) {
      case 'completed':
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case 'incomplete':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      default:
        setFilteredTodos(todos);
        break;
    }
  };

  const toggleTodoCompletion = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    filterTodos('all');
  };

  const editTodoTitle = (id, newTitle) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
  };

  const startTimer = () => {
    setTimer(15);
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setWorkSessions(prevSessions => prevSessions + 1);
      if (workSessions % 2 === 0) {
        alert("Please Take Breake for 10 seconds")
        setTimer(10);
      } else {
        alert("Please Take Breake for 5 seconds")
        setTimer(5);
      }
    }, 15000);
  };

  return (
    <div className="App m-3">
      <h1 className='mb-3'>React Test By Sahil</h1>
      <h1 className='mb-3'>User Authentication, Todo Management, and Productivity Timer</h1>
      {selectedUser ? (
        <div>
          <div className="d-flex justify-content-between">
            <h2>Welcome, {selectedUser.name}!</h2>
            <button className='btn btn-danger' onClick={() => setSelectedUser(null)}>Log out</button>
          </div>
          <div className='d-flex justify-content-between m-5'>
          <h3>Todos:</h3>
          <select onChange={(e) => filterTodos(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          </div>
          <ul className='m-5'>
            {filteredTodos.map(todo => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  className='me-3'
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id)}
                />
                <input
                  type="text"
                  className='w-50'
                  value={todo.title}
                  onChange={(e) => editTodoTitle(todo.id, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between m-3">
          <p>Timer: {timer}</p>
          <p>Work Sessions Completed: {workSessions}</p>
          <button className='btn btn-success' onClick={startTimer}>Start Work Session</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Please select a user to log in:</h2>
          <ul className='text-center'>
            {users.map(user => (
              <li key={user.id}  >
                <button className='btn btn-outline-dark mb-3' onClick={() => handleUserSelect(user)}>{user.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
