import Responsive from "../common/Responsive";
import Editor from "../Editor";
import Button from "../common/Button";
import styled from "styled-components";
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {createQuiz} from "../../lib/api/quiz";
import Spinner from "../common/Spinner";

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
  font-size: 1.15rem;
  padding: 0.35rem 0.85rem;
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

    const contents = quillInstance.current.root.innerHTML;

    const postQuiz = async () => {
      try {
        setLoading(true);
        await createQuiz({title, contents});
      } catch (e) {
        console.log("Create Quiz Failed... = " + e);
        // await swal('퀴즈 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      setLoading(false);
    };

    postQuiz()
      .then(() => {
        navigate('/');
      });

  }

  const onCancel = () => {
    navigate(-1);
  }

  if (loading) {
    return <Spinner/>
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