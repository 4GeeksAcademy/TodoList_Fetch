import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faCheck } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const baseURL = 'https://playground.4geeks.com/todo';
    const userURL = `${baseURL}/users/MariaV`;

    const checkIfUserExists = async () => {
        try {
            const response = await fetch(userURL);
            return response.ok;
        } catch (error) {
            console.error('Error checking if user exists', error);
            return false;
        }
    };

    const createUser = async () => {
        try {
            const userExists = await checkIfUserExists();
            if (!userExists) {
                const response = await fetch(userURL, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error("Response was not ok");
                }
                console.log('Success creating user');
            } else {
                console.log('User already exists');
            }
        } catch (error) {
            console.error('Error creating user', error);
        }
    };

    const addToDo = async (newToDo) => {
        try {
            const response = await fetch(`${baseURL}/todos/MariaV`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "label": newToDo,
                    "is_done": false
                })
            });
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const data = await response.json();
            console.log("Success creating toDo", data);
            setTodos((prevTodos) => [...prevTodos, { label: newToDo, is_done: false, id: data.id }]);
        } catch (error) {
            console.error('Error creating toDo', error);
        }
    };

    const getData = async () => {
        try {
            const response = await fetch(userURL);
            if (!response.ok) {
                throw new Error("Response was not ok");
            }
            const data = await response.json();
            setTodos(data.todos);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };

    const markToDoAsTrue = async (todoId) => {
        try {
            const response = await fetch(`${baseURL}/todos/${todoId}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "is_done": true
                })
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log("Success marking todo as done");
            setTodos((prevTodos) =>
                prevTodos.map(todo =>
                    todo.id === todoId ? { ...todo, is_done: true } : todo
                )
            );
        } catch (error) {
            console.error('Error marking todo as done', error);
        }
    };

    const deleteToDo = async (todoId) => {
        try {
            const response = await fetch(`${baseURL}/todos/${todoId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log("Success deleting todo");
            setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
        } catch (error) {
            console.error('Error deleting todo', error);
        }
    };

    const clearAllTodos = async () => {
        try {
            for (const todo of todos) {
                const response = await fetch(`${baseURL}/todos/${todo.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error(`Failed to delete todo with ID ${todo.id}`);
                }
            }
            console.log("Success deleting all todos");
            setTodos([]);
        } catch (error) {
            console.error('Error deleting all todos', error);
        }
    };

    useEffect(() => {
        createUser();
        getData();
    }, []);

    const handleDelete = (todoId) => {
        deleteToDo(todoId);
    };

    return (
        <div className="todoList">
            <h1 className="title">To do</h1>
            <div className="tasks">
                <ul className="list-group">
                    <li className="list-group-item">
                        <input
                            type="text"
                            onChange={(event) => setInputValue(event.target.value)}
                            value={inputValue}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter' && inputValue.trim() !== "") {
                                    addToDo(inputValue);
                                    setInputValue("");
                                }
                            }}
                            placeholder={todos.length === 0 ? "No tasks, add tasks" : "What needs to be done?"}
                        />
                    </li>
                    {todos.map((todo) => (
                        <li key={todo.id} className="list-group-item">
                            {todo.label}
                            <div className="trash-icon-container">
                                <FontAwesomeIcon icon={faCheck} className="check-icon" onClick={() => markToDoAsTrue(todo.id)} />
                                <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={() => handleDelete(todo.id)} />
                            </div>
                        </li>
                    ))}
                </ul>
                <div>
                    <p className="bottom">{todos.length} tasks</p>
                    <button className="delete-button" onClick={clearAllTodos}>Delete All Todos</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
