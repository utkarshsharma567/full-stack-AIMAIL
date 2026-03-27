import axios from "axios";

//DEPLOY:
// const api = axios.create({
//     baseURL:import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"
// });

const api = axios.create({
    baseURL: 'https://full-stack-aimail.onrender.com/api' 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
