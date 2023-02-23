import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {getProfile, getUserAnswers} from "../../lib/api/user";
import Spinner from "../../components/common/Spinner";
import Header from "../../components/common/Header";
import palette from "../../lib/styles/palette";
import styled from "styled-components";
import Responsive from "../../components/common/Responsive";
import UserAnswerItem from "../../components/answer/UserAnswerItem";
import Swal from "sweetalert2";
import {SortType} from "../../global/SortType";
import SortingButton from "../../components/common/SortingButton";
import useSort from "../../lib/utils/useSort";
import Footer from "../../components/common/Footer";

const QuizListBlock = styled(Responsive)`

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  height: 1050px;

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

const UserAnswerListPage = ({user, onLogout}) => {

  console.log('QuizListPage Rendering...');

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = useParams().email;
  const [profile, setProfile] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [sort, setSort] = useSort();

  // 한 화면에 보여지는 페이지 개수
  const pageSize = 5;

  // 한 페이지당 컨텐츠 사이즈
  const contentsCountPerPage = 7;

  const getCurrentPage = () => {
    const page = searchParams.get('page');
    return (page === undefined || page === null) ? 1 : page;
  }

  useEffect(() => {
    const fetchUserAnswers = async (page, size, sort) => {
      try {
        setLoading(true);
        // 매번 Profile API, Quiz API를 호출하지 말고, 페이지가 새로고침되어 Profile이 없는 경우에만 Profile API를 호출한다.
        let tempProfile = profile;
        if (!tempProfile) {
          tempProfile = await getProfile(email);
          setProfile(tempProfile);
        }
        const response = await getUserAnswers(tempProfile.id, {
          page: curPage,
          size: size,
          sort: sort
        });
        setAnswers(response.content);
        setTotalPages(response.totalPages);
      } catch (e) {
        console.log('get quizzes error', e);
        await Swal.fire({
          icon: 'warning',
          title: '답변 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
        navigate(-1, {
          replace: true,
        })
      } finally {
        setLoading(false);
      }
    }

    // 서버 스펙 상, page 0부터 시작
    const curPage = getCurrentPage() - 1 < 0 ? 0 : getCurrentPage() - 1;
    fetchUserAnswers(curPage, contentsCountPerPage, sort);

  }, [searchParams, sort]);

  if (loading) {
    return <Spinner/>
  }

  if (!answers || !profile) {
    return null;
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='author-title'>
          <h1>{profile.username}의 답변</h1>
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
        </div>
        {answers.map((answer, index) => (
          <UserAnswerItem key={index}
                          id={answer.id}
                          onClick={
                            () => navigate(`/quizzes/${answer.quizId}`)
                          }
                          title={answer.title}
                          quizId={answer.quizId}
                          contents={answer.contents}
                          author={answer.author}
                          votes={answer.totalVotesSum}
                          modifiedAt={new Date(answer.modifiedAt).toLocaleString().slice(0, -3)}
          />
        ))}
      </QuizListBlock>
      <Footer totalPages={totalPages}
              pageSize={pageSize}
              user={user}
      />
    </>
  );
}

export default UserAnswerListPage;