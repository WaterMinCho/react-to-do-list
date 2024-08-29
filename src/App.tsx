import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { generateRoutes, RouteConfig } from "./utils/routeUtils";
import Todos from "./pages/Todos";
import { CookiesProvider } from "react-cookie";

const GlobalStyle = createGlobalStyle`
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}
`;

function App() {
  const generatedRoutes = generateRoutes();
  const routes: RouteConfig[] = [
    { path: "/", element: <Todos /> },
    ...generatedRoutes,
  ];

  return (
    <CookiesProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="/todos" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </CookiesProvider>
  );
}

const AppContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;
export default App;
