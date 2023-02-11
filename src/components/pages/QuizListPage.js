import Header from "../common/Header";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuizzes} from "../../lib/api/quiz";
import QuizItem from "../QuizItem";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import {useNavigate} from "react-router-dom";

const QuizListBlock = styled(Responsive)`
  
  box-sizing: border-box;
  //margin: 1.5rem auto;
  background: aqua;
  
  display: flex;
  flex-direction: column;

`;

const PageBlock = styled(Responsive)`
  
  height: 3rem;
  background-color: coral;
  
  .page {
    margin-top: 1rem;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }
  
  .post {
    margin-top: 1rem;
    float: right;
  }
`;

const QuizListPage = () => {

  console.log('QuizListPage Rendering...');

  const [quizzes, setQuizzes] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getQuizzes({page: 0, size: 7});
        setQuizzes(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    fetchQuizzes().then();

  }, []);

  if (loading) {
    return <QuizListBlock>로딩중...</QuizListBlock>
  }

  if (!quizzes) {
    return null;
  }

  const goPost = () => {
    // 로그인 한 유저인지 검증
    if (!localStorage.getItem('user')) {
      navigate('/login');
    } else {
      navigate('/post');
    }
  }

  return (
    <>
      <Header>
      </Header>
      <QuizListBlock>
        {quizzes.map((quiz, index) => (
          <QuizItem key={index}
                    title={quiz.title}
                    answerCount={quiz.answerCount}
                    author={quiz.author}
                    votes={quiz.votes}
                    modifiedAt={quiz.modifiedAt}
          />
        ))}
      </QuizListBlock>
      <PageBlock>
        <div className="page">페이지 정보</div>
        <div className="post">
          <Button cyan onClick={goPost}>
            퀴즈 작성
          </Button>
        </div>
      </PageBlock>
    </>
  );
}

export default QuizListPage;