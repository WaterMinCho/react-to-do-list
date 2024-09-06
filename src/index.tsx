import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: (query) => {
        // 현재 시간과 마지막 데이터 업데이트 시간의 차이를 계산
        const lastUpdated = dayjs(query.state.dataUpdatedAt);
        const now = dayjs();
        const minutesSinceLastUpdate = now.diff(lastUpdated, "minute");
        if (minutesSinceLastUpdate >= 1) {
          // 1분 이상 지났을 때 윈도우 focus되면 리페치
          console.log(
            "-------------------REFETCHING DATA WITH FOUCS--------------------"
          );
          return true;
        } else {
          return false;
        }
      },
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
