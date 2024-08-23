import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const baseURL = process.env.REACT_APP_HOST_IP || "";

export const AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10 * 1000,
});

AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// 응답 인터셉터
AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
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
