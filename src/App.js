import './App.css';
import {Route, Routes} from "react-router-dom";
import QuizListPage from "./components/pages/QuizListPage";
import LoginPage from "./components/pages/LoginPage";
import OAuth2RedirectHandler from "./components/social/OAuth2RedirectHandler";
import PostQuizPage from "./components/pages/PostQuizPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<QuizListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback/*" element={<OAuth2RedirectHandler/>}></Route>
      <Route path="/post" element={<PostQuizPage/>} />
    </Routes>
  )
}

export default App;
