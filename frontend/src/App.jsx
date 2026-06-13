import { useState } from 'react';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';

export default function App() {
    const [page, setPage] = useState('login');

    return (
        <div>
            {page === 'login'
                ? <LoginForm onSwitchToSignup={() => setPage('signup')} />
                : <SignupForm onSwitchToLogin={() => setPage('login')} />
            }
        </div>
    );
}