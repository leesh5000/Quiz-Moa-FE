import client from "./client";

export const createQuiz = ({title, contents}) => {
  return client
    .post("/quizzes", {title, contents})
    .then((response) => {
      return response;
    });
};

export const getQuizzes = ({page, size, sort}) => {

  return client
    .get("/quizzes", {params: {page, size}})
    .then((response) => {
      return response;
    });
}

export const getQuizDetails = (quizId) => {
  return client
    .get(`/quizzes/${quizId}`)
    .then((response) => {
      return response;
    });
}