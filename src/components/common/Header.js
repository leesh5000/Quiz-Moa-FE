import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {logout} from "../../lib/api/auth";
import Responsive from "./Responsive";
import Button from "./Button";

const HeaderBlock = styled(Responsive)`

  position: fixed;
  top: 0;
  height: 4rem;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  
  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 2px;
    @media (max-width: 1024px) {
      margin-left: 0.25rem;
    }
  }
  
  .right {
    display: flex;
    align-items: center;
  }
`;

const UserBlock = styled.div`
  font-weight: 800;
  margin-right: 0.25rem;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Spacer = styled.div`
  height: 4rem;
`;

const StyledButton = styled(Button)`
  margin-left: 0.5rem;
  @media (max-width: 1024px) {
    margin-right: 0.25rem;
  }
`

const Header = () => {

  console.log('Header Rendering...');

  const [user, setUser] = useState(null);
  const state = useLocation().state;

  useEffect(() => {
    if (state && state.success) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  const onLogout = () => {
    logout();
    setUser(null);
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
              <StyledButton onClick={onLogout}>
                로그아웃
              </StyledButton>
            </div>
            ) : (
              <div className="right">
                <StyledButton to="/login">
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
