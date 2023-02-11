import {Cookies} from 'react-cookie';

const cookie = new Cookies()

export const setCookie = (key, value, option) => {
  return cookie.set(key, value, {...option});
}

export const getCookie = (key) => {
  return cookie.get(key);
}