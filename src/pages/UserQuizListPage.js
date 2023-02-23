import Header from "../components/common/Header";
import styled from "styled-components";
import {useEffect, useState} from "react";
import QuizItem from "../components/quiz/QuizItem";
import Responsive from "../components/common/Responsive";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import Spinner from "../components/common/Spinner";
import Swal from "sweetalert2";
import palette from "../lib/styles/palette";
import {getProfile, getUserQuizzes} from "../lib/api/user";
import {SortType} from "../global/SortType";
import calculatePage from "../lib/utils/calculatePage";
import Button from "../components/common/Button";
import {getCurrentPage} from "../lib/utils/getCurrentPage";

const QuizListBlock = styled(Responsive)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;

  .author-title {
    font-size: 1rem;
    letter-spacing: 2px;
    color: ${palette.gray[7]};

    @media (max-width: 1200px) {
      margin: 0 1rem;
    }
  }

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

const SortingButtonStyle = styled.button`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${palette.gray[6]};
  border: none;
  cursor: pointer;
  background: none;
  margin-right: 1rem;
  padding-bottom: 0.35rem;
  letter-spacing: 1.25px;
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

const StyledButton = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
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
      } finally {
        setLoading(false);
      }
    };

    // 서버 스펙 상, page 0부터 시작
    const tempCurPage = getCurrentPage(searchParams.get('page'));
    const curPage = tempCurPage - 1 < 0 ? 0 : tempCurPage - 1;
    fetchUserQuizzes(curPage, contentsCountPerPage, sort);

  }, [searchParams, sort]);

  if (loading) {
    return <Spinner/>
  }

  if (!quizzes || !profile) {
    return null;
  }

  const onSort = (sort) => {
    setSort(sort);
    // 페이지가 이동되더라도, 정렬 방식은 유지되도록 하기 위해 localStorage 에 저장한다.
    localStorage.setItem('sort', sort);
  }

  const activeSortingButtonCss = {
    color: palette.gray[8],
    borderBottom: '2px solid #212529'
  }

  const onQuizDetails = (id) => {
    navigate(`/quizzes/${id}`);
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

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='author-title'>
          <h1>{profile.username}의 퀴즈</h1>
        </div>
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

export default UserQuizListPage;