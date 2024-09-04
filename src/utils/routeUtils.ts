import React from "react";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}
interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

export function generateRoutes(): RouteConfig[] {
  const context: RequireContext = (require as any).context(
    "../pages",
    true,
    /\.tsx$/
  );

  return context
    .keys()
    .map((key: string) => {
      const path = key
        .replace(/^\.\//, "")
        .replace(/\.tsx$/, "")
        .toLowerCase();
      const ComponentModule = context(key);
      const Component = ComponentModule?.default || ComponentModule;
      return {
        path: `/${path}`,
        element: React.createElement(Component),
      };
    })
    .filter((route: RouteConfig) => route.path !== "/");
}
