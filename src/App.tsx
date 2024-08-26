import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Todos from "./pages/Todos/Todos";

function App() {
  const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
  }
`;

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <nav>
          <StyledLink to="/">Home</StyledLink>
          <StyledLink to="/todos">Todos</StyledLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

const AppContainer = styled.div`
  max-width: 800px; // 원하는 최대 너비로 조정
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;
const StyledLink = styled(Link)`
  margin-right: 10px;
  text-decoration: none;
  color: #3383fd;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
const Home = () => <h1>할일목록 Root</h1>;
export default App;
