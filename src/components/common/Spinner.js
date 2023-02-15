import {ClipLoader} from "react-spinners";
import styled from "styled-components";
import palette from "../../lib/styles/palette";

const SpinnerBlock =  styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Spinner = () => {
  return (
    <SpinnerBlock>
      <ClipLoader size={120}
                  color={palette.cyan[3]}
      />
    </SpinnerBlock>
  );
}

export default Spinner;