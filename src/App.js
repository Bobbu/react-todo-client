import React, { useEffect } from "react";
import "./App.css";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Todo({ todo, id, index, markTodo, removeTodo }) {
  return (
    <div
      className="todo"
      
    >
      <span style={{ textDecoration: todo.completed ? "line-through" : "" }}>{todo.item}</span>
      <div>
        <Button variant="outline-success" onClick={() => markTodo(todo, id, index)}>✓</Button>{' '}
        <Button variant="outline-danger" onClick={() => removeTodo(id, index)}>✕</Button>
      </div>
    </div>
  );
}

function FormTodo({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}> 
    <Form.Group>
      <Form.Label><b>Add Todo</b></Form.Label>
      <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new todo" />
    </Form.Group>
    <Button variant="primary mb-3" type="submit">
      Submit
    </Button>
  </Form>
  );
}

function App() {
  const [todos, setTodos] = React.useState([]);

  const url = "http://localhost:8000/todos"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const json = await response.json()
        setTodos(json)
      } catch(error) {
        console.log(error)
      }
    }

    fetchData()
  // }, {})
  }, [])

  const addTodo = async item => {
    const newTodos = [...todos, { item }];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          item: item,
          completed: false
        })
      })
      setTodos(newTodos);
    } catch (error) {
      console.log(error)
    }
  };

  const markTodo = async (todo, id, index) => {
    const newTodos = [...todos];
    newTodos[index].completed = true;
    try {
      const response = await fetch(url + "/" + String(id), {
        method: "PUT",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          item: todo.item,
          completed: true
        })
      })
      setTodos(newTodos);
    } catch (error) {
      console.log(error)
    }

  };

  const removeTodo = async (id, index) => {
    const newTodos = [...todos];

    try {
      const response = await fetch(url + "/" + String(id), {
        method: "DELETE"
      })
      newTodos.splice(index, 1);
      setTodos(newTodos);
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <FormTodo addTodo={addTodo} />
        <div>
          {todos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo
                key={index}
                index={index}
                id={todo.id}
                todo={todo}
                markTodo={markTodo}
                removeTodo={removeTodo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;