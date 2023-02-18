import Header from "../components/common/Header";
import {useEffect, useRef, useState} from "react";
import {deleteQuiz, getQuizDetails} from "../lib/api/quiz";
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
import {createAnswer, deleteAnswer, editAnswer} from "../lib/api/answer";
import getLoginUser from "../lib/utils/getLoginUser";

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
  
  .buttons {
    background-color: coral;
    margin-left: auto;
    
    button {
      margin-right: 1rem;
    }
  }
`;

const QuizContentsBlock = styled.div`
  width: 100%;
  min-height: 280px;
  background-color: gray;
  font-size: 1.125rem;
  letter-spacing: 1px;
  overflow-wrap: break-word;

  @media (max-width: 780px) {
    padding: 0.5rem;
  }

  p {
    margin: 0;
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
  
  display: flex;
  justify-content: space-between;
  
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
  const quizId = useParams().id;
  const navigate = useNavigate();
  const [onModal, setOnModal] = useState(false);
  const [user, setUser] = useState(null);
  const [answerEditId, setAnswerEditId] = useState(false);

  useEffect(() => {
    setUser(getLoginUser());
  }, []);

  const onLogout = () => {
    // 로그아웃 시, Quill Editor 비활성화
    quillInstance.current.root.innerHTML = '';
    quillInstance.current.root.dataset.placeholder = '로그인 후 답변을 입력할 수 있습니다.';
    quillInstance.current.disable();
    setUser(null);
    setAnswerEditId(false);
  }

  const fetchQuizDetails = async () => {

    try {
      setLoading(true);
      const response = await getQuizDetails(quizId);
      setQuiz(response);

    } catch (e) {

      console.log(e);

      if (e.response.status === 404) {
        await Swal.fire({
          icon: 'warning',
          title: '삭제된 퀴즈입니다.',
        });
        navigate(-1);
        return false;
      }

      await Swal.fire({
        icon: 'warning',
        title: '퀴즈 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
      navigate('/quizzes');
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchQuizDetails();
  }, []);

  const onPost = () => {

    const contents = quillInstance.current.root.innerHTML;

    if (contents.replace(/<[^>]*>/g, '').length < 10) {
      Swal.fire({
        icon: 'warning',
        title: '본문은 최소 10자 이상으로 작성해주세요.'
      });
      return false;
    }

    const postAnswer = async () => {

      try {
        setLoading(true);
        await createAnswer(quizId, contents);
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '답변 작성에 실패했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      setLoading(false);
      return true;
    };

    // 답변 수정 같은 경우에는, 기존 답변의 내용만 업데이트 해주면 되지만,
    // 답변 작성은 Author, Vote 등 답변을 이루는 많은 데이터를 생성해야 한다.
    // 따라서, 답변 작성은 데이터를 새로 가져오도록 한다.
    postAnswer()
      .then(() => {
        fetchQuizDetails();
      });
  }

  const onCancel = () => {
    navigate(-1);
  }

  const onEdit = () => {
    navigate('/post', {
      state: {
        quizId: quizId,
        title: quiz.title,
        contents: quiz.contents,
      },
    });
  }

  const onDelete = () => {

    const deleteUserQuiz = async () => {

      try {
        setLoading(true);
        await deleteQuiz(user.id, quizId);

      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '퀴즈 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        })
      }
      setLoading(false);
      return true;
    };

    // 삭제 확인 창 모달
    Swal.fire({
      icon: 'warning',
      text: '정말로 삭제하시겠습니까?',
      position: 'center',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제하기'
    }).then((result) => {
      if (result.isConfirmed) {
        // 퀴즈 삭제에 성공하면, 홈 화면으로 이동
        deleteUserQuiz()
          .then(() => {
            navigate('/quizzes', {
              replace: true
            });
          });
      }
    })
  }

  const onAnswerEdit = (id) => {
    // 현재 수정 중인 답변의 수정 버튼을 다시 누르면, 수정 모드를 해제한다.
    if (answerEditId === id) {
      setAnswerEditId(false);
      return;
    }
    quillInstance.current.focus();
    setAnswerEditId(id);
    window.scrollTo(0, quillElement.current.offsetTop);
  }

  const onAnswerDelete = (answerId) => {

    const answerDelete = async () => {

      try {
        setLoading(true);
        await deleteAnswer(user.id, answerId);

      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '답변 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        })
      }
      setLoading(false);
      return true;
    };

    // 삭제 확인 창 모달
    Swal.fire({
      icon: 'warning',
      text: '정말로 삭제하시겠습니까?',
      position: 'center',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제하기'
    }).then((result) => {
      if (result.isConfirmed) {
        // 답변 삭제에 성공하면, 퀴즈 상세 데이터를 다시 가져올 필요 없이, 답변 목록만 업데이트 해주면 된다.
        answerDelete()
          .then(() => {

            const removeAnswers = quiz.answers
              .filter(answer => answer.id !== answerId);

            setQuiz({...quiz, answers: removeAnswers});
          });
      }
    });
  }

  const onEditConfirm = () => {

    const contents = quillInstance.current.root.innerHTML;

    if (contents.replace(/<[^>]*>/g, '').length < 10) {
      Swal.fire({
        icon: 'warning',
        title: '본문은 최소 10자 이상으로 작성해주세요.'
      });
      return false;
    }

    const edit = async () => {
      try {
        setLoading(true);
        await editAnswer(user.id, answerEditId, contents);
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '답변 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      setLoading(false);
      return true;
    };

    // 답변 수정에 성공하면, 굳이 퀴즈 상세 데이터를 다시 가져올 필요 없이 현재 보이는 답변 데이터만 수정한다.
    // 어차피 재 요청하면, 수정된 데이터가 보이기 때문에.
    edit()
      .then(() => {

        // 객체의 원본을 바꿔버리는 코드
        // quiz.answers.map(answer => answer.id === answerEditId ? answer.contents = contents : answer);

        const updateAnswers = quiz.answers
          .map(answer => answer.id === answerEditId ? {...answer, contents: contents} : answer);

        setQuiz({...quiz, answers: updateAnswers});

      })
      // 답변 수정 모드 해제
      .finally(() => {
        setAnswerEditId(false);
      });
  }

  const onEditCancel = () => {
    quillInstance.current.root.innerHTML = '';
    setAnswerEditId(false);
  }

  if (loading) {
    return <Spinner/>
  }

  if (!quiz) {
    return null;
  }

  return (
    <>
      <Header user={user} onLogout={onLogout}/>
      <Responsive>
        <QuizTitleBlock>
          <div className='vote'>
            <img className='button'
                 onClick={() => console.log('upvote')}
                 src={arrow}
                 style={{width: '26px', transform: 'rotate(180deg)'}}/>
            <button className='count-button'
                    onClick={(e) => {
                      setOnModal(!onModal)
                      // 이벤트 버블링 방지
                      e.stopPropagation();
                      return false;
                    }}
                    style={{color: onModal ? palette.gray[6] : palette.gray[8]}}>
              {quiz.votes.length}
            </button>
            {onModal &&
              <VoteModal setOnModal={() => setOnModal(false)}
                         votes={quiz.votes}/>}
            <img className='button'
                 onClick={() => console.log('downvote')}
                 src={arrow}
                 style={{width: '26px', transform: 'rotate(360deg)'}}/>
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
          {quiz.author.id === (user && user.id) &&
            <div className='buttons'>
              <Button onClick={onEdit}>수정</Button>
              <Button onClick={onDelete}>삭제</Button>
            </div>
          }
        </QuizInfoBlock>
        <QuizContentsBlock dangerouslySetInnerHTML={{__html: quiz.contents}}/>
        <AnswerBlock>
          <div className='count'>
            {quiz.answers.length} 답변
          </div>
          {quiz.answers.map((answer, index) => (
            <AnswerItem key={index}
                        id={answer.id}
                        contents={answer.contents}
                        author={answer.author}
                        votes={answer.votes}
                        createdAt={answer.createdAt}
                        modifiedAt={answer.modifiedAt}
                        user={user}
                        onEdit={onAnswerEdit}
                        onDelete={onAnswerDelete}
                        isEditMode={answerEditId === answer.id}
            />
          ))}
        </AnswerBlock>
        <EditorTitle>
          {answerEditId ?
            <div style={{
              display: 'inline-block',
              boxShadow: 'inset 0 -10rem 0 #D9FCDB',
              transition : 'all 2s ease-in-out'
            }}>답변 수정하기</div> :
            <div>작성하기</div>
          }
        </EditorTitle>
        <AnswerEditor quillInstance={quillInstance}
                      quillElement={quillElement}
                      user={user}
        />
        {answerEditId ?
          <ButtonBlock>
            <ButtonStyle onClick={onEditConfirm}>수정하기</ButtonStyle>
            <ButtonStyle onClick={onEditCancel}>취소하기</ButtonStyle>
          </ButtonBlock> :
          <ButtonBlock>
            <ButtonStyle onClick={onPost}>제출하기</ButtonStyle>
            <ButtonStyle onClick={onCancel}>돌아가기</ButtonStyle>
          </ButtonBlock>
        }
        <Spacer/>
      </Responsive>
    </>
  );
}

export default QuizDetailPage