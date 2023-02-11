import styled from "styled-components";
import palette from "../../lib/styles/palette";
import {Link, useLocation} from "react-router-dom";
import Google from "../social/Google";
import Naver from "../social/Naver";
import Kakao from "../social/Kakao";

const LoginPageBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: ${palette.gray[2]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    display: flex;
    justify-content: center;
    color: ${palette.gray[8]};
    margin: 0 0 1rem;
  }
`;

/* 흰색 박스 */
const WhiteBox = styled.div`

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 530px;
  background: white;
  border-radius: 2px;
  
  .logo-area {
    display: block;
    padding-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }
  
  .img-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    
    img {
      margin-top: 1.3rem;
      width: 236px;
      height: 72px;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const LoginPage = () => {

  console.log("LoginPage Rendering...");


  let error = undefined;
  const location = useLocation();

  if (location.state && location.state.error) {
    error = location.state.error;
    // 페이지 새로고침 시, state 값 제거
    window.history.replaceState({}, document.title)
  }

  return (
    <LoginPageBlock>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/"><h2>QUIZ APP</h2></Link>
        </div>
        <h3>소셜 계정으로 로그인</h3>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="img-area">
          <Google/>
          <Naver/>
          <Kakao/>
        </div>
      </WhiteBox>
    </LoginPageBlock>
  );
}

export default LoginPage;