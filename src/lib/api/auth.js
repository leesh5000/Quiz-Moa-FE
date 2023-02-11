import client from "./client";
import {setCookie} from "../cookie/CookieUtils";

// 소셜 로그인
export const login = ({oauth2Type, authorizationCode}) =>
  client
    .post("/oauth2/login", {oauth2Type, authorizationCode})
    .then(response => {
      const grantType = response.data.grantType;
      const accessToken = response.data.accessToken;
      const userProfile = response.data.userProfile;

      // 인증 헤더 저장
      client.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

      setCookie('accessToken', accessToken,
        {
          maxAge: response.data.accessTokenExpiresIn,
          path: '/'
        });

      setCookie('refreshToken', response.data.refreshToken,
        {
          maxAge: response.data.refreshTokenExpiresIn,
          path: '/'
        });

      // 로그인 상태 유지를 위해 유저 정보를 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify(userProfile));
    });

export const logout = () => {
  client
    .get("/logout")
    .finally(() => {
      // 서버에서 로그아웃이 실패하더라도 프론트 단에서는 로그아웃 처리
      delete client.defaults.headers.common['Authorization'];
      localStorage.removeItem('user');
    });
}
