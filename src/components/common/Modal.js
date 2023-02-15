import styled from "styled-components";
import Portal from "./Portal";
import {useEffect} from "react";

const Background = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  text-align: center;
`;

const Modal = ({children, setOnModal}) => {
  return (
    <Portal>
      HELLO!
      <button onClick={() => setOnModal(false)}>닫기</button>
    </Portal>
  )
}

export default Modal;