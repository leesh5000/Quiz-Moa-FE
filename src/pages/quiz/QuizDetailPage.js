import Header from "../../components/common/Header";
import React, {useEffect, useRef, useState} from "react";
import {deleteQuiz, getQuizDetails, voteQuiz} from "../../lib/api/quiz";
import {Link, useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../../components/common/Spinner";
import Responsive from "../../components/common/Responsive";
import styled from "styled-components";
import VoteModal from "../../components/common/VoteModal";
import palette from "../../lib/styles/palette";
import AnswerItem from "../../components/answer/AnswerItem";
import arrow from "../../images/arrow.png";
import AnswerEditor from "../../components/answer/AnswerEditor";
import Button from "../../components/common/Button";
import {createAnswer, deleteAnswer, editAnswer} from "../../lib/api/answer";
import getLoginUser from "../../lib/utils/getLoginUser";

const QuizWrapper = styled.div`
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.12);
  outline: 2px solid ${palette.gray[2]};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  background-color: ${palette.gray[0]};

  @media (max-width: 1200px) {
    margin: 0 1rem 1rem;
  }

  @media (max-height: 1024px) {
    margin-top: 1.5rem;
  }
`;

const QuizTitleBlock = styled.div`
  
  letter-spacing: 0.5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  
  .title {
    margin-left: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;

    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .vote {
    display: flex;
    justify-content: left;
    flex-direction: column;
    align-items: center;
    
    .button {
      cursor: pointer;
      opacity: 0.35;
      &:hover {
        opacity: 1;
      }
    }
    
    .count-button {
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 1.725rem;
      font-weight: bold;
      background-color: transparent;
      color: ${palette.gray[10]};
      &:hover {
        opacity: 0.3;
      }
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
`;

const QuizInfoBlock = styled.div`
  height: 3rem;
  margin-top: 1rem;
  
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 1rem;
  color: ${palette.gray[6]};
  border-bottom: 1px solid ${palette.gray[4]};
  letter-spacing: 0.5px;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;

  .author {
    font-weight: 800;
    &:hover {
      text-decoration: underline;
      color: ${palette.cyan[5]};
    }
  }
  
  .spacer {
    font-size: 1rem;
    margin-right: 0.75rem;
    margin-left: 0.75rem;
  }
  
  .date {
    font-weight: 600;
  }
  
  .buttons {
    margin-left: auto;
    
    .edit {
      background: ${palette.blue[6]};
      &:hover {
        background-color: ${palette.blue[2]};
      }
    }

    .delete {
      background: ${palette.red[6]};
      &:hover {
        background-color: ${palette.red[2]};
      }
    }
    
    button {
      margin-left: 1rem;
    }
  }
`;

const QuizContentsBlock = styled.div`
  width: 100%;
  min-height: 280px;
  font-size: 1.125rem;
  letter-spacing: 1px;
  overflow-wrap: break-word;
  margin-bottom: 1.5rem;

  @media (max-width: 1200px) {
    margin-top: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  p {
    margin: 0;
  }
`;

const AnswerBlock = styled.div`
  
  .count {
    font-size: 1.65rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    letter-spacing: 2px;
    color: ${palette.gray[8]};
    padding-left: 0.5rem;

    @media (max-width: 1200px) {
      padding-left: 1.5rem;
    }
  }
`;

const EditorTitle = styled.div`
  padding-top: 1rem;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: ${palette.gray[7]};

  @media (max-width: 1024px) {
    padding-left: 1rem;
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
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const ButtonStyle = styled(Button)`
  height: 2.25rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

const QuizDetailPage = () => {

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
        navigate('/');
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
      quillInstance.current.root.innerHTML = '';
      return;
    }

    // 수정 모드로 전환 시, 에디터에 수정 전 텍스트를 붙여넣어 줌
    quillInstance.current.root.innerHTML = quiz.answers
      .filter(answer => answer.id === id)
      .map(answer => answer.contents);
    quillInstance.current.focus();
    window.scrollTo(0, quillElement.current.offsetTop);
    setAnswerEditId(id);
  }

  const onAnswerDelete = (answerId) => {

    const answerDelete = async () => {

      try {
        setLoading(true);
        await deleteAnswer(user.id, answerId);
        return true;
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '답변 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        })
        throw e;
      } finally {
        setLoading(false);
      }
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

        // 만약, 사용자가 임의로 토큰을 변경하거나 삭제한 경우에는 401 에러가 발생한다. 이 경우에는 강제 로그아웃 처리한다.
        if (e.response.status === 401) {
          await Swal.fire({
            icon: 'warning',
            position: 'center',
            title: '로그인 후 이용해주세요.',
          });
          localStorage.removeItem('accessToken');
          navigate('/login');
          return;
        }

        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '답변 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        });

        throw e;

      } finally {
        setLoading(false);
      }
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

  const onVote = (value) => {

    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: '로그인 후 투표가 가능합니다.',
      });
      return false;
    }

    // 이미 투표에 참여한 경우, 투표를 중복해서 할 수 없다.
    if (quiz.votes.filter(vote => vote.voter.id === user.id).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '이미 투표에 참여하였습니다.',
      });
      return false;
    }

    const vote = async (value) => {
      try {
        setLoading(true);
        await voteQuiz(quiz.id, value);
      } catch (e) {
        await Swal.fire({
          icon: 'error',
          position: 'center',
          title: '투표에 실패했습니다. 잠시 후 다시 시도해주세요.'
        });
      } finally {
        setLoading(false);
      }
    }

    vote(value)
      .then(() => {
        const vote = {
          id: null,
          value: value,
          voter: {
            id: user.id,
            username: localStorage.getItem('username') ? localStorage.getItem('username') : user.username,
            email: user.email
          }
        }
        setQuiz({...quiz, votes: [...quiz.votes, vote]});
      });
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
        <QuizWrapper>
          <QuizTitleBlock>
            <div className='vote'>
              <img className='button'
                   onClick={() => onVote(1)}
                   src={arrow}
                   style={{width: '26px', transform: 'rotate(180deg)'}}/>
              <button className='count-button'
                      onClick={(e) => {
                        setOnModal(!onModal)
                        // 이벤트 버블링 방지
                        e.stopPropagation();
                        return false;
                      }}
                      style={{color: onModal ? palette.gray[5] : palette.gray[10]}}>
                {quiz.votes.reduce((sum, vote) => sum + vote.value, 0)}
              </button>
              {onModal &&
                <VoteModal setOnModal={() => setOnModal(false)}
                           votes={quiz.votes}
                           user={user}/>}
              <img className='button'
                   onClick={() => onVote(-1)}
                   src={arrow}
                   style={{width: '26px', transform: 'rotate(360deg)'}}
              />
            </div>
            <div className='title'>
              {quiz.title}
            </div>
          </QuizTitleBlock>
          <QuizInfoBlock>
            <div className='author'>
              <Link to={`/users/${quiz.author.id}`}
                    state={{id: quiz.author.id}}
              >
                {quiz.author.username}
              </Link>
            </div>
            <div className='spacer'>
              •
            </div>
            <div className='date'>
              {new Date(quiz.modifiedAt).toLocaleString().slice(0, -3)}
            </div>
            {quiz.author.id === (user && user.id) &&
              <div className='buttons'>
                <Button onClick={onEdit}
                        className='edit'>
                  수정
                </Button>
                <Button onClick={onDelete}
                        className='delete'>
                  삭제
                </Button>
              </div>
            }
          </QuizInfoBlock>
          <QuizContentsBlock dangerouslySetInnerHTML={{__html: quiz.contents}}/>
        </QuizWrapper>
        <AnswerBlock>
          <div className='count'>
            {quiz.answers.length} 답변
          </div>
          {quiz.answers.map((answer, index) => (
            <AnswerItem key={index}
                        answer={answer}
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
              boxShadow: 'inset 0 -5rem 0 #c5f6fa',
              transition: 'all 0.5s ease-in-out'
            }}>답변 수정하기</div> :
            <div>답변 작성하기</div>
          }
        </EditorTitle>
        <AnswerEditor quillInstance={quillInstance}
                      quillElement={quillElement}
                      user={user}/>
        {answerEditId ?
          <ButtonBlock>
            <ButtonStyle cyan onClick={onEditCancel}>취소하기</ButtonStyle>
            <ButtonStyle cyan onClick={onEditConfirm}>수정하기</ButtonStyle>
          </ButtonBlock> :
          <ButtonBlock>
            <ButtonStyle cyan onClick={onCancel}>돌아가기</ButtonStyle>
            <ButtonStyle cyan onClick={onPost}>제출하기</ButtonStyle>
          </ButtonBlock>
        }
        <Spacer/>
      </Responsive>
    </>
  );
}

export default QuizDetailPage