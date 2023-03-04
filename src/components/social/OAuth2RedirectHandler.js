import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {login} from "../../lib/api/auth";
import Spinner from "../common/Spinner";

const OAuth2RedirectHandler = () => {

  const [loading, setLoading] = useState(false);
  const baseRedirectUri = process.env.REACT_APP_BASE_REDIRECT_URI;

  const string = window.location.href.split("?")[0];
  // * 으로 매핑된 Provider 정보 가져오기
  const oauth2Type = string.substring(baseRedirectUri.length);
  const authorizationCode = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const socialLogin = async ({oauth2Type, authorizationCode}) => {
      try {
        setLoading(true);

        await login({oauth2Type, authorizationCode});

        // 만약, 이전페이지가 있다면, 그곳으로 이동한다.
        if (localStorage.getItem('from')) {
          const from = localStorage.getItem('from');
          navigate(from, {
            replace: true
          });
          localStorage.removeItem('from');
          return;
        }

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

    socialLogin({oauth2Type, authorizationCode});

  }, []);

  if (loading) {
    return <Spinner/>;
  }

};

export default OAuth2RedirectHandler;