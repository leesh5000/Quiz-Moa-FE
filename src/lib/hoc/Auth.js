import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import getLoginUser from "../utils/getLoginUser";
import Swal from "sweetalert2";

export default function (SpecificComponent) {

    const navigate = useNavigate();

    function AuthenticationCheck(props) {

      let user = getLoginUser();

      useEffect(() => {
        if (!user) {
          Swal.fire({
            icon: 'warning',
            position: 'center',
            title: '로그인 후 이용 가능한 서비스입니다.'
          })
          navigate('/login');
        }
      }, []);

      const onLogout = () => {
        Swal.fire({
          icon: 'warning',
          position: 'center',
          title: '로그인 후 이용 가능한 서비스입니다.'
        })
        user = null;
        navigate('/login');
      }

      return <SpecificComponent {...props} user={user} onLogout={onLogout}/>;
    }

    return AuthenticationCheck;
}
