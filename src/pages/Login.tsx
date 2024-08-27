import React from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 로직 구현
    localStorage.setItem("isLoggedIn", "true");
    window.alert("로그인 완료!");
    navigate("/");
  };

  return (
    <div>
      <h1>Login</h1>
      {/* 로그인 폼 구현 */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate("/join")}>Join</button>
    </div>
  );
};

export default Login;
