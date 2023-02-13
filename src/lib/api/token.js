import client from "./client";

export const tokenRefresh = () => {
  return client
    .post("/access-token/refresh")
    .then(response => {
      // 만료되더라도, 유지를 위해 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.accessToken);
      return response.accessToken;
    });
}