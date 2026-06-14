import { useState } from 'react';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import OnboardingForm from './components/onboarding/OnboardingForm';
import DashboardLayout from './components/dashboard/DashboardLayout';

export default function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setPage('onboarding');
    };

    const handleOnboardingComplete = () => {
        setPage('dashboard');
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
            {page === 'onboarding' && (
                <OnboardingForm
                    user={user}
                    onComplete={handleOnboardingComplete}
                />
            )}
            {page === 'dashboard' && (
                <DashboardLayout user={user} />
            )}
        </div>
    );
}