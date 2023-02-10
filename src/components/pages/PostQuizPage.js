import Responsive from "../common/Responsive";
import Editor from "../Editor";
import Button from "../common/Button";
import styled from "styled-components";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {createQuiz} from "../../lib/api/quiz";

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

  console.log("PostQuizPage Rendering...");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const quillElement = useRef(null);
  const quillInstance = useRef(null);
  // 타이틀이 바뀌어도 Re-rendering 되지 않도록 useRef 사용
  let title = useRef(null);

  const onChangeField = ({key, value}) => {
    if (key === 'title') {
      title = value;
    }
  }

  const onPost = () => {
    const body = quillInstance.current.root.innerHTML;

    const postQuiz = async () => {
      try {
        setLoading(true);
        const response = await createQuiz({title, body});
        console.log("response = " + response);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    postQuiz().then();
  }

  const onCancel = () => {
    navigate(-1);
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <>
      <Responsive>
        <Editor onChangeField={onChangeField}
                quillInstance={quillInstance}
                quillElement={quillElement}
        />
        <ButtonBlock>
          <StyledButton onClick={onPost}>작성하기</StyledButton>
          <StyledButton onClick={onCancel}>취소</StyledButton>
        </ButtonBlock>
      </Responsive>
    </>
  );
}

export default PostQuizPage;