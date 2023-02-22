import styled, {css} from "styled-components";
import palette from "../../lib/styles/palette";
import {Link} from "react-router-dom";

const buttonStyle = css`
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.35rem 0.65rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[7]};

  &:hover {
    background: ${palette.gray[5]};
  }

  ${props => 
    props.cyan && 
    css`
      background: ${palette.cyan[5]};
      &:hover {
        background: ${palette.cyan[4]};
      }
    `}
`;

const StyledButton = styled.button` ${buttonStyle}
`;
const StyledLink = styled(Link)` ${buttonStyle}
`;

const Button = props => {
  return props.to ? (
    <StyledLink {...props} cyan={props.cyan ? 1 : 0} /> ):(
    <StyledButton {...props} />
  );
}

export default Button;