import client from "./client";

export const getProfile = (email) => {
  return client
    .get(`/users/${email}`)
    .then(response => {
      return response;
    });
}