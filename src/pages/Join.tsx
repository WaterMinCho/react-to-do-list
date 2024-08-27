import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
import { joinUser, JoinFormInputs, AxiosError } from "../api";

const Join: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JoinFormInputs>();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const onSubmit = async (data: JoinFormInputs) => {
    try {
      const response = await joinUser(data);
      console.log("회원가입 성공:", response);
      window.alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError && error?.response) {
        // 서버에서 반환한 에러 메시지 확인
        const errorData = error.response?.data as { error?: string };
        window.alert(
          `회원가입 실패: ${
            errorData.error || "알 수 없는 오류가 발생했습니다."
          }`
        );
      } else {
        window.alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    console.log("Adress Complete: ", data);
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
      fullAddress += extraAddress ? ` (${extraAddress})` : "";
    }

    setValue("zipcode", data.zonecode);
    setValue("address1", fullAddress);
    setIsAddressModalOpen(false);
  };

  return (
    <JoinContainer>
      <JoinTitle>회원가입</JoinTitle>
      <JoinForm onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="userid">아이디</Label>
          <Input
            id="userid"
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
            {...register("password", { required: "비밀번호를 입력해주세요" })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="username">이름</Label>
          <Input
            id="username"
            {...register("username", { required: "이름을 입력해주세요" })}
          />
          {errors.username && (
            <ErrorMessage>{errors.username.message}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "이메일을 입력해주세요" })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="zipcode">우편번호</Label>
          <ZipcodeContainer>
            <ZipcodeInput
              id="zipcode"
              {...register("zipcode", { required: "우편번호를 입력해주세요" })}
              readOnly
            />
            <AddressSearchButton
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
            >
              주소 찾기
            </AddressSearchButton>
          </ZipcodeContainer>
          {errors.zipcode && (
            <ErrorMessage>{errors.zipcode.message}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="address1">주소</Label>
          <Input
            id="address1"
            {...register("address1", { required: "주소를 입력해주세요" })}
            readOnly
          />
          {errors.address1 && (
            <ErrorMessage>{errors.address1.message}</ErrorMessage>
          )}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="address2">상세주소</Label>
          <Input id="address2" {...register("address2")} />
        </InputGroup>
        <ButtonGroup>
          <SubmitButton type="submit">가입하기</SubmitButton>
          <CancelButton type="button" onClick={() => navigate("/login")}>
            취소
          </CancelButton>
        </ButtonGroup>
      </JoinForm>

      {isAddressModalOpen && (
        <ModalBackground>
          <ModalContent>
            <DaumPostcode onComplete={handleComplete} />
            <CloseButton onClick={() => setIsAddressModalOpen(false)}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalBackground>
      )}
    </JoinContainer>
  );
};

const JoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;
const Button = styled.button`
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-width: 1px;
  border-color: #000000;
  background-color: #ffffff;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;
const JoinTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const JoinForm = styled.form`
  width: 100%;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const ZipcodeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ZipcodeInput = styled(Input)`
  flex: 1;
`;

const AddressSearchButton = styled(Button)`
  flex-shrink: 0;
  white-space: nowrap;
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

const SubmitButton = styled(Button)`
  background-color: #3383fd;
  color: white;
  border: none;
  &:hover {
    background-color: #2a6ed1;
  }
`;

const CancelButton = styled(Button)`
  color: #333;
  margin-left: 6px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const CloseButton = styled(Button)`
  margin-top: 10px;
  background-color: #f0ffff;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;
export default Join;
