import styled from "styled-components";
import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {logout} from "../../lib/api/auth";
import Responsive from "./Responsive";
import Button from "./Button";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;
`;

const Wrapper = styled(Responsive)`
  
  height: 7rem;

  @media (max-height: 1024px) {
    height: 5.75rem;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 2px;

    @media (max-width: 1024px) {
      font-size: 1.5rem;
      margin-left: 1rem;
    }
  }

  .right {
    display: flex;
    align-items: center;
    
    @media (max-width: 1200px) {
      font-size: 1.5rem;
    }
  }
`;

const UserBlock = styled.div`
  font-weight: 800;
  font-size: 1.125rem;
  margin-right: 2rem;
  letter-spacing: 2px;
  @media (max-width: 760px) {
    display: none;
  }
`;

const StyledButton = styled(Button)`
  margin-right: 1rem;
`;

const Spacer = styled.div`
  height: 8rem;
  
  @media (max-height: 1024px) {
    height: 6rem;
  }
`;

const Header = ({user, onLogout}) => {

  const location = useLocation();
  const navigate = useNavigate();

  const onLogoutWrapper = () => {
    logout()
    onLogout();
  }

  const goProfile = () => {
    // 현재 URL이 내 정보 페이지라면, 아무것도 하지 않음
    if (location.pathname === `/users/${user.id}`) {
      return;
    }

    if (user) {
      navigate(`/users/${user.id}`, {
        state: {
          id: user.id
        }
      });
    }
  }

  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to="/" className="logo">Quiz Moa</Link>
          {user ? (
            <div className="right">
              <UserBlock>{localStorage.getItem('username') ?
                localStorage.getItem('username') : user.username
              }</UserBlock>
              <StyledButton onClick={goProfile}>
                내 정보
              </StyledButton>
              <StyledButton onClick={onLogoutWrapper}>
                로그아웃
              </StyledButton>
            </div>
          ) : (
            <div className="right">
              <StyledButton to='/login'
                            state={{
                              from: location.pathname
                            }}>
                로그인
              </StyledButton>
            </div>
          )
          }
        </Wrapper>
      </HeaderBlock>
      <Spacer/>
    </>
  );
}

export default Header;
