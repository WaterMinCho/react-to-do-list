import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useCookies } from "react-cookie";

const Header: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isJoin = location.pathname === "/join";

  const navigate = useNavigate();

  const { date } = useParams();
  const [currentDate, setCurrentDate] = useState(date ? dayjs(date) : dayjs());
  const [cookies, setCookie, removeCookie] = useCookies(["userid"]);

  useEffect(() => {
    const pathDate = location.pathname.slice(1); // Remove the leading '/'
    if (pathDate && dayjs(pathDate).isValid()) {
      setCurrentDate(dayjs(pathDate));
    }
  }, [location.pathname]);

  const handleDateChange = (direction: "prev" | "next") => {
    const newDate =
      direction === "prev"
        ? currentDate.subtract(1, "day")
        : currentDate.add(1, "day");

    const formattedDate = newDate.format("YYYY-MM-DD");
    navigate(`/${formattedDate}`);
  };

  const TitleMapper = () => {
    if (isLogin) {
      return "어서오세요";
    } else if (isJoin) {
      return "회원가입";
    } else {
      null;
    }
  };

  const handleLogout = () => {
    removeCookie("userid", { path: "/" });
    navigate("/login");
  };

  const handleCalendarClick = () => {
    // 달력 기능 구현
    console.log("Calendar clicked");
  };

  return (
    <>
      {TitleMapper() ? (
        <Title>{TitleMapper()}</Title>
      ) : (
        <HeaderContainer>
          <DateNavigation>
            <NavButton onClick={() => handleDateChange("prev")}>&lt;</NavButton>
            <CurrentDate>{currentDate.format("YYYY-MM-DD")}</CurrentDate>
            <NavButton onClick={() => handleDateChange("next")}>&gt;</NavButton>
            <CalendarButton onClick={handleCalendarClick}>📅</CalendarButton>
          </DateNavigation>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </HeaderContainer>
      )}
    </>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #4a90e2;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 5px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  transition: background-color 0.3s;
  border-radius: 50%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
`;

const Title = styled.h1`
  color: #333333;
  display: flex;
  justify-content: center;
`;

const CurrentDate = styled.span`
  font-size: 18px;
  margin: 0 15px;
  font-weight: bold;
`;

const CalendarButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const LogoutButton = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default Header;
