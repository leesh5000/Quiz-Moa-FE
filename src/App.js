import './App.css';
import {Route, Routes} from "react-router-dom";
import QuizListPage from "./components/pages/QuizListPage";
import LoginPage from "./components/pages/LoginPage";
import WritePage from "./components/pages/WritePage";
import QuizDetailPage from "./components/pages/QuizDetailPage";
import OAuth2RedirectHandler from "./components/social/OAuth2RedirectHandler";

function App() {

  return (
    <Routes>
      <Route path="/" element={<QuizListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/:quizId" element={<QuizDetailPage />} />
      <Route path="/oauth2/callback/*" element={<OAuth2RedirectHandler/>}></Route>
    </Routes>
  )
}

export default App;
