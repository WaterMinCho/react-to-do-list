import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api";
import { useNavigate } from "react-router-dom";
import { isInitialMatch } from "../utils/str";
import dayjs from "dayjs";
import styled, { css } from "styled-components";
import { useCookies } from "react-cookie";

const Todos: React.FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["userid"]);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  //로그인 여부 확인
  const navigate = useNavigate();

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  }); //조회
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (!cookies.userid) {
      navigate("/login");
    }
  }, [cookies?.userid, navigate]);

  //로그아웃
  const handleLogout = () => {
    removeCookie("userid", { path: "/" });
    navigate("/login");
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      addTodoMutation.mutate({
        content: inputValue,
        date: dayjs().format("YYYY-MM-DD"),
        completed: false,
        user_id: parseInt(cookies.userid),
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
        console.error("전체삭제 에러:", error);
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (searchValue === "") return true; // 검색어가 없으면 모든 항목 표시
    const lowerCaseSearch = searchValue.toLowerCase();
    const lowerCaseContent = todo.content.toLowerCase();

    // 완전 일치 검색
    if (lowerCaseContent.includes(lowerCaseSearch)) return true;

    // 초성 검색
    return isInitialMatch(todo.content, searchValue);
  });

  return (
    <TodosContainer>
      <HeaderContainer>
        <ActionButton onClick={handleLogout}>Logout</ActionButton>
      </HeaderContainer>
      <ContentContainer>
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
            리스트전체삭제
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
          {filteredTodos.map((todo, index) => (
            <TodoItem key={todo.id} onClick={() => handleToggleComplete(todo)}>
              <IndexContainer>{filteredTodos.length - index}.</IndexContainer>
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
                    <Checkbox $checked={todo.completed} />
                    <TodoText $completed={todo.completed}>
                      {todo?.content}
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
      </ContentContainer>
    </TodosContainer>
  );
};

export default Todos;
const TodosContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const ContentContainer = styled.div`
  width: 100%;
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
  border: 1px solid #dddddd;
  border-radius: 4px;
  min-width: 0; // flex item shrinking 방지
`;

const StyledButton = styled.button`
  background-color: #3383fd;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #2a6ed1;
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

const IndexContainer = styled.div`
  min-width: 30px;
  margin-right: 10px;
  text-align: center;
  font-weight: bold;
  color: #3383fd;
`;

const TodoItem = styled.li`
  background-color: #f9f9f9;
  border: 1px solid #dddddd;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.3s ease-in-out;
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
  margin-left: 6px;
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
  color: ${(props) => (props.$completed ? "#778899" : "#333333")};
  transition: all 0.3s ease-in-out;
  font-weight: 400;
  font-size: 1rem;
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid #3383fd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.$checked &&
    css`
      background-color: #3383fd;
      border-radius: 50%;
      &:after {
        content: "✓";
        color: white;
        font-size: 16px;
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
    opacity: 0.7;
  }
`;
