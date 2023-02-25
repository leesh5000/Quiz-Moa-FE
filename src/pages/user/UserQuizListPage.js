import Header from "../../components/common/Header";
import styled from "styled-components";
import {useEffect, useState} from "react";
import QuizItem from "../../components/quiz/QuizItem";
import Responsive from "../../components/common/Responsive";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import Swal from "sweetalert2";
import palette from "../../lib/styles/palette";
import {getProfile, getUserQuizzes} from "../../lib/api/user";
import {SortType} from "../../global/SortType";
import {getCurrentPage} from "../../lib/utils/getCurrentPage";
import SortingButton from "../../components/common/SortingButton";
import useSort from "../../lib/utils/useSort";
import Footer from "../../components/common/Footer";

const QuizListBlock = styled(Responsive)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  height: 1100px;

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
`;


const UserQuizListPage = ({user, onLogout}) => {

  const [quizzes, setQuizzes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = Number(useParams().id);
  const [profile, setProfile] = useState(null);
  const [sort, setSort] = useSort();

  // 한 화면에 보여지는 페이지 개수
  const pageSize = 5;

  // 한 페이지당 컨텐츠 사이즈
  const contentsCountPerPage = 6;

  useEffect(() => {

    const fetchUserQuizzes = async (page, size, sort) => {
      try {
        setLoading(true);
        // 매번 Profile API, Quiz API를 호출하지 말고, 페이지가 새로고침되어 Profile이 없는 경우에만 Profile API를 호출한다.
        let tempProfile = profile;
        if (!tempProfile) {
          tempProfile = await getProfile(userId);
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

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='author-title'>
          {profile.id === user.id ? <h1>내 퀴즈</h1> : <h1>{profile.username}의 퀴즈</h1>}
        </div>
        <div className='buttons'>
          <SortingButton sortType={SortType.LATEST}
                         setSort={setSort}
                         sort={sort}
                         description={'최신순'}>
          </SortingButton>
          <SortingButton sortType={SortType.TOTAL_VOTES_SUM}
                         setSort={setSort}
                         sort={sort}
                         description={'추천 순'}>
          </SortingButton>
          <SortingButton sortType={SortType.ANSWERS}
                         setSort={setSort}
                         sort={sort}
                         description={'답변 순'}>
          </SortingButton>
        </div>
        {quizzes.map((quiz, index) => (
          <QuizItem key={index}
                    onClick={() => {
                      navigate(`/quizzes/${quiz.id}`);
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
      <Footer totalPages={totalPages}
              pageSize={pageSize}
              user={user}>
      </Footer>
    </>
  );
}

export default UserQuizListPage;