import { useState } from 'react';
import axios from 'axios';
import AvatarCreator from './AvatarCreator';

export default function OnboardingForm({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [heightCm, setHeightCm] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [bodyType, setBodyType] = useState('AVERAGE');
    const [preferredStyle, setPreferredStyle] = useState('casual');
    const [locationCity, setLocationCity] = useState(
    localStorage.getItem('signupCity') || ''
     );
    const [gender, setGender] = useState('MALE');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getEmail = () => {
        if (user?.email) return user.email;
        try {
            const saved = localStorage.getItem('user');
            if (saved) {
                return JSON.parse(saved)?.email || '';
            }
        } catch (e) {}
        return '';
    };

    const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!locationCity.trim()) {
        alert('📍 Please enter your city! This is needed for weather-based outfit suggestions.');
        return;
    }
    setStep(2);
};

    const handleAvatarCreated = (url) => {
        setAvatarUrl(url);
        setStep(3);
    };

    const handleFinalSubmit = async () => {
    setLoading(true);
    setError('');
    const email = getEmail();

    if (!email) {
        setError('Email not found! Please login again.');
        setLoading(false);
        return;
    }

    try {
        await axios.post(
            'http://localhost:8080/api/profile/onboard',
            {
                email: email,
                heightCm: parseFloat(heightCm),
                weightKg: parseFloat(weightKg),
                bodyType: bodyType,
                preferredStyle: preferredStyle,
                locationCity: locationCity || '',
                gender: gender,
                avatarUrl: 'local'
            }
        );
    } catch (err) {
        console.error('Save error:', err);
        // Don't show error — just continue to dashboard
    }

    // Always go to dashboard regardless of save result
    onComplete({
        heightCm: parseFloat(heightCm),
        weightKg: parseFloat(weightKg),
        gender: gender,
        avatarUrl: avatarUrl || '/models/avatar.glb'
    });

    setLoading(false);
};

    const ProgressBar = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '25px'
        }}>
            {[1, 2, 3].map(s => (
                <div key={s} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        backgroundColor: step >= s ? '#6366f1' : '#ddd',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        {step > s ? '✓' : s}
                    </div>
                    {s < 3 && (
                        <div style={{
                            width: '40px',
                            height: '3px',
                            backgroundColor: step > s
                                ? '#6366f1' : '#ddd',
                            borderRadius: '2px'
                        }} />
                    )}
                </div>
            ))}
        </div>
    );

    if (step === 1) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    width: '450px'
                }}>
                    <ProgressBar />
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '5px',
                        color: '#333'
                    }}>
                        📋 Your Details
                    </h2>
                    <p style={{
                        textAlign: 'center',
                        color: '#888',
                        fontSize: '13px',
                        marginBottom: '20px'
                    }}>
                        Logged in as: <strong>{getEmail()}</strong>
                    </p>

                    <form onSubmit={handleStep1Submit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                🧍 Gender
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                📏 Height (cm)
                            </label>
                            <input
                                type="number"
                                value={heightCm}
                                onChange={(e) => setHeightCm(e.target.value)}
                                required
                                min="100"
                                max="250"
                                placeholder="e.g. 175"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                ⚖️ Weight (kg)
                            </label>
                            <input
                                type="number"
                                value={weightKg}
                                onChange={(e) => setWeightKg(e.target.value)}
                                required
                                min="30"
                                max="300"
                                placeholder="e.g. 70"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                🧍 Body Type
                            </label>
                            <select
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="SLIM">Slim</option>
                                <option value="AVERAGE">Average</option>
                                <option value="ATHLETIC">Athletic</option>
                                <option value="PLUS">Plus</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                👔 Preferred Style
                            </label>
                            <select
                                value={preferredStyle}
                                onChange={(e) =>
                                    setPreferredStyle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="streetwear">Streetwear</option>
                                <option value="sporty">Sporty</option>
                                <option value="traditional">Traditional</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '5px',
                                color: '#555',
                                fontWeight: 'bold'
                            }}>
                                📍 Your City
                            </label>
                            <input
                             type="text"
                              value={locationCity}
                              onChange={(e) =>
                                setLocationCity(e.target.value)}
                                  required
                                   placeholder="e.g. Hyderabad"
                                     style={{
                                  width: '100%',
                              padding: '10px',
                              border: '1px solid #ddd',
                                borderRadius: '5px',
                                 fontSize: '16px',
                                 boxSizing: 'border-box'
                                }}
                                />
                        </div>

                        <button
                            type="submit"
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
                            Next — Create Avatar →
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    <ProgressBar />
                    <p style={{
                        textAlign: 'center',
                        color: '#666',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        Step 2 of 3 — Create your personalized avatar
                    </p>
                    <AvatarCreator
                        gender={gender}
                        onAvatarCreated={handleAvatarCreated}
                    />
                    <div style={{
                        textAlign: 'center',
                        marginTop: '15px'
                    }}>
                        <button
                            onClick={() => setStep(1)}
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #6366f1',
                                color: '#6366f1',
                                padding: '8px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    width: '450px',
                    textAlign: 'center'
                }}>
                    <ProgressBar />
                    <h2 style={{
                        color: '#333',
                        marginBottom: '10px'
                    }}>
                        🎉 Avatar Created!
                    </h2>
                    <p style={{
                        color: '#666',
                        marginBottom: '25px'
                    }}>
                        Step 3 of 3 — Your avatar is ready!
                    </p>

                    <div style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        padding: '15px',
                        marginBottom: '25px',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: '8px 0', color: '#555' }}>
                            🧍 Gender: <strong>{gender}</strong>
                        </p>
                        <p style={{ margin: '8px 0', color: '#555' }}>
                            📏 Height: <strong>{heightCm} cm</strong>
                        </p>
                        <p style={{ margin: '8px 0', color: '#555' }}>
                            ⚖️ Weight: <strong>{weightKg} kg</strong>
                        </p>
                        <p style={{ margin: '8px 0', color: '#555' }}>
                            👔 Style: <strong>{preferredStyle}</strong>
                        </p>
                        <p style={{ margin: '8px 0', color: '#555' }}>
                            📍 City: <strong>
                                {locationCity || 'Not set'}
                            </strong>
                        </p>
                        <p style={{ margin: '8px 0', color: '#28a745' }}>
                            ✅ 3D Avatar: <strong>Created!</strong>
                        </p>
                        <p style={{
                            margin: '8px 0',
                            color: '#888',
                            fontSize: '12px'
                        }}>
                            📧 Email: {getEmail()}
                        </p>
                    </div>

                    {error && (
    <div style={{
        backgroundColor: '#fff0f0',
        border: '1px solid #ffcccc',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '15px',
        textAlign: 'center'
    }}>
        <p style={{
            color: '#cc0000',
            margin: 0,
            fontSize: '14px',
            fontWeight: 'bold'
        }}>
            ❌ Something went wrong!
        </p>
        <p style={{
            color: '#666',
            margin: '5px 0 0',
            fontSize: '12px'
        }}>
            Please try again or contact support.
        </p>
    </div>
)}

                    <button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        {loading ? 'Saving...' : '🚀 Go to Dashboard!'}
                    </button>

                    <button
                        onClick={() => setStep(2)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: '1px solid #6366f1',
                            color: '#6366f1',
                            borderRadius: '5px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Recreate Avatar
                    </button>
                </div>
            </div>
        );
    }
}