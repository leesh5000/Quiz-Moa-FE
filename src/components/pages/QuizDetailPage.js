import Header from "../common/Header";
import {useEffect, useState} from "react";
import {getQuizDetails} from "../../lib/api/quiz";
import {useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import Spinner from "../common/Spinner";
import Responsive from "../common/Responsive";
import styled from "styled-components";

const QuizTitleStyle = styled.div`
  
  height: 4rem;
  margin-top: 7rem;
  background-color: blueviolet;
  
`;

const QuizDetailPage = () => {

  console.log('QuizDetailPage rendering...');

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const id = useParams().id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetails = async () => {

      try {
        setLoading(true);
        const response = await getQuizDetails(id);
        setQuiz(response);
        console.log(response);
      } catch (e) {
        console.log(e);
        await Swal.fire({
          icon: 'warning',
          title: '퀴즈 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        })
        navigate('/quizzes');
      }

      setLoading(false);
    }

    fetchQuizDetails();

  }, []);

  if (loading) {
    return <Spinner/>
  }

  if (!quiz) {
    return null;
  }

  return (
    <>
      <Header/>
      <Responsive>
        <QuizTitleStyle>
          {quiz.title}
        </QuizTitleStyle>
      </Responsive>
    </>
  )
}

export default QuizDetailPage