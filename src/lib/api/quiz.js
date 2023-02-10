import client from "./client";

export const createQuiz = ({title, contents}) => {
  client
    .post("/api/quizzes", {title, contents})
    .then((response) => {
      console.log(response.data.createQuizId);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const getQuizzes = ({page, size}) => {

  return client.get("/quizzes", {params: {page, size}})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}