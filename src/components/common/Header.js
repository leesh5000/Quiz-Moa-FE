import styled from "styled-components";
import React from "react";
import {Link, useLocation} from "react-router-dom";
import {logout} from "../../lib/api/auth";
import Responsive from "./Responsive";
import Button from "./Button";

const HeaderBlock = styled(Responsive)`

  position: fixed;
  top: 0;
  height: 7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  z-index: 10;

  @media (max-height: 1024px) {
    height: 5.75rem;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: brown;

  .logo {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 2px;

    @media (max-width: 1024px) {
      font-size: 1.5rem;
      margin-left: 0.5rem;
    }

  }

  .right {
    display: flex;
    align-items: center;
  }
`;

const UserBlock = styled.div`
  font-weight: 800;
  margin-right: 0.75rem;
  @media (max-width: 760px) {
    display: none;
  }
`;

const Spacer = styled.div`
  height: 8.75rem;

  @media (max-height: 1080px) {
    height: 6.25rem;
  }

  background-color: coral;
`;

const StyledButton = styled(Button)`
  margin-right: 0.75rem;
`

const Header = ({user, onLogout}) => {

  console.log('Header Rendering...');

  const location = useLocation();

  const onLogoutWrapper = () => {
    logout()
    onLogout();
  }

  return (
    <>
      <Responsive>
        <HeaderBlock>
          <Link to="/" className="logo">QUIZ APP</Link>
          {user ? (
            <div className="right">
              <UserBlock>{user.email}</UserBlock>
              <StyledButton>
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
        </HeaderBlock>
      </Responsive>
      <Spacer/>
    </>
  );
}

export default Header;
