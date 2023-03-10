import styled from "styled-components";
import palette from "../../lib/styles/palette";
import React, {useState} from "react";
import Responsive from "../common/Responsive";
import Button from "../common/Button";
import Swal from "sweetalert2";
import {voteAnswer} from "../../lib/api/answer";
import Spinner from "../common/Spinner";
import {Link} from "react-router-dom";
import Vote from "../common/Vote";

const AnswerTitleBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${palette.gray[3]};

  .vote {
    width: 24px;

    .count-button {
      font-size: 1.25rem;
      font-weight: bold;
      background-color: transparent;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }

  .contents {
    font-weight: 800;
    margin-left: 1.25rem;
    display: flex;
    justify-content: left;
    align-items: center;
    color: ${palette.gray[6]};

    @media (max-width: 780px) {
      margin: 0.5rem 0.5rem 0.5rem 1rem;
    }

    .author {
      font-size: 1rem;
      letter-spacing: 0.5px;

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
      margin-left: 1rem;
    }
  }
`;

const AnswerBodyBlock = styled.div`

  overflow-wrap: break-word;
  letter-spacing: 0.5px;
  padding: 1rem 0.5rem;
  font-size: 1.025rem;

  @media (max-width: 780px) {
    margin-right: 0.5rem;
  }

  p {
    margin: 0 0 4px;
  }

  li {
    margin-bottom: 10px;
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

const AnswerItem = ({answer, user, onEdit, onDelete}) => {

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
        title: '????????? ??? ????????? ???????????????.',
      });
      return false;
    }

    // ?????? ????????? ????????? ??????, ????????? ???????????? ??? ??? ??????.
    if (votes.filter(vote => vote.voter.id === user.id).length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '?????? ????????? ?????????????????????.',
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
          title: '????????? ??????????????????. ?????? ??? ?????? ??????????????????.'
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
          <Vote user={user}
                votes={votes}
                onVote={onVote}
                onModal={onModal}
                setOnModal={setOnModal}
          />
          <div className="contents">
            <div className="author">
              <Link to={`/users/${answer.author.id}`}
                    state={{id: answer.author.id}}
              >
                {answer.author.username}
              </Link>
            </div>
            <div className='spacer'>
              ???
            </div>
            <div className="date">
              {new Date(answer.modifiedAt).toLocaleString().slice(0, -3)}
            </div>
          </div>
          {answer.author.id === (user && user.id) &&
            <div className="buttons">
              <Button onClick={onEditHandler}
                      className='edit'>
                ??????
              </Button>
              <Button onClick={onDeleteHandler}
                      className='delete'>
                ??????
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