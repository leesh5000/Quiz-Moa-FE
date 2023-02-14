import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {logout} from "../../lib/api/auth";
import Responsive from "./Responsive";
import Button from "./Button";

const HeaderBlock = styled(Responsive)`

  position: fixed;
  top: 0;
  height: 7rem;

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
  height: 8.75rem;

  @media (max-height: 1080px) {
    height: 6.25rem;
  }

  background-color: coral;
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

  useEffect(() => {

    if (JSON.parse(localStorage.getItem('user')) !== null) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }

  }, []);

  const onLogout = () => {
    logout()
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
