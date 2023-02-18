import client from "./client";
import {setCookie} from "../cookie/CookieUtils";

// 소셜 로그인
export const login = ({oauth2Type, authorizationCode}) => {
  return client
    .post("/oauth2/login", {oauth2Type, authorizationCode})
    .then(response => {
      const accessToken = response.accessToken;

      // 유저 정보 저장을 위해 localStorage에 저장
      localStorage.setItem('accessToken', accessToken);

      setCookie('refreshToken', response.refreshToken,
        {
          maxAge: response.refreshTokenExpiresIn,
          path: '/'
        });

    });
};

export const logout = () => {
  client
    .get("/logout")
    .finally(() => {
      // 서버에서 로그아웃이 실패하더라도 프론트 단에서는 로그아웃 처리
      delete client.defaults.headers.common['Authorization'];
      localStorage.removeItem('accessToken');
    });
}
