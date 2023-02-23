import {Link} from "react-router-dom";
import styled from "styled-components";
import palette from "../styles/palette";

const StyledNumber = styled(Link)`
  border-radius: 4px;
  outline: 1px solid ${palette.gray[4]};
  padding: 0.45rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
`;

const calculatePage = (totalPage, pageSize, currentPage) => {
  const arr = [];
  const curPage = Number(currentPage) < 0 ? 1 : Number(currentPage);

  // 한 화면에 보여지는 페이지 개수가 전체 페이지 수보다 클 경우에는 1부터 마지막 페이지까지 보여주고 리턴한다.
  if (totalPage <= pageSize) {
    for (let i = 1; i <= totalPage; i++) {
      arr.push(i);
    }
  } else {
    // 현재 페이지가 전체 페이지 수의 반 이하일 경우에는 1부터 pageSize까지의 페이지를 보여준다.
    if (curPage <= Math.round(pageSize / 2)) {
      for (let i = 1; i <= pageSize; i++) {
        arr.push(i);
      }
    } else {
      // 현재 페이지가 전체 페이지 수의 반을 넘을 경우에는 현재 페이지가 가운데가 오도록 보여져야 한다.
      // 즉, 현재 페이지가 6이고, 페이지 사이즈가 5일 경우에는 4 5 6 7 8 이런 식으로 보여져야 한다.
      const halfOfPageSize = Math.round(pageSize / 2) - 1;
      let temp = halfOfPageSize;
      while (temp > 0) {
        arr.push(curPage - temp);
        temp--;
      }
      arr.push(curPage);
      temp = 1;
      while (temp <= halfOfPageSize) {
        let nextPage = curPage + temp;

        // 마지막 페이지라면, 더 이상 진행하지 않고 종료한다.
        if (nextPage === totalPage) {
          break;
        }
        arr.push(nextPage);
        temp++;
      }
    }
  }

  return (
    arr.map((value, index) => (
      <StyledNumber
        style={value === curPage ? {backgroundColor: '#c5f6fa'} : null}
        key={index}
        to={`?page=${value}`}>
        {value}
      </StyledNumber>
    ))
  );
}

export default calculatePage;