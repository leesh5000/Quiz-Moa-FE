import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = 'http://localhost:8081/dev/api';
client.defaults.headers.common['Authorization'] = 'Bearer ';

// axios.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

export default client;