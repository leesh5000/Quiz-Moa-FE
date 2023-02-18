import axios from 'axios';
import {tokenRefresh} from "./token";
import {getCookie} from "../cookie/CookieUtils";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {logout} from "./auth";

const client = axios.create();

client.defaults.baseURL = 'http://localhost:8081/dev/api';

client.interceptors.request.use(
  config => {

    // 토큰 갱신 요청은 헤더에 refresh 토큰을 담아 보낸다.
    if (config.url === '/access-token/refresh') {
      let refreshToken = getCookie('refreshToken');
      config.headers.Authorization = `Bearer ${refreshToken}`;
      return config;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
)

// 별도로 then, catch 하지 않으면 인터셉터가 처리
client.interceptors.response.use(
  response => {
    return response.data;
  },
  async e => {

    const error = e.response.data;

    // 만약 만료된 토큰으로 요청 시, 토큰을 갱신하고 재 요청한다.
    if (error.errorCode === 'A-001') {
      await tokenRefresh()

        // 토큰 갱신 요청도 실패하면, 갱신 토큰이 만료된 것이므로 로그아웃 처리한다.
        .catch(e => {
          console.log("token refresh failed = " + e);
          Swal.fire({
            icon: 'error',
            position: 'center',
            title: '로그인이 만료되었습니다. 다시 로그인해주세요.'
          })
          delete client.defaults.headers.common['Authorization'];
          localStorage.removeItem('accessToken');
          const navigate = useNavigate();
          navigate('/', {
            replace: true
          });
        });

      // 실패했던 요청을 다시 요청한다.
      const originalRequest = e.config;
      originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
      return axios(originalRequest);
    }

    // 403 에러인 경우는, 유저가 악의적으로 LocalStorage의 유저 정보를 변경한 것이므로 로그아웃 처리한다.
    if (e.response.status === 403) {
      await Swal.fire({
        icon: 'warning',
        position: 'center',
        title: '해당 리소스에 접근할 수 없는 유저입니다. <br> 재 로그인 후 다시 시도 해주세요.'
      });
      logout();
    }

    return Promise.reject(e);
  }
);

export default client;