import client from "./client";

export const createQuiz = ({title, contents}) => {
  return client
    .post("/quizzes", {title, contents})
    .then((response) => {
      return response;
    });
};

export const editQuiz = ({userId, quizId, title, contents}) => {
  return client
    .put(`/users/${userId}/quizzes/${quizId}`, {title, contents})
    .then((response) => {
      return response;
    });
}

export const deleteQuiz = (userId, quizId) => {
  return client
    .delete(`/users/${userId}/quizzes/${quizId}`)
    .then((response) => {
      return response;
    });
}

export const getQuizzes = ({page, size, sort}) => {

  return client
    .get("/quizzes", {params: {page, size, sort}})
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

export const voteQuiz = (quizId, value) => {
  return client
    .post(`/quizzes/${quizId}/votes`, {value})
    .then((response) => {
      return response;
    });
}