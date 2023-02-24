import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import getLoginUser from "../utils/getLoginUser";
import Swal from "sweetalert2";

export default function (SpecificComponent) {

    function AuthenticationCheck(props) {

      const navigate = useNavigate();
      let user = getLoginUser();

      useEffect(() => {
        if (!user) {
          Swal.fire({
            icon: 'warning',
            position: 'center',
            title: '로그인 후 이용 가능한 서비스입니다.'
          })
          navigate(-1, {
            replace: true
          });
          return;
        }

      }, []);

      const onLogout = () => {
        Swal.fire({
          icon: 'warning',
          position: 'center',
          title: '로그인 후 이용 가능한 서비스입니다.'
        })
        user = null;
        localStorage.removeItem('username');
        navigate('/login', {
          replace: true
        });
      }

      if (!user) return null;

      return <SpecificComponent {...props} user={user} onLogout={onLogout}/>;
    }

    return AuthenticationCheck;
}
