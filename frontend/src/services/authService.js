import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const signup = async (email, password, fullName) => {
    const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        fullName
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = { signup, login, logout, getCurrentUser };
export default authService;