import client from "./client";

export const createQuiz = ({title, contents}) => {
  client
    .post("/quizzes", {title, contents})
    .then((response) => {
      console.log("post success, created post id = " + response.data.createQuizId);
      return response.data.createQuizId;
    });
}

export const getQuizzes = ({page, size}) => {

  return client.get("/quizzes", {params: {page, size}})
    .then((response) => {
      return response.data;
    });
}