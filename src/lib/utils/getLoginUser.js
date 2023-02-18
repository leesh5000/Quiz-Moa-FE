import jwt_decode from "jwt-decode";

function getLoginUser() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    return jwt_decode(accessToken);
  } catch (e) {
    return null;
  }
}

export default getLoginUser;