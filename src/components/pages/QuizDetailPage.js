import Header from "../common/Header";
import {useEffect, useRef, useState} from "react";
import {getQuizDetails} from "../../lib/api/quiz";
import {useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../common/Spinner";
import Responsive from "../common/Responsive";
import styled from "styled-components";
import Button from "../common/Button";
import VoteModal from "../common/VoteModal";
import palette from "../../lib/styles/palette";

const QuizTitleStyle = styled.div`
  
  margin-top: 1.725rem;
  height: 4.625rem;
  background-color: blueviolet;
  
  display: flex;
  justify-content: left;
  align-items: center;
  
  .title {
    margin-left: 1.5rem;
    font-size: 2rem;
    font-weight: 600;
  }
  
  .vote {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-size: 1.5rem;
    
    .count {
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
    }
    
  }
  
`;

const QuizDetailPage = () => {

  console.log('QuizDetailPage rendering...');

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const id = useParams().id;

  const navigate = useNavigate();

  const [onModal, setOnModal] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {

      try {
        setLoading(true);
        const response = await getQuizDetails(id);
        setQuiz(response);
        console.log(response);
      } catch (e) {
        console.log(e);
        await Swal.fire({
          icon: 'warning',
          title: '퀴즈 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
        navigate('/quizzes');
      }

      setLoading(false);
    }

    fetchQuizDetails();

  }, []);

  if (loading) {
    return <Spinner/>
  }

  if (!quiz) {
    return null;
  }

  return (
    <>
      <Header/>
      <Responsive>
        <QuizTitleStyle>
          <div className='vote'>
            <div className='button'
                 onClick={() => console.log('upvote')}>
              ▲
            </div>
            <div className='count'>
              <Button onClick={() => setOnModal(!onModal)}
                      style={{background: onModal ? palette.gray[6] : palette.gray[8]}}
              >
                {quiz.votes.length}
              </Button>
              {onModal &&
                <VoteModal setOnModal={() => setOnModal(false)}
                           votes={quiz.votes}
                />
              }
            </div>
            <div className='button'
                 onClick={() => console.log('downvote')}>
              ▼
            </div>
          </div>
          <div className='title'>
            {quiz.title}
          </div>
        </QuizTitleStyle>
      </Responsive>
    </>
  );
}

export default QuizDetailPage