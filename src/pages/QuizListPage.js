import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuizzes} from "../lib/api/quiz";
import Responsive from "../components/common/Responsive";
import Button from "../components/common/Button";
import {useNavigate, useSearchParams} from "react-router-dom";
import Swal from "sweetalert2";
import getLoginUser from "../lib/utils/getLoginUser";
import Header from "../components/common/Header";
import QuizItem from "../components/quiz/QuizItem";
import Spinner from "../components/common/Spinner";
import palette from "../lib/styles/palette";
import {SortType} from "../global/SortType";
import {SortingButtonStyle} from "../lib/styles/CommonCss";
import calculatePage from "../lib/utils/calculatePage";
import {getCurrentPage} from "../lib/utils/getCurrentPage";

const QuizListBlock = styled(Responsive)`
  height: 1020px;
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  
  .buttons {
    display: flex;
    justify-content: left;
    margin-top: 1rem;
    margin-bottom: 1rem;

    @media (max-width: 1200px) {
      margin-left: 0.75rem;
    }
  }

  @media (max-height: 1020px) {
    height: 920px;
  }
`;

const StyledButton = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 8rem;

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

const QuizListPage = () => {

  console.log('QuizListPage Rendering...');

  const [quizzes, setQuizzes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const sortType = {
    latest: 'createdAt,desc',
    answers: 'answerCount,desc',
    totalVotesSum: 'totalVotesSum,desc',
  }

  // Default: 최신순
  const [sort, setSort] = useState(() => {
    let defaultSort = localStorage.getItem('sort');
    // 만약, 사용자가 악의적으로 LocalStorage의 Sort를 변경하여 Sort Type에 없는 값이 들어가는 경우에는 기본값인 최신순으로 설정한다.
    if (Object.values(sortType).filter(value => value === defaultSort).length === 0) {
      defaultSort = sortType.latest;
      localStorage.setItem('sort', defaultSort);
    }
    return defaultSort;
  });

  // 한 화면에 보여지는 페이지 개수
  const pageSize = 5;

  // 한 페이지당 컨텐츠 사이즈
  const contentsCountPerPage = 7;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setUser(getLoginUser());
  }, []);

  useEffect(() => {
    const fetchQuizzes = async (page, size, sort) => {
      try {
        setLoading(true);
        const response = await getQuizzes({
          page: curPage,
          size: size,
          sort: sort
        });
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

    // 서버 스펙 상, page 0부터 시작
    const tempCurPage = getCurrentPage(searchParams.get('page'));
    const curPage = tempCurPage - 1 < 0 ? 0 : tempCurPage - 1;
    fetchQuizzes(curPage, contentsCountPerPage, sort);

  }, [searchParams, sort]);

  if (loading) {
    return <Spinner/>
  }

  if (!quizzes) {
    return null;
  }

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

  const onLogout = () => {
    setUser(null);
  }

  const onSort = (sort) => {
    setSort(sort);
    // 페이지가 이동되더라도, 정렬 방식은 유지되도록 하기 위해 localStorage 에 저장한다.
    localStorage.setItem('sort', sort);
  }

  const onQuizDetails = (id) => {
    navigate(`/quizzes/${id}`);
  }

  const activeSortingButtonCss = {
    color: palette.gray[8],
    borderBottom: '2px solid #212529'
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='buttons'>
          <SortingButtonStyle onClick={() => onSort(SortType.LATEST)}
                     style={(sort === SortType.LATEST) ? activeSortingButtonCss : null}>
            최신 순
          </SortingButtonStyle>
          <SortingButtonStyle onClick={() => onSort(SortType.TOTAL_VOTES_SUM)}
                     style={(sort === SortType.TOTAL_VOTES_SUM) ? activeSortingButtonCss : null}>
            추천 순
          </SortingButtonStyle>
          <SortingButtonStyle onClick={() => onSort(SortType.ANSWERS)}
                     style={(sort === SortType.ANSWERS) ? activeSortingButtonCss : null}>
            답변 순
          </SortingButtonStyle>
        </div>
        {quizzes.map((quiz, index) => (
          <QuizItem key={index}
                    onClick={() => {
                      onQuizDetails(quiz.id)
                    }}
                    id={quiz.id}
                    title={quiz.title}
                    answerCount={quiz.answerCount}
                    author={quiz.author}
                    votes={quiz.totalVotesSum}
                    modifiedAt={new Date(quiz.modifiedAt).toLocaleString().slice(0, -3)}
          />
        ))}
      </QuizListBlock>
      <Responsive>
        <Footer>
          <div className='page'>
            {calculatePage(totalPages, pageSize, getCurrentPage(searchParams.get('page')))}
          </div>
          <div className='post'>
            <StyledButton cyan onClick={goPost}>
              퀴즈 작성
            </StyledButton>
          </div>
        </Footer>
      </Responsive>
    </>
  );
}

export default QuizListPage;