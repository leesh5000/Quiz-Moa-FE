import styled from "styled-components";
import palette from "../../lib/styles/palette";

const SortingButtonStyle = styled.button`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${palette.gray[6]};
  border: none;
  cursor: pointer;
  background: none;
  margin-right: 1rem;
  padding-bottom: 0.35rem;
  letter-spacing: 1.25px;
`;

const SortingButton = ({sortType, setSort, description, sort}) => {

  const onSort = (sortType) => {
    setSort(sortType);
    // 페이지가 이동되더라도, 정렬 방식은 유지되도록 하기 위해 localStorage 에 저장한다.
    localStorage.setItem('sort', sortType);
  }

  const activeSortingButtonCss = {
    color: palette.gray[8],
    borderBottom: '2px solid #212529'
  }

  return (
    <SortingButtonStyle onClick={() => {onSort(sortType)}}
                        style={(sort === sortType) ? activeSortingButtonCss : null}>
      {description}
    </SortingButtonStyle>
  )
}

export default SortingButton;