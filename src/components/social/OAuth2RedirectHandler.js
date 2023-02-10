import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../lib/api/auth";

const OAuth2RedirectHandler = () => {

  const baseRedirectUri = "http://localhost:3000/oauth2/callback/";

  const string = window.location.href.split("?")[0];
  // * 으로 매핑된 Provider 정보 가져오기
  const oauth2Type = string.substring(baseRedirectUri.length);
  const authorizationCode = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    login({oauth2Type, authorizationCode})
      .then(() => {
        navigate('/', {
          replace: true,
          state: {
            success: true,
          }
        });
      }).catch((e) => {
        console.log("소셜 로그인 실패", e);
        navigate('/login', {
          replace: true,
          state: {
            success: false,
          }
        });
      });
  }, []);
};

export default OAuth2RedirectHandler;