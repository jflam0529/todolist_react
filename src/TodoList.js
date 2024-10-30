import React, { useState, useEffect } from 'react';
import './TodoList.css'; // 导入 CSS 文件

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('Low');
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    setTodos(JSON.parse(storedTodos));
    
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
    
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { text: inputValue, completed: false, priority, timestamp: Date.now() }]);
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    newTodos[index].timestamp = Date.now(); // Update timestamp on completion
    setTodos(newTodos);
  };

  const editTodo = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index].text = newText;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // 阻止默认的换行行为
      e.preventDefault();
  
      // 模拟 onBlur 逻辑，保存编辑内容并收起文本框
      editTodo(index, e.target.innerText);
      setExpandedIndex(null); // 收起展开状态
      e.target.blur();
    }
  };

  const sortedTodos = todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.completed) {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.timestamp - b.timestamp;
  });

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Add a new todo"
      />
      <select value={priority} onChange={handlePriorityChange}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTodo}>Add</button>
      <ul>
        {sortedTodos.map((todo, index) => (
          <li
            key={index}
            className={`priority-${todo.priority} ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(index)}
            />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                editTodo(index, e.target.innerText);
                setExpandedIndex(null);
                }}
              onClick={() => toggleExpand(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {todo.text}
            </span>
            <span className="priority-label">{todo.priority}</span>
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
