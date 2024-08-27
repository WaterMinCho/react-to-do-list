import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { generateRoutes } from "./utils/routeUtils";
import Todos from "./pages/Todos";
import { CookiesProvider } from "react-cookie";

const GlobalStyle = createGlobalStyle`
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}
`;

function App() {
  const routes = generateRoutes();
  return (
    <CookiesProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          {/* <StyledLink
          to="/todos"
          style={({ isActive }) =>
            isActive ? { color: "#fd4877", textDecoration: "underline" } : {}
          }
        >
          Todos
        </StyledLink> */}
          <Routes>
            <Route path="/" element={<Todos />} />
            <Route path="/todos" element={<Navigate to="/" replace />} />
            {routes.map((route) => (
              <Route
                key={route?.path}
                path={route?.path}
                element={route?.element}
              />
            ))}
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
const StyledLink = styled(NavLink)`
  margin-right: 10px;
  text-decoration: none;
  color: #3383fd;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: #fd4877;
  }
`;
export default App;
