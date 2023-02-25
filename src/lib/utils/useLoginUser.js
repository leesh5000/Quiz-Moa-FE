import {useEffect, useState} from "react";
import getLoginUser from "./getLoginUser";

export const useLoginUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let loginUser = getLoginUser();
    setUser(loginUser);
  }, []);
  return [user, setUser];
}