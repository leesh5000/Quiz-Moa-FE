import './App.css';
import {Route, Routes} from "react-router-dom";
import QuizListPage from "./pages/QuizListPage";
import OAuth2RedirectHandler from "./components/social/OAuth2RedirectHandler";
import PostQuizPage from "./pages/PostQuizPage";
import Home from "./pages/Home";
import QuizDetailPage from "./pages/QuizDetailPage";
import LoginPage from "./pages/LoginPage";
import Auth from "./lib/hoc/Auth";

function App() {

  const AuthPostQuizPage = Auth(PostQuizPage);

  return (
    <Routes>
      <Route path="/quizzes" element={<QuizListPage/>} />
      <Route path="/quizzes?page=:page" element={<QuizListPage/>}/>
      <Route path="/quizzes/:id" element={<QuizDetailPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/oauth2/callback/*" element={<OAuth2RedirectHandler/>}/>
      <Route path="/post" element={<AuthPostQuizPage/>}/>
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App;
