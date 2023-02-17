import reactDom from 'react-dom';

const Portal = ({children}) => {
  const modal = document.getElementById('modal');
  return reactDom.createPortal(children, modal);
};

export default Portal;