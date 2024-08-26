import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./api";
import dayjs from "dayjs";
import styled, { keyframes, css } from "styled-components";

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

  const handleDeleteAllTodos = async () => {
    if (window.confirm("모든 할 일을 삭제하시겠습니까?")) {
      try {
        await Promise.all(
          todos.map((todo) => deleteTodoMutation.mutateAsync(todo.id))
        );
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      } catch (error) {
        console.error("Failed to delete all todos:", error);
      }
    }
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
          onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              handleAddTodo();
            }
          }}
        />
        <StyledButton onClick={handleAddTodo}>추가</StyledButton>
        <StyledButton
          onClick={handleDeleteAllTodos}
          disabled={todos.length === 0}
        >
          초기화
        </StyledButton>
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
                onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
              />
            ) : (
              <>
                <TodoTextContainer>
                  <Checkbox checked={todo.completed} />
                  <TodoText $completed={todo.completed}>
                    {todo.content}
                  </TodoText>
                </TodoTextContainer>
                <ActionButtonContainer>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(todo.id);
                    }}
                  >
                    수정
                  </ActionButton>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTodo(todo.id);
                    }}
                  >
                    삭제
                  </ActionButton>
                </ActionButtonContainer>
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
  width: 100%;
  gap: 10px; // 요소들 사이의 간격 추가
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
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
    background-color: #f0f0f0;
  }
`;

const TodoTextContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const TodoText = styled.span<{ $completed: boolean }>`
  margin-left: 10px;
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
  color: ${(props) => (props.$completed ? "#888" : "#333")};
  transition: all 0.3s ease-in-out;
`;

const Checkbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid #3383fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  ${(props) =>
    props.checked &&
    css`
      background-color: #3383fd;
      &:after {
        content: "✓";
        color: white;
        font-size: 14px;
        animation: ${fadeIn} 0.2s ease-in-out;
      }
    `}
`;

const ActionButtonContainer = styled.div`
  display: flex;
`;

const ActionButton = styled(StyledButton)`
  padding: 5px 10px;
  margin-left: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

export default App;
