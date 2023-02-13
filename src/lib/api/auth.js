import client from "./client";
import {setCookie} from "../cookie/CookieUtils";

// 소셜 로그인
export const login = ({oauth2Type, authorizationCode}) => {
  client
    .post("/oauth2/login", {oauth2Type, authorizationCode})
    .then(response => {
      const accessToken = response.accessToken;
      const userProfile = response.userProfile;

      // 만료되더라도, 유지를 위해 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);

      setCookie('refreshToken', response.refreshToken,
        {
          maxAge: response.refreshTokenExpiresIn,
          path: '/'
        });

      // 로그인 상태 유지를 위해 유저 정보를 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify(userProfile));
    });
}

export const logout = () => {
  client
    .get("/logout")
    .finally(() => {
      // 서버에서 로그아웃이 실패하더라도 프론트 단에서는 로그아웃 처리
      delete client.defaults.headers.common['Authorization'];
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    });
}
