import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";

interface Todo {
  id: number;
  user_id?: number;
  content: string;
  date?: string;
  completed: boolean;
}

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      addTodoMutation.mutate({
        content: inputValue,
        date: "2024-08-20",
        completed: false,
        user_id: 4,
      });
      setInputValue("");
    }
  };

  const handleUpdateTodo = (todo: Todo, newContent: string) => {
    updateTodoMutation.mutate({ ...todo, content: newContent });
    setEditingId(null);
  };

  const handleToggleComplete = (todo: Todo) => {
    updateTodoMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="App">
      <h1>할일목록</h1>

      <input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        placeholder="할일 입력"
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") handleAddTodo();
        }}
      />
      <button onClick={handleAddTodo}>추가</button>

      <input
        type="text"
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
        placeholder="검색"
      />

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <input
                autoFocus
                type="text"
                defaultValue={todo.content}
                onBlur={(e) => handleUpdateTodo(todo, e.target.value)}
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter")
                    handleUpdateTodo(todo, e.currentTarget.value);
                }}
              />
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                  onClick={() => handleToggleComplete(todo)}
                >
                  {todo.content}
                </span>
                <button onClick={() => setEditingId(todo.id)}>수정</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
