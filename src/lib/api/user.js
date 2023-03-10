import client from "./client";

export const getProfile = (userId) => {
  return client
    .get(`/users/${userId}`)
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

export const updateUsername = (userId, {value}) => {
  return client
    .patch(`/users/${userId}`, {username: value})
    .then(response => {
      return response;
    });
}

export const deleteUser = (userId) => {
  return client
    .delete(`/users/${userId}`)
    .then(response => {
      return response;
    })
}