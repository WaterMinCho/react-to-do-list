import React from "react";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}
export function generateRoutes(): RouteConfig[] {
  const context = require.context("../pages", true, /\.tsx$/);
  //WebPack require.context -> (path, 하위디렉토리 재귀탑색 여부, 파일형식)
  return context
    .keys()
    .map((key) => {
      //조건에 맞는 모든 모듈의 경로를 배열로 반환.
      const path = key
        .replace(/^\.\//, "")
        .replace(/\.tsx$/, "")
        .toLowerCase();
      const ComponentModule = context(key);
      const Component = ComponentModule.default || ComponentModule;
      return {
        path: `/${path}`,
        element: React.createElement(Component),
      };
    })
    .filter((route) => route.path !== "/"); // 루트 경로 제외
}
