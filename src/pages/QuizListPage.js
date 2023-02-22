import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuizzes} from "../lib/api/quiz";
import Responsive from "../components/common/Responsive";
import Button from "../components/common/Button";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Swal from "sweetalert2";
import getLoginUser from "../lib/utils/getLoginUser";
import Header from "../components/common/Header";
import QuizItem from "../components/quiz/QuizItem";
import Spinner from "../components/common/Spinner";
import palette from "../lib/styles/palette";

const QuizListBlock = styled(Responsive)`
  
  box-sizing: border-box;
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
      margin-left: 0.5rem;
    }
  }

  @media (max-height: 1020px) {
    height: 920px;
  }

`;

const SortingButton = styled.button`

  font-size: 1.25rem;
  font-weight: 700;
  color: ${palette.gray[6]};
  border: none;
  cursor: pointer;
  background: none;
  margin-right: 1rem;
  padding-bottom: 0.35rem;
  letter-spacing: 2px;
`;

const StyledButton = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

const Footer = styled(Responsive)`
  
  display: flex;
  justify-content: space-between;
  height: 8rem;

  @media (max-width: 1200px) {
    margin-left: 0.5rem;
    height: 4rem
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
  
  .post {
    @media (max-width: 1024px) {
      margin-right: 1.5rem;
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

  const getCurrentPage = () => {
    const page = searchParams.get('page');
    return (page === undefined || page === null) ? 1 : page;
  }

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
    const curPage = getCurrentPage() - 1 < 0 ? 0 : getCurrentPage() - 1;
    fetchQuizzes(curPage, contentsCountPerPage, sort);

  }, [searchParams, sort]);

  const calculatePageNumber = () => {
    const arr = [];
    const curPage = Number(getCurrentPage()) < 0 ? 1 : Number(getCurrentPage());

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
              style={value === curPage ? {backgroundColor: '#c5f6fa'} : null}
              key={index}
              to={`?page=${value}`}>
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

  const activeSortingButton = {
    color: palette.gray[8],
    borderBottom: '2px solid #212529'
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='buttons'>
          <SortingButton onClick={() => onSort(sortType.latest)}
                         style={(sort === sortType.latest) ? activeSortingButton : null}>
            최신 순
          </SortingButton>
          <SortingButton onClick={() => onSort(sortType.totalVotesSum)}
            style={(sort === sortType.totalVotesSum) ? activeSortingButton : null}>
            추천 순
          </SortingButton>
          <SortingButton onClick={() => onSort(sortType.answers)}
                         style={(sort === sortType.answers) ? activeSortingButton : null}>
            답변 순
          </SortingButton>
        </div>
        {quizzes.map((quiz, index) => (
          <QuizItem key={index}
                    id={quiz.id}
                    title={quiz.title}
                    answerCount={quiz.answerCount}
                    author={quiz.author}
                    votes={quiz.totalVotesSum}
                    modifiedAt={new Date(quiz.modifiedAt).toLocaleString().slice(0, -3)}
          />
        ))}
      </QuizListBlock>
      <Footer>
        <div className='page'>
          {calculatePageNumber()}
        </div>
        <div className='post'>
          <StyledButton cyan onClick={goPost}>
            퀴즈 작성
          </StyledButton>
        </div>
      </Footer>
    </>
  );
}

export default QuizListPage;