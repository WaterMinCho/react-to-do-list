import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "http://192.168.13.54:3000",
  headers: { "Content-Type": "application/json" },
  timeout: 10 * 1000,
});
