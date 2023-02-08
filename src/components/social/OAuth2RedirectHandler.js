import React from "react";
import axios from "axios";

const OAuth2RedirectHandler = () => {

  const baseRedirectUri = "http://localhost:3000/oauth2/callback/";

  let string = window.location.href.split("?")[0];
  let provider = string.substring(baseRedirectUri.length);
  let authorizationCode = new URL(window.location.href).searchParams.get("code");

  const url = "http://localhost:8081/dev/api/oauth2/login";

  axios.post(url, {
    'oauth2Type' : provider,
    'authorizationCode' : authorizationCode
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => {
      // 성공 처리
      console.log(res);
    }).catch(err => {
    // 에러 처리
    //console.log(err.response.data.message); --> 서버단 에러메세지 출력~
  });

  return (
    <div>
      <div>{authorizationCode}</div>
      <div>{string}</div>
      <div>{provider}</div>
    </div>
  )
};

export default OAuth2RedirectHandler;