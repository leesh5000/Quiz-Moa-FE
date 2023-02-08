import naver from "../../images/naver.png";

export default function Naver () {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI;
  const naverUri = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=QUIZ_APP_TEST`;

  return (
    <div>
      <a href={naverUri}>
        <img src={naver} alt="naver"/>
      </a>
    </div>
  )
};