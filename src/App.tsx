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
import Layout from "./components/Layout";

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
            <Route path="/" element={<Layout />}>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="/todos" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AppContainer>
      </Router>
    </CookiesProvider>
  );
}

const AppContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 20px;
`;
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
export default App;
