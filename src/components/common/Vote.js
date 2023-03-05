import arrow from "../../images/arrow.png";
import palette from "../../lib/styles/palette";
import VoteModal from "./VoteModal";
import React from "react";
import styled from "styled-components";

const VoteBlock = styled.div`
  .vote {
    width: 28px;
    display: flex;
    justify-content: left;
    flex-direction: column;
    align-items: center;

    .button {
      cursor: pointer;
      opacity: nonVoteOpacity;

      //&:hover {
      //  opacity: 1;
      //}
    }

    .count-button {
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 1.725rem;
      font-weight: bold;
      background-color: transparent;

      &:hover {
        opacity: 0.3;
      }

      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
`;

const Vote = ({user, votes, onVote, onModal, setOnModal}) => {

  const nonVoteOpacity = 0.35;

  function isVote(user, votes, value) {
    return user && votes.filter(vote => vote.voter.id === user.id && vote.value === value).length > 0;
  }

  return (
    <VoteBlock>
      <div className='vote'>
        <img className='button'
             onMouseEnter={(e) => {
                e.target.style.opacity = 1;
             }}
             onMouseLeave={(e) => {
               if (!isVote(user, votes, 1)) {
                e.target.style.opacity = nonVoteOpacity;
               }
             }}
             onClick={() => onVote(1)}
             src={arrow}
             style={{
               width: '26px',
               transform: 'rotate(180deg)',
               opacity: isVote(user, votes, 1) ? 1 : nonVoteOpacity
             }}/>
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
             onMouseEnter={(e) => {
               e.target.style.opacity = 1;
             }}
             onMouseLeave={(e) => {
               if (!isVote(user, votes, -1)) {
                 e.target.style.opacity = nonVoteOpacity;
               }
             }}
             onClick={() => onVote(-1)}
             src={arrow}
             style={{
               width: '26px',
               transform: 'rotate(360deg)',
               opacity: isVote(user, votes, -1) ? 1 : nonVoteOpacity
             }}/>
      </div>
    </VoteBlock>
  );
}

export default Vote;