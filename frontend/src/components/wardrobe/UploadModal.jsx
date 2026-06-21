import { useState, useRef } from 'react';
import axios from 'axios';

export default function UploadModal({ onClose, onUploadSuccess, userEmail }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('TOP');
    const [brand, setBrand] = useState('');
    const [warmth, setWarmth] = useState('MEDIUM');
    const [occasion, setOccasion] = useState('CASUAL');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) {
            setError('Please select an image!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name);
            formData.append('category', category);
            formData.append('brand', brand);
            formData.append('warmth', warmth);
            formData.append('occasion', occasion);
            formData.append('email', userEmail);

            const response = await axios.post(
                'http://localhost:8080/api/clothing/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Upload success:', response.data);
            onUploadSuccess(response.data);
            onClose();

        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed! Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                width: '450px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ margin: 0, color: '#333' }}>
                        👗 Upload Clothing
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleUpload}>
                    {/* Image Upload */}
                    <div
                        onClick={() => fileRef.current.click()}
                        style={{
                            width: '100%',
                            height: '200px',
                            border: '2px dashed #6366f1',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginBottom: '15px',
                            overflow: 'hidden',
                            backgroundColor: '#f8f9ff'
                        }}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    fontSize: '40px',
                                    margin: 0
                                }}>
                                    📷
                                </p>
                                <p style={{
                                    color: '#6366f1',
                                    margin: '5px 0 0',
                                    fontSize: '14px'
                                }}>
                                    Click to upload clothing image
                                </p>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />

                    {/* Name */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '4px',
                            color: '#555',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            👕 Item Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Blue Denim Jacket"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '4px',
                            color: '#555',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            🏷️ Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="TOP">👕 Top</option>
                            <option value="BOTTOM">👖 Bottom</option>
                            <option value="FOOTWEAR">👟 Footwear</option>
                            <option value="OUTERWEAR">🧥 Outerwear</option>
                        </select>
                    </div>

                    {/* Brand */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '4px',
                            color: '#555',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            🏪 Brand (Optional)
                        </label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="e.g. Nike, Zara, H&M"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Warmth Level */}
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '4px',
                            color: '#555',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            🌡️ Warmth Level
                        </label>
                        <select
                            value={warmth}
                            onChange={(e) => setWarmth(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="LIGHT">☀️ Light (Hot weather)</option>
                            <option value="MEDIUM">🌤️ Medium (Mild weather)</option>
                            <option value="WARM">🧥 Warm (Cold weather)</option>
                        </select>
                    </div>

                    {/* Occasion */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '4px',
                            color: '#555',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            🎯 Best For Occasion
                        </label>
                        <select
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="CASUAL">😊 Casual</option>
                            <option value="FORMAL">👔 Formal</option>
                            <option value="PARTY">🎉 Party</option>
                            <option value="WORKOUT">💪 Workout</option>
                        </select>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: '#fff0f0',
                            border: '1px solid #ffcccc',
                            borderRadius: '6px',
                            padding: '10px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                color: '#cc0000',
                                margin: 0,
                                fontSize: '13px'
                            }}>
                                ❌ {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? '⏳ Uploading...' : '📤 Upload to Wardrobe'}
                    </button>
                </form>
            </div>
        </div>
    );
}