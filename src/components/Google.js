export default function () {
  const clientId = "342402058366-uqaknkbu14juso56958312iqoq723n0m.apps.googleusercontent.com";
  const redirectUri = "http://localhost:3000/oauth2/callback/google";
  const googleUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;

  return (
    <div>
      <a href={googleUri}>구글</a>
    </div>
  )
};