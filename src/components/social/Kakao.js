import kakao from "../../images/kakao.png";

export default function Kakao () {
  const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  const kakaoUri = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  return (
    <div>
      <a href={kakaoUri}>
        <img src={kakao} alt="kakao"/>
      </a>
    </div>
  )
};