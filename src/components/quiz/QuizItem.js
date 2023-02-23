import styled from "styled-components";
import React from "react";
import palette from "../../lib/styles/palette";

const QuizItemBlock = styled.div`

  display: flex;
  flex-direction: column;
  padding: 1rem;
  outline: 2px solid ${palette.gray[2]};
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  margin-top: 1rem;
  
  cursor: pointer;
  
  &:hover {
    background: ${palette.cyan[0]};
  }

  @media (max-width: 1200px) {
    margin-right: 1rem;
    margin-left: 1rem;
  }

`;

const TitleBlock = styled.div`
  padding-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 1px;

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
    font-size: 0.875rem;
    margin-right: 1.25rem;
    white-space: nowrap;
    font-weight: 700;
    color: ${palette.gray[7]};
    
    @media (max-width: 1200px) {
      margin-right: 1rem;
    }

    .count {
      margin-bottom: 0.35rem;
    }
  }
`;

const InfoBlock = styled.div`
  
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  letter-spacing: 0.75px;
  font-weight: 600;
  color: ${palette.gray[6]};
  
  .author {
    display: flex;
    align-items: center;
  }

  .date {
    letter-spacing: 0;
    display: flex;
    align-items: center;
  }
`;

const QuizItem = ({id, onClick, title, answerCount, votes, author, modifiedAt}) => {

  console.log('QuizItem rendering...');

  return (
    <QuizItemBlock onClick={onClick}>
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
          <div>
            {title}
          </div>
        </div>
      </TitleBlock>
      <InfoBlock>
        <div className='author'>
          by {author.username}
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