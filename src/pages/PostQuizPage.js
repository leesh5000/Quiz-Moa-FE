import Responsive from "../components/common/Responsive";
import Editor from "../components/quiz/Editor";
import Button from "../components/common/Button";
import styled from "styled-components";
import {useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {createQuiz, editQuiz} from "../lib/api/quiz";
import Spinner from "../components/common/Spinner";
import Swal from "sweetalert2";
import '../lib/styles/swal.css';
import Header from "../components/common/Header";

const ButtonBlock = styled(Responsive)`

  position: fixed;
  bottom: 0;
  
  @media (max-width: 1024px) {
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

const PostQuizPage = ({user, onLogout}) => {

  console.log("PostQuizPage Rendering...");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const quillElement = useRef(null);
  const quillInstance = useRef(null);
  const location = useLocation();

  let quizId = null;
  let title = '';
  let contents = '';

  // 수정하기를 통해 들어온 경우에는 이전 데이터들을 불러온다.
  if (location.state) {
    quizId = location.state.quizId;
    title = location.state.title;
    contents = location.state.contents;
  }

  const onChangeField = ({key, value}) => {
    if (key === 'title') {
      title = value;
    }
  }

  const onPost = () => {

    const contents = quillInstance.current.root.innerHTML;

    const postQuiz = async () => {

      if (!validate({title, contents})) {
        return false;
      }

      try {
        setLoading(true);
        await createQuiz({title, contents});
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '퀴즈 작성에 실패했습니다. 잠시 후 다시 시도해주세요.'
        })
      }
      setLoading(false);
      return true;
    };

    postQuiz()
      .then((result) => {
        if (result) {
          navigate('/');
        }
      });
  }

  const onEdit = () => {

    const contents = quillInstance.current.root.innerHTML;

    const edit = async () => {

      if (!validate({title, contents})) {
        return false;
      }

      try {
        setLoading(true);
        const userId = user.id;
        await editQuiz({userId, quizId, title, contents});
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '퀴즈 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      setLoading(false);
      return true;
    };

    edit()
      .then((result) => {
        if (result) {
          navigate(-1);
        }
      });
  }

  const onCancel = () => {
    navigate(-1);
  }

  const validate = ({title, contents}) => {

    if (title === '') {
      Swal.fire({
        icon: 'warning',
        position: 'center',
        title: '제목을 입력해주세요.'
      });
      return false;
    }

    if (title.length < 10 || title.length > 255) {
      Swal.fire({
        icon: 'warning',
        position: 'center',
        title: '제목은 10자 이상 255자 이하로 작성해주세요.'
      });
      return false;
    }

    // 본문에 태그가 들어가지 않도록 처리
    contents = contents.replace(/<[^>]*>/g, '');

    if (contents.length < 10) {
      Swal.fire({
        icon: 'warning',
        position: 'center',
        title: '본문은 최소 10자 이상으로 작성해주세요.'
      });
      return false;
    }

    if (contents.length > 65000) {
      Swal.fire({
        icon: 'warning',
        position: 'center',
        title: '본문 내용은 65000자 이하로 작성해주세요.'
      });
      return false;
    }

    return true;
  }

  if (loading) {
    return <Spinner/>
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <Responsive>
        <Editor onChangeField={onChangeField}
                quillInstance={quillInstance}
                quillElement={quillElement}
                title={title}
                contents={contents}
        />
        <ButtonBlock>
          <StyledButton onClick={onCancel}>돌아가기</StyledButton>
          {quizId ?
            (<StyledButton onClick={onEdit}>수정하기</StyledButton>)
            : (<StyledButton onClick={onPost}>작성하기</StyledButton>)}
        </ButtonBlock>
      </Responsive>
    </>
  );
}

export default PostQuizPage;