import styled from "styled-components";
import {useEffect, useState} from "react";
import {getQuizzes} from "../../lib/api/quiz";
import Responsive from "../../components/common/Responsive";
import Button from "../../components/common/Button";
import {useNavigate, useSearchParams} from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/common/Header";
import QuizItem from "../../components/quiz/QuizItem";
import Spinner from "../../components/common/Spinner";
import {SortType} from "../../global/SortType";
import {getCurrentPage} from "../../lib/utils/getCurrentPage";
import SortingButton from "../../components/common/SortingButton";
import useSort from "../../lib/utils/useSort";
import {useLoginUser} from "../../lib/utils/useLoginUser";
import Footer from "../../components/common/Footer";

const QuizListBlock = styled(Responsive)`
  display: flex;
  flex-direction: column;
  padding-bottom: 3rem;
  height: 1100px;
  
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

const StyledButton = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

// const Footer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   height: 8rem;
//
//   @media (max-width: 1200px) {
//     height: 4rem;
//     margin-left: 1rem;
//     margin-right: 1rem;
//   }
//
//   .page {
//     font-size: 1.125rem;
//     font-weight: 600;
//     color: ${palette.gray[7]};
//
//     .child {
//       border-radius: 4px;
//       outline: 1px solid ${palette.gray[4]};
//       padding: 0.45rem;
//       margin-left: 0.5rem;
//       margin-right: 0.5rem;
//     }
//   }
// `;

const QuizListPage = () => {

  console.log('QuizListPage Rendering...');

  const [quizzes, setQuizzes] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useLoginUser();
  const [sort, setSort] = useSort();

  // 한 화면에 보여지는 페이지 개수
  const pageSize = 5;

  // 한 페이지당 컨텐츠 사이즈
  const contentsCountPerPage = 7;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  const onLogout = () => {
    setUser(null);
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <QuizListBlock>
        <div className='buttons'>
          <SortingButton sortType={SortType.LATEST}
                         setSort={setSort}
                         sort={sort}
                         description={'최신 순'}>
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
      <Footer user={user}
              totalPages={totalPages}
              pageSize={pageSize}>
      </Footer>
    </>
  );
}

export default QuizListPage;