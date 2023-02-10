import Responsive from "../common/Responsive";
import Editor from "../Editor";
import Button from "../common/Button";
import styled from "styled-components";

const ButtonBlock = styled.div`

  @media (max-width: 1024px) {
    position: fixed;
    bottom: 0;
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
  
  height: 4rem;
  background-color: coral;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  
  height: 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.15rem;
  font-weight: bold;
  padding: 0.35rem 0.85rem;
  color: white;
  outline: none;
  cursor: pointer;
  
  // & 는 현재 요소
  margin-left: 0.75rem;
  margin-right: 0.75rem;
`;

const PostQuizPage = () => {

  const onPost = () => {

  }

  const onCancel = () => {

  }

  return (
    <>
      <Responsive>
        <Editor/>
        <ButtonBlock>
          <StyledButton onClick={onPost}>작성하기</StyledButton>
          <StyledButton onClick={onCancel}>취소</StyledButton>
        </ButtonBlock>
      </Responsive>
    </>
  );
}

export default PostQuizPage;