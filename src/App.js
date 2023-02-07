import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import OAuth2RedirectHandler from "./OAuth2RedirectHandler";
import Kakao from "./components/social/Kakao";
import Google from "./components/social/Google";
import Naver from "./components/social/Naver";

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<><Kakao/><Google/><Naver/></>}></Route>
          <Route path={"/"} element={<Google/>}></Route>
          <Route path={"/oauth2/callback/*"} element={<OAuth2RedirectHandler/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
