import Responsive from "./Responsive";
import styled from "styled-components";
import palette from "../../lib/styles/palette";
import calculatePage from "../../lib/utils/calculatePage";
import {getCurrentPage} from "../../lib/utils/getCurrentPage";
import Button from "./Button";
import Swal from "sweetalert2";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

const FooterStyle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 4rem;

  @media (max-width: 1200px) {
    height: 4rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .page {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${palette.gray[7]};
    
    .child {
      border-radius: 4px;
      outline: 1px solid ${palette.gray[4]};
      padding: 0.45rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
`;

const StyledButton = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

const PrivacyBlock = styled(Link)`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${palette.gray[7]};
  display: flex;
  justify-content: center;
  height: 4rem;
`;

const Footer = ({user, totalPages, pageSize}) => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const goPost = () => {
    // HOC에서 로그인 유저 검증
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: '로그인 후 이용 가능합니다.',
      });
      return;
    }
    navigate('/post');
  }

  return (
    <>
      <Responsive>
        <FooterStyle>
          <div className='page'>
            {calculatePage(totalPages, pageSize, getCurrentPage(searchParams.get('page')))}
          </div>
          <div className='post'>
            <StyledButton cyan onClick={goPost}>
              퀴즈 작성
            </StyledButton>
          </div>
        </FooterStyle>
        <PrivacyBlock to='/privacy'>
          개인정보 처리방침
        </PrivacyBlock>
      </Responsive>
    </>
  );
}

export default Footer;