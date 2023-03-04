import {useState} from "react";
import {SortType} from "../../global/SortType";

function useSort(type) {

  const [sort, setSort] = useState(() => {
    let defaultSort = localStorage.getItem('sort');
    // 만약, 사용자가 악의적으로 LocalStorage의 Sort를 변경하여 Sort Type에 없는 값이 들어가는 경우에는 기본값인 최신순으로 설정한다.
    if (Object.values(SortType).filter(value => value === defaultSort).length === 0) {
      defaultSort = SortType.LATEST;
      localStorage.setItem('sort', defaultSort);
    }
    return defaultSort;
  });

  return [sort, setSort];
}

export default useSort;