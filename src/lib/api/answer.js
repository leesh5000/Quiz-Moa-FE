import client from "./client";

export const createAnswer = (quizId, contents) => {
  return client
    .post(`/quizzes/${quizId}/answers`, {contents})
    .then((response) => {
      return response;
    });
};

export const editAnswer = (userId, answerId, contents) => {
  return client
    .put(`/users/${userId}/answers/${answerId}`, {contents})
    .then((response) => {
      return response;
    });
}

export const deleteAnswer = (userId, answerId) => {
  return client
    .delete(`/users/${userId}/answers/${answerId}`)
    .then((response) => {
      return response;
    });
}