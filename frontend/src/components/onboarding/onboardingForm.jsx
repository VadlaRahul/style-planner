import { useState } from 'react';
import axios from 'axios';

export default function OnboardingForm({ user, onComplete }) {
    const [heightCm, setHeightCm] = useState('');
    const [weightKg, setWeightKg] = useState('');
    const [bodyType, setBodyType] = useState('AVERAGE');
    const [preferredStyle, setPreferredStyle] = useState('casual');
    const [locationCity, setLocationCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8080/api/profile/onboard', {
                email: user.email,
                heightCm: parseFloat(heightCm),
                weightKg: parseFloat(weightKg),
                bodyType,
                preferredStyle,
                locationCity
            });
            alert('Profile saved successfully!');
            onComplete();
        } catch (err) {
            setError('Failed to save profile! Please try again.');
        }
        setLoading(false);
    };

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
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '10px',
                    color: '#333'
                }}>
                    👗 Complete Your Profile
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '25px'
                }}>
                    Help us build your perfect 3D avatar!
                </p>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Height */}
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

                    {/* Weight */}
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

                    {/* Body Type */}
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

                    {/* Preferred Style */}
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
                            onChange={(e) => setPreferredStyle(e.target.value)}
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

                    {/* City */}
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
                            onChange={(e) => setLocationCity(e.target.value)}
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
                        {loading ? 'Saving...' : 'Complete Profile →'}
                    </button>
                </form>
            </div>
        </div>
    );
}