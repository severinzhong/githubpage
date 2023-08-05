import React,{useEffect,useState,useRef} from "react";
import '../styles/TodoList.css'

export function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const isInitialMount = useRef(true); 
    useEffect(() => {
      // 从localStorage中读取存储的todos数据
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    }, []);
  
    useEffect(() => {
        if (isInitialMount.current) {
          isInitialMount.current = false; // 将初始渲染标记为false
        } else {
          localStorage.setItem("todos", JSON.stringify(todos));
        }
      }, [todos]);
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleAddTodo = () => {
      if (inputValue.trim() !== "") {
        setTodos([...todos, { text: inputValue, completed: false }]);
        setInputValue("");
      }
    };
  
    const handleToggleComplete = (index) => {
      const updatedTodos = [...todos];
      updatedTodos[index].completed = !updatedTodos[index].completed;
      setTodos(updatedTodos);
    };

    const handleDelete = (index) =>{
        const updatedTodos = todos.filter((todo,i) => i !== index);
        setTodos(updatedTodos);
    }
  
    return (
      <div className="TodoList">
        <div className="TodoListInput">
          <input  value={inputValue} onChange={handleInputChange} />
          <button onClick={handleAddTodo}>Submit</button>
        </div>
        <div>
          {todos.map((todo, index) => (
            <div
              className="TodoListLine"
              key={index}
            >
              <p 
                title={todo.text}
                style={{ textDecoration: todo.completed ? "line-through" : "" }}
              >{ todo.text}</p>
              <button className="TodoListComplete" onClick={() => handleToggleComplete(index)}>
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button  onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }