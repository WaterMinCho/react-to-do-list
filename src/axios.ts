import axios from "axios";

const baseURL = "http://192.168.13.54:3000";
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
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
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
  (error) => {
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
