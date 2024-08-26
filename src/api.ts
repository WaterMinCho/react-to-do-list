import axios, { AxiosError } from "axios";

const baseURL = process.env.REACT_APP_HOST_IP || "";

export const AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10 * 1000,
});

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
