import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser, LoginFormInputs, AxiosError } from "../api";
import styled from "styled-components";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await loginUser(data);
      console.log("로그인 성공:", response);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", response.id.toString());
      window.alert("로그인 완료!");
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setError("userpassword", {
            type: "manual",
            message: "아이디 또는 비밀번호가 올바르지 않습니다.",
          });
        } else {
          window.alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        window.alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };
  return (
    <LoginContainer>
      <LoginTitle>어서오세여</LoginTitle>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <InputGroup>
            <Label htmlFor="id">아이디</Label>
            <Input
              id="id"
              type="text"
              {...register("userid", { required: "아이디를 입력해주세요" })}
            />
            {errors.userid && (
              <ErrorMessage>{errors.userid.message}</ErrorMessage>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              {...register("userpassword", {
                required: "패스워드를 입력해주세요",
              })}
            />
            {errors.userpassword && (
              <ErrorMessage>{errors.userpassword.message}</ErrorMessage>
            )}
          </InputGroup>
        </InputContainer>
        <ButtonGroup>
          <SubmitButton type="submit">로그인</SubmitButton>
          <JoinButton type="button" onClick={() => navigate("/join")}>
            회원가입
          </JoinButton>
        </ButtonGroup>
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
`;
const InputContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const LoginTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const LoginForm = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 12px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SubmitButton = styled(Button)`
  background-color: #3383fd;
  color: white;

  &:hover {
    background-color: #2a6ed1;
  }
`;

const JoinButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  margin-left: 6px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default Login;
