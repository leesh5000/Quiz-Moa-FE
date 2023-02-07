export default function () {
  const clientId = "g9kUOaGUwAIFWV5mbw2w";
  const redirectUri = "http://localhost:3000/oauth2/callback/naver";
  const naverUri = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=QUIZ_APP_TEST`;

  return (
    <div>
      <a href={naverUri}>네이버</a>
    </div>
  )
};