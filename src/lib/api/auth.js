import client from "./client";

// 소셜 로그인
export const login = ({oauth2Type, authorizationCode}) =>
  client
    .post("/oauth2/login", {oauth2Type, authorizationCode})
    .then(response => {
      const grantType = response.data.grantType;
      const accessToken = response.data.accessToken;
      const userProfile = response.data.userProfile;

      // 인증 헤더 설정
      client.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

      // 로그인 상태 유지를 위해 유저 정보를 로컬 스토리지에 저장
      localStorage.setItem('user', JSON.stringify(userProfile));
    })
    .catch((e) => {
      throw e;
    });

export const logout = () => {
  client
    .get("/logout")
    .then(() => {
      // 인증 헤더 삭제
      delete client.defaults.headers.common['Authorization'];
    })
    .catch((e) => {
      console.log("logout failed : " + e);
      // 유저 정보 삭제
      localStorage.removeItem('user');
    });
}
