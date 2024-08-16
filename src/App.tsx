import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";

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

  useEffect(() => {
    console.log(".>>>>>>>>todos", JSON.stringify(todos));
  }, [todos]);

  const customLog = (...args: any[]): void => {
    if (module.hot) {
      console.clear();
    }
    console.log(...args);
  };

  // 엔터 키 처리
  const handleKeyEnter = <T extends "add" | "edit">(
    props: HandleKeyEnterProps<T>
  ): void => {
    const { e, pressType } = props;

    if (e.key === "Enter") {
      if (pressType === "add") {
        addTodo();
      }
      if (pressType === "edit") {
        finishEditing(props.selectedItem.id, e.currentTarget.value);
      }
    }
  };

  // 할일 추가
  const addTodo = (): void => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  // 할일 삭제
  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  //일괄 삭제
  const deleteAll = (): void => {
    setTodos([]);
  };

  // 할일 수정 시작
  const startEditing = (id: number): void => {
    setEditingId(id);
  };

  // 할일 수정 완료
  const finishEditing = (id: number, newText: string): void => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  };

  // 할일 완료 상태 토글
  const toggleComplete = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

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
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          handleKeyEnter({ e, pressType: "add" });
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
                type="text"
                defaultValue={todoItem.text}
                onBlur={(e: ChangeEvent<HTMLInputElement>) =>
                  finishEditing(todoItem.id, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  handleKeyEnter({
                    e,
                    pressType: "edit",
                    selectedItem: todoItem,
                  });
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
