import styled from "styled-components";
import Button from "./Button";
import {useEffect, useRef} from "react";
import palette from "../../lib/styles/palette";
import {useNavigate} from "react-router-dom";

const VoteModalWrapper = styled.div`

  width: 360px;
  height: 480px;
  background-color: ${palette.cyan[0]};
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  border: 1px solid ${palette.gray[4]};
  z-index: 9;

  @media (max-width: 768px) {
    width: 300px;
  }

  @media (max-height: 960px) {
    height: 480px;
  }

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .header {
    height: 4rem;

    .title {
      font-size: 1.35rem;
      font-weight: 600;
      text-align: center;
      padding-top: 1rem;
      margin: 0 auto;
      padding-bottom: 1rem;
    }
  }

  .body {
    height: 380px;
    overflow: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;

    .info {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 1px;
      padding-bottom: 0.5rem;
      color: ${palette.gray[8]};
      text-align: center;
    }
  }
`;

const ButtonStyle = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.95rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  margin-top: 1rem;
  margin-right: 1rem;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.125);
  background-color: ${palette.gray[7]};
`;

const VoterStyle = styled.div`

  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.125);
  border: 1px solid ${palette.gray[4]};
  border-radius: 8px;

  font-size: 1.15rem;
  height: 3rem;
  margin: 0.75rem 1rem;
  background-color: ${palette.gray[1]};
  padding-left: 1rem;
  
  &:hover {
    background-color: ${palette.cyan[1]};
    cursor: pointer;
  }
`;

const VoteModal = ({setOnModal, votes}) => {

  console.log('vote modal rendering...');

  const ref = useRef();
  const navigate = useNavigate();

  // 모달창 외부 스크롤 방지
  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      width: 100%;
      overflow-y: scroll;
      pointers-events: none;
    `;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    };
  }, []);

  // 모달창 외부 클릭 시 모달창 닫기
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOnModal(false);
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ref]);

  return (
      <VoteModalWrapper ref={ref}>
        <div className='header'>
          <div className="title">투표 결과</div>
          <ButtonStyle onClick={setOnModal}>닫기</ButtonStyle>
        </div>
        <div className='body'>
          <div className='info'>
            투표 결과는 추천을 한 유저만 노출됩니다.
          </div>
          {votes.map((vote, index) =>
            <VoterStyle key={index}
                        onClick={() => {
                          navigate(`/users/${vote.voter.email}`);
                        }}
            >
              {/*투표는 추천을 한 유저만 보이도록 설정*/}
              {vote.value > 0 && vote.voter.username}
            </VoterStyle>
          )}
        </div>
      </VoteModalWrapper>
  )
};

export default VoteModal;