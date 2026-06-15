import { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import OnboardingForm from './components/onboarding/OnboardingForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import authService from './services/authService';

export default function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser && savedUser.email) {
            setUser(savedUser);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        console.log('Login success:', userData);
        console.log('Email:', userData.email);
        setUser(userData);
        setPage('onboarding');
    };

    const handleOnboardingComplete = (profileData) => {
    console.log('Profile data received:', profileData);
    console.log('Avatar URL:', profileData.avatarUrl);
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    setPage('dashboard');
};

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setPage('login');
    };

    return (
        <div>
            {page === 'login' && (
                <LoginForm
                    onSwitchToSignup={() => setPage('signup')}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
            {page === 'signup' && (
                <SignupForm
                    onSwitchToLogin={() => setPage('login')}
                />
            )}
            {page === 'onboarding' && user && (
                <OnboardingForm
                    user={user}
                    onComplete={handleOnboardingComplete}
                />
            )}
            {page === 'dashboard' && (
                <DashboardLayout
                    user={user}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}