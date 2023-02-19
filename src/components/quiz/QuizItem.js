import styled from "styled-components";
import React from "react";
import {Link} from "react-router-dom";
import palette from "../../lib/styles/palette";

const QuizItemBlock = styled.div`
  
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding-bottom: 1rem;
  
  @media (max-width: 1030px) {
    padding-left: 0.5rem;
  }
  
`;

const TitleBlock = styled.div`
  margin-top: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  background-color: olivedrab;

  display: flex;
  justify-content: left;
  align-items: center;
  
  /* 텍스트 넘침 방지 */
  .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .left {
    display: flex;
    flex-direction: column;
    font-size: 0.825rem;
    margin-right: 1rem;
    white-space: nowrap;

    .count {
      margin-bottom: 0.25rem;
    }
  }
`;

const InfoBlock = styled.div`
  
  display: flex;
  justify-content: left;
  background-color: aliceblue;
  font-size: 1.125rem;
  letter-spacing: 0.75px;
  
  .author {
    font-weight: 700;
    display: flex;
    align-items: center;
    background-color: aquamarine;
    color: ${palette.gray[7]};
  }
  
  .spacer {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }

  .date {
    font-size: 0.95rem;
    letter-spacing: 0;
    font-weight: 550;
    display: flex;
    align-items: center;
  }
`;

const QuizItem = ({id, title, answerCount, votes, author, modifiedAt}) => {

  console.log('QuizItem rendering...');

  return (
    <QuizItemBlock>
      <TitleBlock>
        <div className="left">
          <div className="count">
            추천 {votes}
          </div>
          <div className="count">
            답변 {answerCount}
          </div>
        </div>
        <div className="title">
          <Link to={`/quizzes/${id}`}>
            {title}
          </Link>
        </div>
      </TitleBlock>
      <InfoBlock>
        <div className='author'>
          <Link style={{textDecoration: 'underline'}}
                to={`/users/${author.email}`}
          >
            {author.username}
          </Link>
        </div>
        <div className='spacer'>
          •
        </div>
        <div className="date">
          {modifiedAt}
        </div>
      </InfoBlock>
    </QuizItemBlock>
  );
}

// 퀴즈 하나가 바뀔 때마다 전부 리렌더링 되는 것을 방지
export default React.memo(QuizItem);