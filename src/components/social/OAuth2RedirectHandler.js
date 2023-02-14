import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../lib/api/auth";
import Spinner from "../common/Spinner";

const OAuth2RedirectHandler = () => {

  const [loading, setLoading] = useState(false);
  const baseRedirectUri = "http://localhost:3000/oauth2/callback/";

  const string = window.location.href.split("?")[0];
  // * 으로 매핑된 Provider 정보 가져오기
  const oauth2Type = string.substring(baseRedirectUri.length);
  const authorizationCode = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {

    const socialLogin = async ({oauth2Type, authorizationCode}) => {
      try {
        setLoading(true);
        await login({oauth2Type, authorizationCode});
        navigate('/', {
          replace: true
        });
      } catch (e) {
        navigate('/login', {
          replace: true,
          state: {
            error: e.response.data.errorMessage
          }
        });
      }
      setLoading(false);
    };

    socialLogin({oauth2Type, authorizationCode}).then();
  }, []);

  if (loading) {
    return <Spinner/>;
  }

};

export default OAuth2RedirectHandler;