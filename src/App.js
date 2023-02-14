import './App.css';
import {Route, Routes} from "react-router-dom";
import QuizListPage from "./components/pages/QuizListPage";
import LoginPage from "./components/pages/LoginPage";
import OAuth2RedirectHandler from "./components/social/OAuth2RedirectHandler";
import PostQuizPage from "./components/pages/PostQuizPage";
import Home from "./components/pages/Home";
import QuizDetailPage from "./components/pages/QuizDetailPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quizzes" element={<QuizListPage />} />
      <Route path="/quizzes?page=:page" element={<PostQuizPage/>} />
      <Route exact path="/quizzes/:id" element={<QuizDetailPage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback/*" element={<OAuth2RedirectHandler/>}></Route>
      <Route path="/post" element={<PostQuizPage/>} />
    </Routes>
  )
}

export default App;
