import { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherWidget from './WeatherWidget';

const categories = ['TOP', 'BOTTOM', 'FOOTWEAR', 'OUTERWEAR'];

export default function ControlPanel({
    onSelectItem,
    selectedItems,
    onOpenUpload,
    userEmail,
    userCity
}) {
    const [activeCategory, setActiveCategory] = useState('TOP');
    const [occasion, setOccasion] = useState('CASUAL');
    const [suggesting, setSuggesting] = useState(false);
    const [savedOutfits, setSavedOutfits] = useState([]);
const [showSaveModal, setShowSaveModal] = useState(false);
const [outfitName, setOutfitName] = useState('');
const [lastTemperature, setLastTemperature] = useState(null);
const [saving, setSaving] = useState(false);
    const [clothingItems, setClothingItems] = useState({
        TOP: [],
        BOTTOM: [],
        FOOTWEAR: [],
        OUTERWEAR: []
    });
    const [loading, setLoading] = useState(false);

    const loadItems = async () => {
        if (!userEmail) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/clothing/list?email=${userEmail}`
            );
            console.log('Loaded items:', response.data);

            const grouped = {
                TOP: [],
                BOTTOM: [],
                FOOTWEAR: [],
                OUTERWEAR: []
            };

            response.data.forEach(item => {
                const cat = item.category?.toUpperCase();
                if (grouped[cat]) {
                    grouped[cat].push({
                        id: item.id,
                        name: item.name,
                        brand: item.brand,
                        imagePath: item.imagePath,
                        color: '#6366f1'
                    });
                }
            });

            setClothingItems(grouped);
        } catch (err) {
            console.error('Error loading items:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadItems();
    }, [userEmail]);

    const handleSuggestOutfit = async () => {
        setSuggesting(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/outfit/suggest?email=${userEmail}&city=${userCity}&occasion=${occasion}`
            );
            console.log('Suggested outfit:', response.data);

            const result = response.data;
            const cats = ['top', 'bottom', 'footwear', 'outerwear'];

            cats.forEach(cat => {
                if (result[cat]) {
                    onSelectItem(cat.toUpperCase(), {
                        id: result[cat].id,
                        name: result[cat].name,
                        brand: result[cat].brand,
                        imagePath: result[cat].imagePath,
                        color: '#6366f1'
                    });
                }
            });

            setLastTemperature(result.temperature);
          alert(
    `🎉 Outfit suggested!\n` +
    `🌡️ Temperature: ${Math.round(result.temperature)}°C\n` +
    `👔 Occasion: ${occasion}`
          );
        } catch (err) {
            console.error('Suggestion error:', err);
            alert('Could not suggest outfit. Try uploading more items!');
        }
        setSuggesting(false);
    };
   const loadSavedOutfits = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/outfit/list?email=${userEmail}`
        );
        setSavedOutfits(response.data);
    } catch (err) {
        console.error('Error loading saved outfits:', err);
    }
};

useEffect(() => {
    loadSavedOutfits();
}, [userEmail]);

const handleSaveOutfit = async () => {
    if (!outfitName.trim()) {
        alert('Please enter a name for this outfit!');
        return;
    }

    const hasAnyItem = Object.values(selectedItems)
        .some(item => item !== null);
    if (!hasAnyItem) {
        alert('Please select at least one clothing item first!');
        return;
    }

    setSaving(true);
    try {
        const items = {};
        Object.entries(selectedItems).forEach(([cat, item]) => {
            if (item) items[cat] = item.id;
        });

        await axios.post('http://localhost:8080/api/outfit/save', {
            email: userEmail,
            name: outfitName,
            occasion: occasion,
            temperature: lastTemperature,
            items: items
        });

        alert('✅ Outfit saved successfully!');
        setOutfitName('');
        setShowSaveModal(false);
        loadSavedOutfits();
    } catch (err) {
        console.error('Save error:', err);
        alert('Failed to save outfit!');
    }
    setSaving(false);
};

const handleLoadOutfit = (outfit) => {
    outfit.items.forEach(item => {
        onSelectItem(item.category, {
            id: item.id,
            name: item.name,
            imagePath: item.imagePath,
            color: '#6366f1'
        });
    });
    alert(`✅ Loaded outfit: ${outfit.name}`);
};

const handleDeleteOutfit = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this outfit?')) return;
    try {
        await axios.delete(`http://localhost:8080/api/outfit/${id}`);
        loadSavedOutfits();
    } catch (err) {
        console.error('Delete error:', err);
    }
};
    return (
        <div style={{ padding: '20px' }}>
            {/* Weather Widget */}
            <WeatherWidget city={userCity} />

            <h3 style={{
                color: '#6366f1',
                marginBottom: '15px',
                fontSize: '18px'
            }}>
                👗 My Wardrobe
            </h3>

            {/* Occasion Selector */}
            <div style={{ marginBottom: '12px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    color: '#aaa',
                    fontSize: '12px'
                }}>
                    🎯 Occasion
                </label>
                <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#0f3460',
                        color: 'white',
                        border: '1px solid #6366f1',
                        borderRadius: '6px',
                        fontSize: '13px'
                    }}
                >
                    <option value="CASUAL">😊 Casual</option>
                    <option value="FORMAL">👔 Formal</option>
                    <option value="PARTY">🎉 Party</option>
                    <option value="WORKOUT">💪 Workout</option>
                </select>
            </div>

            {/* Suggest Outfit Button */}
            <button
                onClick={handleSuggestOutfit}
                disabled={suggesting}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                }}
            >
                {suggesting
                    ? '⏳ Finding best outfit...'
                    : '✨ Suggest Outfit for Today!'
                }
            </button>

            {/* Upload Button */}
            <button
                onClick={onOpenUpload}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                }}
            >
                📤 Upload New Item
            </button>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '15px',
                flexWrap: 'wrap'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '6px 10px',
                            backgroundColor: activeCategory === cat
                                ? '#6366f1' : '#0f3460',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <p style={{
                    color: '#aaa',
                    textAlign: 'center',
                    fontSize: '13px'
                }}>
                    Loading items...
                </p>
            )}

            {/* Clothing Items Grid */}
            {!loading && clothingItems[activeCategory].length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    backgroundColor: '#0f3460',
                    borderRadius: '10px',
                    marginBottom: '15px'
                }}>
                    <p style={{
                        color: '#aaa',
                        fontSize: '13px',
                        margin: 0
                    }}>
                        No {activeCategory} items yet!
                    </p>
                    <p style={{
                        color: '#6366f1',
                        fontSize: '12px',
                        margin: '5px 0 0'
                    }}>
                        Click Upload to add items
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    {clothingItems[activeCategory].map(item => {
                        const isSelected =
                            selectedItems[activeCategory.toLowerCase()]
                                ?.id === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() =>
                                    onSelectItem(activeCategory, item)}
                                style={{
                                    backgroundColor: isSelected
                                        ? '#6366f1' : '#0f3460',
                                    border: isSelected
                                        ? '2px solid #818cf8'
                                        : '2px solid transparent',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    margin: '0 auto 8px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: '#1a1a3e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.imagePath ? (
                                        <img
                                            src={`http://localhost:8080/${item.imagePath}`}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '30px' }}>
                                            {activeCategory === 'TOP' ? '👕' :
                                             activeCategory === 'BOTTOM' ? '👖' :
                                             activeCategory === 'FOOTWEAR' ? '👟' :
                                             '🧥'}
                                        </span>
                                    )}
                                </div>

                                <p style={{
                                    color: 'white',
                                    margin: 0,
                                    fontSize: '11px',
                                    fontWeight: isSelected
                                        ? 'bold' : 'normal'
                                }}>
                                    {item.name}
                                </p>
                                {item.brand && (
                                    <p style={{
                                        color: '#aaa',
                                        margin: '2px 0 0',
                                        fontSize: '10px'
                                    }}>
                                        {item.brand}
                                    </p>
                                )}
                                {isSelected && (
                                    <p style={{
                                        color: '#818cf8',
                                        margin: '3px 0 0',
                                        fontSize: '10px'
                                    }}>
                                        ✅ Selected
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Current Outfit */}
<div style={{
    backgroundColor: '#0f3460',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px'
}}>
    <h4 style={{
        color: '#6366f1',
        margin: '0 0 10px'
    }}>
        👔 Current Outfit
    </h4>
    {Object.entries(selectedItems).map(([cat, item]) => (
        <div key={cat} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px'
        }}>
            <span style={{
                color: '#aaa',
                fontSize: '12px',
                textTransform: 'uppercase'
            }}>
                {cat}:
            </span>
            <span style={{
                color: item ? '#6366f1' : '#555',
                fontSize: '12px'
            }}>
                {item ? item.name : 'None'}
            </span>
        </div>
    ))}

    <button
        onClick={() => setShowSaveModal(true)}
        style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            marginTop: '10px'
        }}
    >
        💾 Save This Outfit
    </button>
</div>

{/* Save Outfit Modal */}
{showSaveModal && (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    }}>
        <div style={{
            backgroundColor: '#16213e',
            borderRadius: '12px',
            padding: '25px',
            width: '320px'
        }}>
            <h3 style={{
                color: '#6366f1',
                margin: '0 0 15px'
            }}>
                💾 Save Outfit
            </h3>
            <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="e.g. Office Look"
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #6366f1',
                    backgroundColor: '#0f3460',
                    color: 'white',
                    marginBottom: '15px',
                    boxSizing: 'border-box'
                }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleSaveOutfit}
                    disabled={saving}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={() => setShowSaveModal(false)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid #6366f1',
                        color: '#6366f1',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}

{/* Saved Outfits Gallery */}
<div style={{
    backgroundColor: '#0f3460',
    borderRadius: '10px',
    padding: '15px'
}}>
    <h4 style={{
        color: '#6366f1',
        margin: '0 0 10px'
    }}>
        📁 My Saved Outfits
    </h4>
    {savedOutfits.length === 0 ? (
        <p style={{
            color: '#aaa',
            fontSize: '12px',
            textAlign: 'center',
            margin: 0
        }}>
            No saved outfits yet!
        </p>
    ) : (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            {savedOutfits.map(outfit => (
                <div
                    key={outfit.id}
                    onClick={() => handleLoadOutfit(outfit)}
                    style={{
                        backgroundColor: '#1a1a3e',
                        borderRadius: '8px',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        <p style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '13px',
                            fontWeight: 'bold'
                        }}>
                            {outfit.name}
                        </p>
                        <p style={{
                            color: '#aaa',
                            margin: '2px 0 0',
                            fontSize: '10px'
                        }}>
                            {outfit.occasion} •{' '}
                            {outfit.temperature
                                ? Math.round(outfit.temperature) + '°C'
                                : ''}
                            {' '}• {outfit.items.length} items
                        </p>
                    </div>
                    <button
                        onClick={(e) => handleDeleteOutfit(outfit.id, e)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        🗑️
                    </button>
                </div>
            ))}
        </div>
    )}
</div>
        </div>
    );
}