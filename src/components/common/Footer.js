import Responsive from "./Responsive";
import styled from "styled-components";

const FooterBlock = styled(Responsive)`

  position: fixed;
  bottom: 0;
  height: 3rem;
  background-color: coral;

  @media (max-height: 1024px) {
    height: 2.5rem;
  }

  @media (max-height: 768px) {
    height: 2.5rem;
    width: 100%;
  }
`;

const Footer = ({children, ...rest}) => {
  return (
    <>
      <Responsive>
        <FooterBlock {...rest}/>
        {children}
      </Responsive>
    </>
  );
}

export default Footer;