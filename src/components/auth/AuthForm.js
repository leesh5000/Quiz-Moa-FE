import styled from "styled-components";
import palette from "../../lib/styles/palette";

/**
 * 로그인 폼
 */
const AuthFormBlock = styled.div`
  
  h3 {
    color: ${palette.gray[8]};
    margin: 0 0 1rem;
  }
  
`;

/**
 * 스타일링된 input
 */
const StyledInput = styled.input`
  
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;

  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }

  & + & {
    margin-top: 1rem;
  }
`;

/**
 * 폼 하단에 로그인 혹은 회원가입 링크를 보여 줌
 */
const Footer = styled.div` margin-top: 2rem; text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    &:hover {
      color: ${palette.gray[9]};
    }
  }
`;

const AuthForm = () => {
  return (
    <AuthFormBlock>
      <h3>로그인</h3>
    </AuthFormBlock>
  );
};

export default AuthForm;