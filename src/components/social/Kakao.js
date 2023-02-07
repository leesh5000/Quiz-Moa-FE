export default function () {
  const clientId = "628ed7ebd5ae9ca490639c88d1ff40fe";
  const redirectUri = "http://localhost:3000/oauth2/callback/kakao";
  const kakaoUri = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

  return (
    <div>
      <a href={kakaoUri}>카카오</a>
    </div>
  )
};