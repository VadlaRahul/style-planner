import { useState } from 'react';
import authService from '../../services/authService';

export default function SignupForm({ onSwitchToLogin }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.signup(email, password, fullName);
            alert('Account created successfully! Please login.');
            onSwitchToLogin();
        } catch (err) {
            setError('Signup failed! Email may already exist.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '400px'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    👗 StylePlanner Signup
                </h2>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}

                <form onSubmit={handleSignup}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#555'
                        }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#555'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#555'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '15px', color: '#555' }}>
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#6366f1',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}