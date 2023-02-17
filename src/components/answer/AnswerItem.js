import styled from "styled-components";
import palette from "../../lib/styles/palette";
import VoteModal from "../common/VoteModal";
import {useState} from "react";
import arrow from "../../images/arrow.png";
import Responsive from "../common/Responsive";

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
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @media (max-width: 780px) {
      margin: 0.5rem;
    }
    
    .author {
      font-size: 1.25rem;
      letter-spacing: 0.5px;
      color: ${palette.gray[7]};
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

const AnswerItem = ({id, contents, author, votes, createdAt, modifiedAt}) => {

  const [onModal, setOnModal] = useState(false);

  return (
    <Responsive>
      <AnswerTitleBlock>
        <div className='vote'>
          <img className='vote-button'
               onClick={() => console.log('upvote')}
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
            {votes.length}
          </button>
          {onModal &&
            <VoteModal setOnModal={() => setOnModal(false)}
                       votes={votes}
            />
          }
          <img className='vote-button'
               onClick={() => console.log('downvote')}
               src={arrow}
               style={{width: '22px', transform: 'rotate(360deg)'}}
          />
        </div>
        <div className="contents">
          <div className="author">
            {author.username}
          </div>
        </div>
      </AnswerTitleBlock>
      <AnswerBodyBlock dangerouslySetInnerHTML={{__html: contents}}/>
      <Spacer/>
    </Responsive>
  )
}

export default AnswerItem;