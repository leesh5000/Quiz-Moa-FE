import axios from 'axios';
import {getCookie} from "../cookie/CookieUtils";

const client = axios.create();

client.defaults.baseURL = 'http://localhost:8081/dev/api';
// client.defaults.headers.common['Authorization'] = 'Bearer ';

client.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${getCookie('accessToken')}`;
    return config;
  }
)

// 별도로 then, catch 하지 않으면 인터셉터가 처리
client.interceptors.response.use(
  response => {
    return response;
  },
  e => {
    console.log(e.response.data.errorMessage);
    return Promise.reject(e);
  }
);

export default client;