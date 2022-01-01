import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { "Access-Control-Allow-Origin": "*"}
});

export default instance;
