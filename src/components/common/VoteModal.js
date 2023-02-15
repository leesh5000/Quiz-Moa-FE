import styled from "styled-components";
import Button from "./Button";

const VoteModalWrapper = styled.div`

  width: 460px;
  height: 680px;

  @media (max-width: 768px) {
    width: 300px;
  }

  @media (max-height: 960px) {
    height: 486px;
  }

  background-color: olive;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .header {
    height: 4rem;
    background-color: bisque;
    
    .title {
      font-size: 1.75rem;
      position: absolute;
      top: 0;
      left: 50%;
      padding: 0;
      margin: 1rem 0 0;
      transform: translate(-50%, 0);
    }
    
    .button {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0;
      margin: 0 0.75rem 0 0;
      transform: translate(0, 50%);
    }
  }


`;

const VoteModal = ({setOnModal, votes}) => {

  console.log('vote modal rendering...');

  return (
    <VoteModalWrapper>
      <div className='header'>
        <div className="title">투표 결과</div>
        <div className="button">
          <Button onClick={setOnModal}>닫기</Button>
        </div>
      </div>
    </VoteModalWrapper>
  )
}

export default VoteModal;