import {useEffect, useState} from "react";
import getLoginUser from "./getLoginUser";

export const useLoginUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(getLoginUser());
  }, []);
  return [user, setUser];
}