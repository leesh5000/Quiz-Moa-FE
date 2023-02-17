import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function (SpecificComponent) {

    const navigate = useNavigate();

    function AuthenticationCheck(props) {

      let user = JSON.parse(localStorage.getItem('user'));

      useEffect(() => {
        if (!user) {
          navigate('/login');
        }
      }, []);

      const onLogout = () => {
        user = null;
        navigate('/login');
      }

      return <SpecificComponent {...props} user={user} onLogout={onLogout}/>;
    }

    return AuthenticationCheck;
}
