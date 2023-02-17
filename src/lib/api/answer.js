import client from "./client";

export const createAnswer = (quizId, contents) => {
  return client
    .post(`/quizzes/${quizId}/answers`, contents)
    .then((response) => {
      return response;
    });
};