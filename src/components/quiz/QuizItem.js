import styled from "styled-components";
import React from "react";
import {Link} from "react-router-dom";

const QuizItemBlock = styled.div`
  
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding-bottom: 1rem;
  
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
  justify-content: space-between;
  background-color: aliceblue;
  
  .author {
    display: flex;
    align-items: center;
    background-color: aquamarine;
    
    .profile {
      margin-right: 0.5rem;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      object-fit: cover;
      outline: gray solid 1px;
    }
  }

  .date {
    display: flex;
    align-items: center;
    background-color: aquamarine;
  }
`;

const QuizItem = ({id, title, answerCount, votes, author, modifiedAt}) => {
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
          <img className='profile'
               src="http://k.kakaocdn.net/dn/JbKdS/btrnpoxSHe4/brpiY0hsleYg0Bb3dSkmMk/img_110x110.jpg" alt="profile"/>
          {author}
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