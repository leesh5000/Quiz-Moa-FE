import axios from 'axios';
import {tokenRefresh} from "./token";
import {getCookie} from "../cookie/CookieUtils";

const client = axios.create();

client.defaults.baseURL = 'http://localhost:8081/dev/api';

export const setUpInterceptors = (navigate) => {

  client.interceptors.request.use(config => {

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
            delete client.defaults.headers.common['Authorization'];
            localStorage.removeItem('accessToken');
            navigate('/login', {
              state: {
                error: '로그인 정보가 만료되었습니다.',
              }
            });
          });

        // 실패했던 요청을 다시 요청한다.
        const originalRequest = e.config;
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
        return axios(originalRequest);
      }

      if (e.response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/login', {
          state: {
            error: '로그인 후 이용해주세요.'
          }
        });
      }

      return Promise.reject(e);
    }
  );

}

export default client;