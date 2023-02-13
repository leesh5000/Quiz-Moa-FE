import {BeatLoader} from "react-spinners";
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
      <BeatLoader size={55}
                  margin={20}
                  color={palette.cyan[3]}
      />
    </SpinnerBlock>
  );
}

export default Spinner;