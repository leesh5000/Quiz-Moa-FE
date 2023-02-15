import Header from "../components/common/Header";
import {useEffect, useRef, useState} from "react";
import {getQuizDetails} from "../lib/api/quiz";
import {useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../components/common/Spinner";
import Responsive from "../components/common/Responsive";
import styled from "styled-components";
import VoteModal from "../components/common/VoteModal";
import palette from "../lib/styles/palette";
import AnswerItem from "../components/answer/AnswerItem";
import arrow from "../images/arrow.png";
import AnswerEditor from "../components/answer/AnswerEditor";
import Button from "../components/common/Button";

const QuizTitleBlock = styled.div`
  
  margin-top: 1.725rem;
  height: 4.625rem;
  background-color: blueviolet;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: left;
  align-items: center;

  @media (max-width: 780px) {
    margin-top: 1rem;
    padding-left: 0.5rem;
  }
  
  .title {
    margin-left: 1rem;
    font-size: 2rem;
    font-weight: 600;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .vote {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    
    .button {
      cursor: pointer;
    }
    
    .count-button {
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 1.725rem;
      font-weight: bold;
      background-color: transparent;
    }
  }
`;

const QuizInfoBlock = styled.div`
  height: 3rem;
  margin-top: 1rem;
  background-color: bisque;
  
  @media (max-width: 780px) {
    padding-left: 0.5rem;
  }
  
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 1rem;
  color: ${palette.gray[7]};
  border-bottom: 2.5px solid ${palette.gray[5]};
  letter-spacing: 0.5px;

  .author {
    font-weight: 800;
  }
  
  .spacer {
    font-size: 0.75rem;
    margin-right: 0.25rem;
    margin-left: 0.25rem;
  }
  
  .date {
    font-weight: 600;
  }
`;

const QuizContentsBlock = styled.div`
  width: 100%;
  min-height: 280px;
  background-color: gray;
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
  overflow-wrap: break-word;

  @media (max-width: 780px) {
    padding: 0.5rem;
  }
`;

const AnswerBlock = styled.div`
  
  .count {
    font-size: 1.65rem;
    background-color: azure;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 780px) {
      padding-left: 0.5rem;
    }
  }
`;

const EditorTitle = styled.div`
  padding-top: 1rem;
  font-size: 2.15rem;
  font-weight: 600;
  color: ${palette.gray[7]};

  @media (max-width: 1024px) {
    padding-left: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

const Spacer = styled.div`
  height: 12rem;

  @media (max-width: 1024px) {
    padding-left: 0.5rem;
  }

  @media (max-height: 1024px) {
    height: 4rem;
  }
`;

const ButtonBlock = styled.div`
  @media (max-width: 1024px) {
    padding-left: 0.5rem;
  }
`;

const ButtonStyle = styled(Button)`
  font-size: 1.15rem;
  height: 2rem;
`;

const QuizDetailPage = () => {

  console.log('QuizDetailPage rendering...');

  const quillElement = useRef(null);
  const quillInstance = useRef(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
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
        <QuizTitleBlock>
          <div className='vote'>
            <img className='button'
                 onClick={() => console.log('upvote')}
                 src={arrow}
                 style={{width: '26px', transform: 'rotate(180deg)'}}
            >
            </img>
            <button className='count-button'
                    onClick={() => setOnModal(!onModal)}
                    style={{color: onModal ? palette.gray[6] : palette.gray[8]}}
            >
              {quiz.votes.length}
            </button>
            {onModal &&
              <VoteModal setOnModal={() => setOnModal(false)}
                         votes={quiz.votes}
              />
            }
            <img className='button'
                 onClick={() => console.log('downvote')}
                 src={arrow}
                 style={{width: '26px', transform: 'rotate(360deg)'}}
            >
            </img>
          </div>
          <div className='title'>
            {quiz.title}
          </div>
        </QuizTitleBlock>
        <QuizInfoBlock>
          <div className='author'>
            {quiz.author.username}
          </div>
          <div className='spacer'>
            •
          </div>
          <div className='date'>
            {new Date(quiz.modifiedAt).toLocaleString('ko-KR', {
              hour12: false,
            }).slice(0, -13)}
          </div>
        </QuizInfoBlock>
        <QuizContentsBlock>
          {quiz.contents}
        </QuizContentsBlock>
        <AnswerBlock>
          <div className='count'>
            16 답변
          </div>
          {quiz.answers.map((answer, index) => (
            <AnswerItem key={index}
                        id={answer.id}
                        contents={answer.contents}
                        author={answer.author}
                        votes={answer.votes}
                        createdAt={answer.createdAt}
                        modifiedAt={answer.modifiedAt}
            />
          ))}
        </AnswerBlock>
        <EditorTitle>
          답변하기
        </EditorTitle>
        <AnswerEditor type='answer'
                      quillInstance={quillInstance}
                      quillElement={quillElement}
        />
        <ButtonBlock>
          <ButtonStyle>제출하기</ButtonStyle>
        </ButtonBlock>
        <Spacer></Spacer>
      </Responsive>
    </>
  );
}

export default QuizDetailPage