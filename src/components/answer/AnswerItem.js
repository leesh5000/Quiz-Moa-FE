import styled from "styled-components";
import palette from "../../lib/styles/palette";
import VoteModal from "../common/VoteModal";
import React, {useState} from "react";
import arrow from "../../images/arrow.png";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import Swal from "sweetalert2";
import {voteAnswer} from "../../lib/api/answer";
import Spinner from "../common/Spinner";
import {Link} from "react-router-dom";

const AnswerTitleBlock = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${palette.gray[3]};

  @media (max-width: 780px) {
    padding-left: 0.5rem;
  }

  .vote {
    height: 4rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

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
      font-size: 1.25rem;
      font-weight: bold;
      background-color: transparent;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      color: ${palette.gray[8]};
      &:hover {
        opacity: 0.3;
      }
    }
  }

  .contents {
    font-weight: 800;
    margin-left: 1.25rem;
    display: flex;
    justify-content: left;
    align-items: center;

    @media (max-width: 780px) {
      margin: 0.5rem;
    }
    
    .author {
      font-size: 1rem;
      letter-spacing: 0.5px;
      color: ${palette.gray[7]};
      &:hover {
        color: ${palette.cyan[5]};
        text-decoration: underline;
      }
    }

    .spacer {
      font-size: 0.75rem;
      margin-right: 0.75rem;
      margin-left: 0.75rem;
    }

    .date {
      font-weight: 600;
    }
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
      margin-right: 1.125rem;
    }
  }
`;

const AnswerBodyBlock = styled.div`

  overflow-wrap: break-word;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.5rem;
  font-size: 1.025rem;

  @media (max-width: 780px) {
    margin-right: 0.5rem;
  }
`;

const AnswerWrapper = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.08);
  outline: 1px solid ${palette.gray[2]};
  background-color: ${palette.gray[0]};

  @media (max-width: 1200px) {
    margin: 1rem;
  }
`;

const AnswerItem = ({answer, user, onEdit, onDelete, isEditMode}) => {

  const [onModal, setOnModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState(answer.votes);

  const onEditHandler = () => {
    onEdit(answer.id);
  }

  const onDeleteHandler = () => {
    onDelete(answer.id);
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
    if (votes.filter(vote => vote.voter.id === user.id).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '이미 투표에 참여하였습니다.',
      });
      return false;
    }

    const vote = async (value) => {
      try {
        setLoading(true);
        await voteAnswer(answer.id, value);
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
        setVotes([...votes, vote]);
      });
  }

  if (loading) {
    return <Spinner/>
  }

  return (
    <Responsive>
      <AnswerWrapper>
        <AnswerTitleBlock>
          <div className='vote'>
            <img className='button'
                 onClick={() => onVote(1)}
                 src={arrow}
                 style={{width: '22px', transform: 'rotate(180deg)'}}
            />
            <button className='count-button'
                    onClick={(e) => {
                      setOnModal(!onModal)
                      // 이벤트 버블링 방지
                      e.stopPropagation();
                      return false;
                    }}
                    style={{color: onModal ? palette.gray[5] : palette.gray[10]}}>
              {votes.reduce((sum, vote) => sum + vote.value, 0)}
            </button>
            {onModal &&
              <VoteModal setOnModal={() => setOnModal(false)}
                         votes={votes}
                         user={user}/>}
            <img className='button'
                 onClick={() => onVote(-1)}
                 src={arrow}
                 style={{width: '22px', transform: 'rotate(360deg)'}}
            />
          </div>
          <div className="contents">
            <div className="author">
              <Link to={`/users/${answer.author.id}`}
                    state={{id: answer.author.id}}
              >
                {answer.author.username}
              </Link>
            </div>
            <div className='spacer'>
              •
            </div>
            <div className="date">
              {new Date(answer.modifiedAt).toLocaleString().slice(0, -3)}
            </div>
          </div>
          {answer.author.id === (user && user.id) &&
            <div className="buttons">
              <Button onClick={onEditHandler}
                      className='edit'>
                수정
              </Button>
              <Button onClick={onDeleteHandler}
                      className='delete'>
                삭제
              </Button>
            </div>
          }
        </AnswerTitleBlock>
        <AnswerBodyBlock dangerouslySetInnerHTML={{__html: answer.contents}}/>
      </AnswerWrapper>
    </Responsive>
  );
}

export default React.memo(AnswerItem);