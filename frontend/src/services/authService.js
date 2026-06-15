import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const signup = async (email, password, fullName) => {
    const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        fullName
    });
    if (response.data.token) {
        const userData = {
            ...response.data,
            email: email,
            fullName: fullName
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password
    });
    if (response.data.token) {
        const userData = {
            ...response.data,
            email: email,
            fullName: response.data.fullName || email
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const authService = { signup, login, logout, getCurrentUser };
export default authService;