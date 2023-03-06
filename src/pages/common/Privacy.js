import styled from "styled-components";

const PrivacyBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WhiteBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 620px;
  background: white;
  border-radius: 2px;
  
  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
  }

  @media (max-width: 420px) {
    width: 100%;
  }
`;

const Privacy = () => {
  return (
    <PrivacyBlock>
      <WhiteBox>
        <p className='title'>
          개인정보 처리방침
        </p>
        <p>
          Quiz Moa(<a href='https://www.quiz-moa.com'>https://www.quiz-moa.com</a>이하 'Quiz Moa')은(는) 「개인정보 보호법」 제30조에 따라
          정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          <br/>
          ○ 이 개인정보처리방침은 2023년 3월 1부터 적용됩니다.
        </p>
        <p>
          <b>제1조(개인정보의 처리 목적)</b>
        </p>
        <p>
          Quiz Moa(<a href='https://www.quiz-moa.com'>https://www.quiz-moa.com</a>이하 'Quiz Moa')은(는) 다음의 목적을 위하여 개인정보를
          처리합니다.
        </p>
        <p>
          1. 홈페이지 회원가입 및 관리
          <p>
            - 회원 가입의사 확인 목적으로 개인정보를 처리합니다.
          </p>
          <p>
            - 수집항목 : 이메일
          </p>
        </p>
        <p>
          <b>제2조(개인정보의 처리 및 보유 기간)</b>
        </p>
        <p>
          Quiz Moa은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <p>
          1. 홈페이지 회원가입 및 관리
          <p>
            홈페이지 회원가입 및 관리와 관련한 개인정보는 수집.이용에 관한 동의일로부터 지체없이 파기까지 위 이용목적을 위하여 보유.이용됩니다.
          </p>
        </p>
      </WhiteBox>
    </PrivacyBlock>
  );
}

export default Privacy;