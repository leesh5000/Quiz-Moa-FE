import './App.css';
import {Route, Routes} from "react-router-dom";
import QuizListPage from "./pages/quiz/QuizListPage";
import OAuth2RedirectHandler from "./components/social/OAuth2RedirectHandler";
import PostQuizPage from "./pages/post/PostQuizPage";
import Home from "./pages/Home";
import QuizDetailPage from "./pages/quiz/QuizDetailPage";
import LoginPage from "./pages/LoginPage";
import Auth from "./lib/hoc/Auth";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserQuizListPage from "./pages/user/UserQuizListPage";
import UserAnswerListPage from "./pages/user/UserAnswerListPage";

function App() {

  const AuthPostQuizPage = Auth(PostQuizPage);
  const AuthUserProfilePage = Auth(UserProfilePage);
  const AuthQuizListPage = Auth(UserQuizListPage);
  const AuthAnswerListPage = Auth(UserAnswerListPage);

  return (
    <Routes>
      <Route path="/quizzes" element={<QuizListPage/>} />
      <Route path="/quizzes?page=:page" element={<QuizListPage/>}/>
      <Route path="/quizzes/:id" element={<QuizDetailPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/oauth2/callback/*" element={<OAuth2RedirectHandler/>}/>
      <Route path="/post" element={<AuthPostQuizPage/>}/>
      <Route path="/users/:email" element={<AuthUserProfilePage/>} />
      <Route path="/users/:email/quizzes" element={<AuthQuizListPage/>} />
      <Route path="/users/:email/answers" element={<AuthAnswerListPage/>} />
      <Route path="/*" element={<Home />} />
    </Routes>
  )
}

export default App;
