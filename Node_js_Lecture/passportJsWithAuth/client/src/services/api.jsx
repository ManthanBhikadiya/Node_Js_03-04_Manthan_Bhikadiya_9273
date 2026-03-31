import axios from 'axios';

const API = axios.create({
    baseUrl: "http://localhost:3002/api",
    headers: { 'content-type': "application/json" }
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Breaer ${token}`;
    }

    return config
})

export default API