import client from "./client";

export const getProfile = (email) => {
  return client
    .get(`/users/${email}`)
    .then(response => {
      return response;
    });
}

export const getUserQuizzes = (userId, {page, size, sort}) => {
  return client
    .get(`/users/${userId}/quizzes`, {params: {page, size, sort}})
    .then(response => {
      return response;
    });
}

export const getUserAnswers = (userId, {page, size, sort}) => {
  return client
    .get(`/users/${userId}/answers`, {params: {page, size, sort}})
    .then(response => {
      return response;
    })
}