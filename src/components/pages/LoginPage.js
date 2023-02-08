import styled from "styled-components";
import palette from "../../lib/styles/palette";
import {Link} from "react-router-dom";
import Google from "../social/Google";
import Naver from "../social/Naver";
import Kakao from "../social/Kakao";

/* 화면 전체를 채움 */
const LoginPageBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: ${palette.gray[2]};
  /* flex로 내부 내용 중앙 정렬 */
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
      width: 300px;
      height: 70px;
    }
  }
  
`;

const LoginPage = () => {
  return (
    <LoginPageBlock>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/"><h2>QUIZ APP</h2></Link>
        </div>
        <h3>다음 계정으로 로그인</h3>
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