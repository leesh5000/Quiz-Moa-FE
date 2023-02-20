import styled from "styled-components";
import palette from "../../lib/styles/palette";
import {Link} from "react-router-dom";
import React from "react";

const AnswerItemBlock = styled.div`
  
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
    font-size: 0.925rem;
    margin-right: 1rem;
    white-space: nowrap;
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

const UserAnswerItem = ({id, quizId, contents, votes, author, modifiedAt}) => {

  console.log('QuizItem rendering...');

  return (
    <AnswerItemBlock>
      <TitleBlock>
        <div className="left">
          <div className="count">
            추천 {votes}
          </div>
        </div>
        <div className="title">
          <Link to={`/quizzes/${quizId}`}>
            {contents.replace(/<[^>]*>/g, '')}
          </Link>
        </div>
      </TitleBlock>
      <InfoBlock>
        <div className='author'>
          <Link style={{textDecoration: 'underline'}}
                to={`/users/${author.email}`}
                state={{id: author.id}}
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
    </AnswerItemBlock>
  );
};

// 퀴즈 하나가 바뀔 때마다 전부 리렌더링 되는 것을 방지
export default React.memo(UserAnswerItem);