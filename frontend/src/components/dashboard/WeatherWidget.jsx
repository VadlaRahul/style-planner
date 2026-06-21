import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherWidget({ city }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

        useEffect(() => {
    console.log('WeatherWidget city prop:', city);
    const fetchWeather = async () => {
        if (!city) {
            console.log('No city provided to weather widget');
            setLoading(false);
            setError(true);
            return;
        }
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/weather/current?city=${city}`
                );
                setWeather(response.data);
            } catch (err) {
                console.error('Weather error:', err);
                setError(true);
            }
            setLoading(false);
        };
        fetchWeather();
    }, [city]);

    const getWeatherEmoji = (condition) => {
        const c = condition?.toLowerCase() || '';
        if (c.includes('clear')) return '☀️';
        if (c.includes('cloud')) return '☁️';
        if (c.includes('rain')) return '🌧️';
        if (c.includes('thunder')) return '⛈️';
        if (c.includes('snow')) return '❄️';
        if (c.includes('mist') || c.includes('fog')) return '🌫️';
        return '🌤️';
    };

    if (loading) {
        return (
            <div style={{
                backgroundColor: '#0f3460',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                marginBottom: '15px'
            }}>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    ⏳ Loading weather...
                </p>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div style={{
                backgroundColor: '#0f3460',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                marginBottom: '15px'
            }}>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                    📍 Set your city to see weather
                </p>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '15px',
            color: 'white'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        opacity: 0.9
                    }}>
                        📍 {weather.city}
                    </p>
                    <p style={{
                        margin: '4px 0 0',
                        fontSize: '28px',
                        fontWeight: 'bold'
                    }}>
                        {Math.round(weather.temp)}°C
                    </p>
                    <p style={{
                        margin: '2px 0 0',
                        fontSize: '12px',
                        opacity: 0.9,
                        textTransform: 'capitalize'
                    }}>
                        {weather.description}
                    </p>
                </div>
                <div style={{ fontSize: '48px' }}>
                    {getWeatherEmoji(weather.condition)}
                </div>
            </div>
            <p style={{
                margin: '8px 0 0',
                fontSize: '11px',
                opacity: 0.8
            }}>
                Feels like {Math.round(weather.feelsLike)}°C •
                Humidity {weather.humidity}%
            </p>
        </div>
    );
}