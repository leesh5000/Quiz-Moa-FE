import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = 'http://localhost:8081/dev/api';
// client.defaults.headers.common['Authorization'] = 'Bearer ';

// 별도로 then, catch 하지 않으면 인터셉터가 처리
// client.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

export default client;