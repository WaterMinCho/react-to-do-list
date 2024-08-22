import React, {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { AxiosInstance } from "./axios";
import { AxiosResponse } from "axios";

interface Todo {
  id: number;
  user_id?: number;
  content: string;
  date?: string;
  completed: boolean;
}

type AddKeyEnterProps = {
  e: KeyboardEvent<HTMLInputElement>;
  pressType: "add";
};

type EditKeyEnterProps = {
  e: KeyboardEvent<HTMLInputElement>;
  pressType: "edit";
  selectedItem: Todo;
};

// 조건부 타입을 사용하여 pressType에 따라 selectedItem의 필요 여부 결정
type HandleKeyEnterProps<T extends "add" | "edit"> = T extends "add"
  ? AddKeyEnterProps
  : EditKeyEnterProps;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setList();
  }, []);

  const customLog = (...args: any[]): void => {
    if (module.hot) {
      console.clear();
    }
    console.log(...args);
  };

  const setList = () => {
    AxiosInstance.get<Todo, AxiosResponse>("/todos", {
      params: {
        user_id: 4,
      },
    }).then((resp) => {
      if (resp.status === 200) {
        setTodos(resp.data);
      } else {
        // 실패
      }
    });
  };

  // 엔터 키 처리
  const handleKeyEnter = <T extends "add" | "edit">(
    props: HandleKeyEnterProps<T>
  ): void => {
    const { e, pressType } = props;

    if (pressType === "add") {
      addTodo();
    }
    if (pressType === "edit") {
      const editProps = props as EditKeyEnterProps;
      finishEditing(editProps.selectedItem.id, e.currentTarget.value);
    }
  };

  // 할일 추가
  const addTodo = (): void => {
    if (inputValue.trim() !== "") {
      AxiosInstance.post<Todo, AxiosResponse>("/todos", {
        id: Date.now(),
        content: inputValue,
        date: "2024-08-20",
        completed: true,
        user_id: 4,
      })
        .then((resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            setList();
          } else {
            // 실패
          }
        })
        .finally(() => {
          setInputValue("");
        });
    }
  };

  // 할일 삭제
  const deleteTodo = useCallback((id: number): void => {
    AxiosInstance.delete<Todo, AxiosResponse>("/todos", {
      params: {
        id,
        user_id: 4,
      },
    }).then((res) => {
      if (res.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        // 실패
      }
    });
  }, []);

  //일괄 삭제 개발중
  const deleteAll = (): void => {
    setTodos([]);
  };

  // 할일 수정 시작
  const startEditing = useCallback((id: number): void => {
    setEditingId(id);
  }, []);

  // 할일 수정 완료
  const finishEditing = (id: number, newText: string): void => {
    AxiosInstance.put<Todo, AxiosResponse>("/todos", {
      id: id,
      content: newText,
      date: "2024-08-20",
      completed: true,
      user_id: 4,
    })
      .then((resp) => {
        if (resp.status === 200) {
          setList();
        }
      })
      .finally(() => {
        setEditingId(null);
      });
  };

  // 할일 완료 상태 토글
  const toggleComplete = useCallback((id: number): void => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // 검색된 할일 목록
  const filteredTodos = todos.filter((todo) =>
    todo.content.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="App">
      <h1>할일목록</h1>

      {/* 할일 입력 및 추가 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        placeholder="할일 입력"
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            handleKeyEnter({ e, pressType: "add" });
          }
        }}
      />
      <button onClick={addTodo}>추가</button>

      {/* 검색 */}
      <input
        type="text"
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
        placeholder="검색"
      />

      {/* 할일 목록 */}
      <ul>
        {filteredTodos.map((todoItem) => (
          <li key={todoItem.id}>
            {editingId === todoItem.id ? (
              //수정
              <input
                autoFocus={true}
                type="text"
                defaultValue={todoItem.content}
                onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                  finishEditing(todoItem.id, e.target.value)
                }
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleKeyEnter({
                      e,
                      pressType: "edit",
                      selectedItem: todoItem,
                    });
                  }
                }}
              />
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todoItem.completed
                      ? "line-through"
                      : "none",
                  }}
                  onClick={() => toggleComplete(todoItem.id)}
                >
                  {todoItem.content}
                </span>
                <button onClick={() => startEditing(todoItem.id)}>수정</button>
                <button onClick={() => deleteTodo(todoItem.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
