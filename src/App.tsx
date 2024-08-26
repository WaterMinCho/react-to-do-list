import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import dayjs from "dayjs";
import styled, { keyframes } from "styled-components";

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
        date: dayjs().format("YYYY-MM-DD"),
        completed: false,
        user_id: 4,
      });
      setInputValue("");
    }
  };

  const handleUpdateTodo = (todo: Todo, newContent: string) => {
    updateTodoMutation.mutate({
      ...todo,
      content: newContent,
      date: dayjs().format("YYYY-MM-DD"),
    });
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
    <AppContainer>
      <Title>할일목록</Title>
      <InputContainer>
        <StyledInput
          type="text"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          placeholder="할일 입력"
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleAddTodo();
          }}
        />
        <StyledButton onClick={handleAddTodo}>추가</StyledButton>
      </InputContainer>
      <InputContainer>
        <StyledInput
          type="text"
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
          placeholder="검색"
        />
      </InputContainer>
      <TodoList>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} onClick={() => handleToggleComplete(todo)}>
            {editingId === todo.id ? (
              <StyledInput
                autoFocus
                type="text"
                defaultValue={todo.content}
                onBlur={(e) => handleUpdateTodo(todo, e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter")
                    handleUpdateTodo(todo, e.currentTarget.value);
                }}
              />
            ) : (
              <>
                <TodoText completed={todo.completed}>{todo.content}</TodoText>
                <div>
                  <ActionButton onClick={() => setEditingId(todo.id)}>
                    수정
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteTodo(todo.id)}>
                    삭제
                  </ActionButton>
                </div>
              </>
            )}
          </TodoItem>
        ))}
      </TodoList>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  max-width: 800px; // 원하는 최대 너비로 조정
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%; // 컨테이너가 전체 너비를 차지하도록 설정
`;

const StyledInput = styled.input`
  flex: 1; // 남는 공간 모두 차지
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 0; // flex item shrinking 방지
`;

const StyledButton = styled.button`
  background-color: #3383fd;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
`;

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const clickAnimation = keyframes`
0% {
  transform: scale(1);
}
50% {
  transform: scale(0.97);
}
100% {
  transform: scale(1);
}
`;

const TodoItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &:active {
    animation: ${clickAnimation} 0.3s ease-in-out;
  }
`;

const TodoText = styled.span<{ completed: boolean }>`
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  flex-grow: 1;
`;

const ActionButton = styled(StyledButton)`
  padding: 5px 10px;
  margin-left: 5px;
`;

export default App;
