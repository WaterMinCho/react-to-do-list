import React, {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
} from "react";
import { useCookies } from "react-cookie";

interface Todo {
  id: number;
  text: string;
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

  /* 개발중
  const [cookies, setCookies, removeCookies] = useCookies(); //setCookies('key', 쿠키에 넣을 값, 옵션) , removeCookies('key', 옵션) ,
  /**
   * path(string) : 쿠키 경로, / -> 모든 페이지에서 쿠키에 액세스 가능
   * expires(Date) : 쿠키의 만료 날짜
   * maxAge(number) : 클라이언트가 쿠키를 수신한 시점부터 들어간 인자값으로 n초후에 쿠키만료
   * doamin(string) : 쿠키의 도메인(sub.domain.com 또는 .allsubdomains.com)
   * secure(boolean) : HTTPS를 통해서만 액세스 가능
   * httpOnly(booelan): 서버만 쿠키에 접근 가능
   * sameSite (boolean | none | lax | strice) : Strict 또는 Lax 적용
  useEffect(() => {
    // setCookies("todos", todos, { path: "/" });
    // console.log(">>>.todos", todos);
  }, []);

  const customLog = (...args: any[]): void => {
    if (module.hot) {
      console.clear();
    }
    console.log(...args);
  };
   */

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
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: Date.now(), text: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  // 할일 삭제
  const deleteTodo = useCallback((id: number): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
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
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
    console.log(">>>>>>>>>>>>>>");
    setEditingId(null);
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
    todo.text.toLowerCase().includes(searchValue.toLowerCase())
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
          //onKeyDown 이상함~><
          console.log(">>>handleKeyEnter");
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
                defaultValue={todoItem.text}
                onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                  finishEditing(todoItem.id, e.target.value)
                }
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  //onKeyDown 이상함~><
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
                  {todoItem.text}
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
