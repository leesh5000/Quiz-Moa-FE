import styled from "styled-components";
import palette from "../../lib/styles/palette";
import VoteModal from "../common/VoteModal";
import {useState} from "react";
import arrow from "../../images/arrow.png";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import Swal from "sweetalert2";
import {voteAnswer} from "../../lib/api/answer";
import Spinner from "../common/Spinner";

const AnswerTitleBlock = styled.div`
  
  background-color: olive;
  display: flex;
  justify-content: left;
  align-items: center;

  @media (max-width: 780px) {
    padding-left: 0.5rem;
  }

  .vote {
    background-color: blueviolet;
    height: 4rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    
    .vote-button {
      background-color: blue;
    }

    .count-button {
      cursor: pointer;
      border: none;
      outline: none;
      font-size: 1rem;
      font-weight: bold;
      background-color: brown;
    }
  }

  .contents {
    background-color: aquamarine;
    font-weight: 800;
    margin-left: 0.5rem;
    display: flex;
    justify-content: left;
    align-items: center;

    @media (max-width: 780px) {
      margin: 0.5rem;
    }
    
    .author {
      font-size: 1.25rem;
      letter-spacing: 0.5px;
      color: ${palette.gray[7]};
    }

    .spacer {
      font-size: 0.75rem;
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    }

    .date {
      font-weight: 600;
    }
  }

  .buttons {
    background-color: coral;
    margin-left: auto;

    button {
      margin-right: 1rem;
    }
  }
`;

const AnswerBodyBlock = styled.div`

  overflow-wrap: break-word;
  border-bottom: 2px solid ${palette.gray[5]};
  letter-spacing: 0.5px;
  padding: 0.5rem;

  @media (max-width: 780px) {
    margin-right: 0.5rem;
  }
  
  p {
    margin: 0;
  }
`;

const Spacer = styled.div`
  height: 2rem;
  background-color: coral;
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
            username: user.username,
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
      <AnswerTitleBlock>
        <div className='vote'>
          <img className='vote-button'
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
                  style={{color: onModal ? palette.gray[6] : palette.gray[8]}}
          >
            {votes.reduce((sum, vote) => sum + vote.value, 0)}
          </button>
          {onModal &&
            <VoteModal setOnModal={() => setOnModal(false)}
                       votes={votes}
            />
          }
          <img className='vote-button'
               onClick={() => onVote(-1)}
               src={arrow}
               style={{width: '22px', transform: 'rotate(360deg)'}}
          />
        </div>
        <div className="contents">
          <div className="author">
            {answer.author.username}
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
                    style={{backgroundColor: isEditMode ? palette.gray[6] : palette.gray[8]}}>
              수정
            </Button>
            <Button onClick={onDeleteHandler}>삭제</Button>
          </div>
        }
      </AnswerTitleBlock>
      <AnswerBodyBlock dangerouslySetInnerHTML={{__html: answer.contents}}/>
      <Spacer/>
    </Responsive>
  );
}

export default AnswerItem;