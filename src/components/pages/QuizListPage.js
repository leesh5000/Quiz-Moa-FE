import Header from "../common/Header";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuizzes} from "../../lib/api/quiz";
import QuizItem from "../quiz/QuizItem";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Spinner from "../common/Spinner";
import Footer from "../common/Footer";
import Swal from "sweetalert2";

const QuizListBlock = styled(Responsive)`
  
  box-sizing: border-box;
  background: aqua;
  
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  
  height: 1096px;

  @media (max-height: 1080px) {
    height: 720px;
  }
  
  overflow: scroll;
  
`;

const PageBlock = styled(Responsive)`

  position: fixed;
  bottom: 0;
  height: 3rem;
  background-color: coral;

  @media (max-height: 1024px) {
    height: 2.5rem;
  }

  @media (max-height: 768px) {
    height: 2.5rem;
  }

  .page {
    position: absolute;
    left: 50%;
    bottom: 50%;
    transform: translate(-50%, 50%);
    
    display: flex;
    justify-content: space-between;
    
    .child {
      color: blueviolet;
      font-size: 1.325rem;
      font-weight: 700;
      padding-left: 1rem;

      @media (max-width: 420px) {
        font-size: 1.125rem;
      }
    }
  }

  .post-button {
    position: absolute;
    bottom: 50%;
    right: 0;
    transform: translate(0%, 50%);
  }
`;

const StyledButton = styled(Button)`
  height: 2.5rem;
  font-size: 1.15rem;
  font-weight: bold;
  padding: 0.35rem 0.65rem;

  @media (max-width: 420px) {
    height: 2rem;
    font-size: 1.15rem;
    font-weight: bold;
    padding: 0.35rem 0.65rem;
  }
`;

const QuizListPage = () => {

  console.log('QuizListPage Rendering...');

  const [quizzes, setQuizzes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // 한 화면에 보여지는 페이지 개수
  const pageSize = 5;

  // 한 페이지당 컨텐츠 사이즈
  const contentsCountPerPage = 10;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getCurrentPage = () => {
    const page = searchParams.get('page');
    return (page === undefined || page === null) ? 1 : page;
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        // 서버 스펙 상, page 0부터 시작
        const curPage = getCurrentPage() - 1;

        const response = await getQuizzes({page: curPage, size: contentsCountPerPage});
        setQuizzes(response.content);
        setTotalPages(response.totalPages);

      } catch (e) {
        console.log('get quizzes error', e);
        await Swal.fire({
          icon: 'warning',
          title: '퀴즈 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
      }
      setLoading(false);
    };

    fetchQuizzes();

  }, [searchParams]);

  const calculatePageNumber = () => {
    const arr = [];
    const curPage = Number(getCurrentPage());

    // 한 화면에 보여지는 페이지 개수가 전체 페이지 수보다 클 경우에는 1부터 마지막 페이지까지 보여주고 리턴한다.
    if (totalPages <= pageSize) {
      for (let i = 1; i <= totalPages; i++) {
        arr.push(i);
      }
    } else {
      // 현재 페이지가 전체 페이지 수의 반 이하일 경우에는 1부터 pageSize까지의 페이지를 보여준다.
      if (curPage <= Math.round(pageSize / 2)) {
        for (let i = 1; i <= pageSize; i++) {
          arr.push(i);
        }
      } else {
        // 현재 페이지가 전체 페이지 수의 반을 넘을 경우에는 현재 페이지가 가운데가 오도록 보여져야 한다.
        // 즉, 현재 페이지가 6이고, 페이지 사이즈가 5일 경우에는 4 5 6 7 8 이런 식으로 보여져야 한다.
        const halfOfPageSize = Math.round(pageSize / 2) - 1;
        let temp = halfOfPageSize;
        while (temp > 0) {
          arr.push(curPage - temp);
          temp--;
        }
        arr.push(curPage);
        temp = 1;
        while (temp <= halfOfPageSize) {
          let nextPage = curPage + temp;

          // 마지막 페이지라면, 더 이상 진행하지 않고 종료한다.
          if (nextPage === totalPages) {
            break;
          }
          arr.push(nextPage);
          temp++;
        }
      }
    }

    return (
      arr.map((value, index) => (
        <Link className="child"
              style={value === curPage ? {color: 'red'} : {color: 'blueviolet'}}
              key={index}
              to={'?page=' + value}>
          {value}
        </Link>
      ))
    );
  };

  if (loading) {
    return <Spinner/>
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
                    id={quiz.id}
                    title={quiz.title}
                    answerCount={quiz.answerCount}
                    author={quiz.author}
                    votes={quiz.votes}
                    modifiedAt={new Date(quiz.modifiedAt).toLocaleString('ko-KR', {
                      hour12: false,
                    }).slice(0, -3)}
          />
        ))}
      </QuizListBlock>
      <Footer>
        <PageBlock>
          <div className="spacer"></div>
          <div className="page">
            {calculatePageNumber()}
          </div>
          <div className="post-button">
            <StyledButton cyan onClick={goPost}>
              퀴즈 작성
            </StyledButton>
          </div>
        </PageBlock>
      </Footer>
    </>
  );
}

export default QuizListPage;