import styled from "styled-components";
import palette from "../../lib/styles/palette";
import {Link, useLocation} from "react-router-dom";
import Google from "../../components/social/Google";
import Naver from "../../components/social/Naver";
import Kakao from "../../components/social/Kakao";
import Swal from "sweetalert2";
import '../../lib/styles/swal.css';

const LoginPageBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .title {
    text-align: center;
    color: ${palette.gray[8]};
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 2.5rem;
  }
`;

/* 흰색 박스 */
const WhiteBox = styled.div`

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 480px;
  background: white;
  border-radius: 2px;

  @media (max-width: 420px) {
    width: 100%;
  }

  .logo-area {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 4rem;
  }

  .img-area {

    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 1rem;

    img {
      width: 100%;
      object-fit: cover;
      margin-bottom: 1rem;
    }
  }
`;

const LoginPage = () => {

  let error = undefined;
  const location = useLocation();

  // 이전 페이지가 있으면, localStorage에 저장 (Social Login 후, 이동할 페이지)
  // 소셜 로그인은 외부 API와 연동된 후 리다이렉트로 이동되므로, 이전 페이지 정보를 로컬 스토리지에 저장해둔다.
  if (location.state?.from) {
    localStorage.setItem('from', location.state.from);
  }

  if (location.state && location.state.error) {
    error = location.state.error;
    // 페이지 새로고침 시, state 값 제거
    window.history.replaceState({}, document.title);
    Swal.fire({
      icon: 'warning',
      position: 'center',
      title: error
    });
  }

  return (
    <LoginPageBlock>
      <WhiteBox>
        <div className="logo-area">
          <Link to="/"><h2>Quiz Moa</h2></Link>
        </div>
        <div className="title">
          SNS 로그인 / 회원가입
        </div>
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