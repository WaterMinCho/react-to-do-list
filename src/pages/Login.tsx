import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser, LoginFormInputs, AxiosError } from "../api";
import { useCookies } from "react-cookie";
import styled from "styled-components";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "userid",
    "rememberedUserId",
  ]);
  const [rememberMe, setRememberMe] = useState<boolean>(false); // 아이디 저장 상태 관리
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    setRememberMe(cookies?.userid ? true : false);
  }, [cookies.userid]);

  useEffect(() => {
    const savedUserId = cookies.rememberedUserId;
    if (savedUserId) {
      setValue("userid", savedUserId);
      setRememberMe(true);
    }
  }, []);

  // 아이디 저장 체크박스 상태 변경
  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    // 로그인완료 여부에 무관하게 아이디 저장

    try {
      await loginUser(data);
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

    // rememberMe가 true일 경우에만 쿠키에 userid 저장
    if (rememberMe) {
      setCookie("rememberedUserId", data.userid, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7일간 유효
      });
    } else {
      removeCookie("rememberedUserId");
    }
  };

  return (
    <LoginContainer>
      <LoginTitle>어서오세요</LoginTitle>
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
          {/* 아이디 저장 체크박스 */}
          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              아이디 저장
            </CheckboxLabel>
          </CheckboxGroup>
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

// 스타일링
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

// 아이디 저장 체크박스 스타일링
const CheckboxGroup = styled.div`
  margin-top: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;

  input {
    margin-right: 8px;
  }
`;

export default Login;
