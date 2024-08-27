import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";

const baseURL = process.env.REACT_APP_HOST_IP || "";
// 로그인 폼 인터페이스
export interface LoginFormInputs {
  userid: string;
  userpassword: string;
}

const cookies = new Cookies();
// 회원가입 폼 인터페이스
export interface JoinFormInputs {
  userid: string;
  password: string;
  username: string;
  email: string;
  address1: string;
  address2: string;
  zipcode: string;
}

export const AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10 * 1000,
});

// userid주입하는 인터셉터 추가.
AxiosInstance.interceptors.request.use(
  (config) => {
    const userid = cookies.get("userid");
    if (userid) {
      config.params = { ...config.params, user_id: userid };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "Request:",
      config.method?.toUpperCase(),
      baseURL + config.url,
      "Request Data:",
      config.data
    );
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "Response:",
      response.status,
      baseURL + response.config.url,
      "Response Data:",
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    console.error(
      "Response Error:",
      error.response?.status,
      error.response?.config.url,
      "Error Data:",
      error.response?.data
    );
    return Promise.reject(error);
  }
);

//todos
export const fetchTodos = () =>
  AxiosInstance.get("/todos", { params: { user_id: 4 } }).then(
    (res) => res.data
  );
export const addTodo = (newTodo: Omit<Todo, "id">) =>
  AxiosInstance.post("/todos", newTodo).then((res) => res.data);

export const updateTodo = (updatedTodo: Todo) =>
  AxiosInstance.put("/todos", updatedTodo).then((res) => res.data);

export const deleteTodo = (id: number) =>
  AxiosInstance.delete("/todos", { params: { id, user_id: 4 } }).then(
    (res) => res.data
  );

//Join/Login
export const loginUser = (credentials: LoginFormInputs) =>
  AxiosInstance.post("/login", credentials).then((res) => res.data);

export const joinUser = (userData: JoinFormInputs) =>
  AxiosInstance.post("/users", userData).then((res) => res.data);

export { AxiosError };
