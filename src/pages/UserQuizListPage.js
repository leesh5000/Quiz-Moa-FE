import Header from "../components/common/Header";
import styled from "styled-components";
import {useEffect, useState} from "react";
import QuizItem from "../components/quiz/QuizItem";
import Responsive from "../components/common/Responsive";
import Button from "../components/common/Button";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Spinner from "../components/common/Spinner";
import Swal from "sweetalert2";
import palette from "../lib/styles/palette";
import {getProfile, getUserQuizzes} from "../lib/api/user";

const QuizListBlock = styled(Responsive)`
  
  box-sizing: border-box;
  background: aqua;
  
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  
  .buttons {
    display: flex;
    justify-content: right;
    background-color: dodgerblue;
  }

`;

const SortingButton = styled(Button)`
  margin-left: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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

const Footer = styled(Responsive)`
  height: 12rem;
  background-color: gray;
  
  .page {
    font-size: 1.325rem;
    font-weight: 700;
    background-color: dodgerblue;
    text-align: center;
    
    .child {
      color: blueviolet;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
  
  .post {
    text-align: right;
    
    @media (max-width: 1024px) {
      margin-right: 0.5rem;
    }
  }
`;

const UserQuizListPage = ({user, onLogout}) => {

  console.log('QuizListPage Rendering...');

  const [quizzes, setQuizzes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = useParams().email;
  const [profile, setProfile] = useState(null);

  const sortType = {
    latest: 'createdAt,desc',
    answers: 'answerCount,desc',
    totalVotes: 'totalVotes,desc',
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
  const contentsCountPerPage = 5;

  const getCurrentPage = () => {
    const page = searchParams.get('page');
    return (page === undefined || page === null) ? 1 : page;
  }

  useEffect(() => {

    const fetchUserQuizzes = async (page, size, sort) => {
      try {
        setLoading(true);
        // 매번 Profile API, Quiz API를 호출하지 말고, 페이지가 새로고침되어 Profile이 없는 경우에만 Profile API를 호출한다.
        let tempProfile = profile;
        if (!tempProfile) {
          tempProfile = await getProfile(email);
          setProfile(tempProfile);
        }
        const response = await getUserQuizzes(tempProfile.id, {
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
        navigate(-1, {
          replace: true,
        })
      }
      setLoading(false);
    };

    // 서버 스펙 상, page 0부터 시작
    const curPage = getCurrentPage() - 1 < 0 ? 0 : getCurrentPage() - 1;
    fetchUserQuizzes(curPage, contentsCountPerPage, sort);

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

  const onSort = (sort) => {
    setSort(sort);
    // 페이지가 이동되더라도, 정렬 방식은 유지되도록 하기 위해 localStorage 에 저장한다.
    localStorage.setItem('sort', sort);
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='title'>
          <h1>{profile.username}의 퀴즈</h1>
        </div>
        <div className='buttons'>
          <SortingButton onClick={() => onSort(sortType.latest)}
                         style={sort === sortType.latest ? {background: palette.gray[6]} : {background: palette.gray[8]}}>
            최신 순
          </SortingButton>
          <SortingButton onClick={() => onSort(sortType.totalVotes)}
                         style={sort === sortType.totalVotes ? {background: palette.gray[6]} : {background: palette.gray[8]}}>
            추천 순
          </SortingButton>
          <SortingButton onClick={() => onSort(sortType.answers)}
                         style={sort === sortType.answers ? {background: palette.gray[6]} : {background: palette.gray[8]}}>
            답변 순
          </SortingButton>
        </div>
        {quizzes.map((quiz, index) => (
          <QuizItem key={index}
                    id={quiz.id}
                    title={quiz.title}
                    answerCount={quiz.answerCount}
                    author={quiz.author}
                    votes={quiz.totalVotes}
                    modifiedAt={new Date(quiz.modifiedAt).toLocaleString().slice(0, -3)}
          />
        ))}
      </QuizListBlock>
      <Footer>
        <div className='page'>
          {calculatePageNumber()}
        </div>
      </Footer>
    </>
  );
}

export default UserQuizListPage;