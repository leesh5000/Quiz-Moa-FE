import styled from "styled-components";

const QuizItemBlock = styled.div`
  
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  padding-bottom: 1rem;

  /* 텍스트 넘침 방지 */
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  
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

  .left {
    display: flex;
    flex-direction: column;
    font-size: 0.825rem;
    margin-right: 1rem;

    .count {
      margin-bottom: 0.25rem;
    }
  }
`;

const InfoBlock = styled.div`
  
  display: flex;
  justify-content: space-between;
  background-color: aliceblue;

  .date {
    display: flex;
    align-items: center;
    background-color: aquamarine;
  }
`;

const QuizItem = ({title, answerCount, votes, author, modifiedAt}) => {
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
        {title}
      </TitleBlock>
      <InfoBlock>
        <div>
          {author}
        </div>
        <div className="date">
            수정일: {modifiedAt}
        </div>
      </InfoBlock>
    </QuizItemBlock>
  );
}

export default QuizItem;