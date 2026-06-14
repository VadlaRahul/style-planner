import { useState } from 'react';

const categories = ['TOP', 'BOTTOM', 'FOOTWEAR', 'OUTERWEAR'];

const sampleItems = {
    TOP: [
        { id: 1, name: 'White T-Shirt', color: '#ffffff' },
        { id: 2, name: 'Blue Shirt', color: '#4a90d9' },
        { id: 3, name: 'Black Hoodie', color: '#333333' },
    ],
    BOTTOM: [
        { id: 4, name: 'Blue Jeans', color: '#1a4a7a' },
        { id: 5, name: 'Black Pants', color: '#222222' },
        { id: 6, name: 'Khaki Chinos', color: '#c8a96e' },
    ],
    FOOTWEAR: [
        { id: 7, name: 'White Sneakers', color: '#f0f0f0' },
        { id: 8, name: 'Black Boots', color: '#111111' },
        { id: 9, name: 'Brown Loafers', color: '#8b5e3c' },
    ],
    OUTERWEAR: [
        { id: 10, name: 'Black Jacket', color: '#1a1a1a' },
        { id: 11, name: 'Denim Jacket', color: '#3a5f8a' },
        { id: 12, name: 'Beige Coat', color: '#d4b896' },
    ]
};

export default function ControlPanel({ onSelectItem, selectedItems }) {
    const [activeCategory, setActiveCategory] = useState('TOP');

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{
                color: '#6366f1',
                marginBottom: '20px',
                fontSize: '18px'
            }}>
                👗 My Wardrobe
            </h3>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: activeCategory === cat
                                ? '#6366f1'
                                : '#0f3460',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Clothing Items Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
            }}>
                {sampleItems[activeCategory].map(item => {
                    const isSelected = selectedItems[activeCategory.toLowerCase()]?.id === item.id;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelectItem(activeCategory, item)}
                            style={{
                                backgroundColor: isSelected ? '#6366f1' : '#0f3460',
                                border: isSelected
                                    ? '2px solid #818cf8'
                                    : '2px solid transparent',
                                borderRadius: '10px',
                                padding: '15px',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: item.color,
                                borderRadius: '8px',
                                margin: '0 auto 8px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }} />
                            <p style={{
                                color: 'white',
                                margin: 0,
                                fontSize: '12px',
                                fontWeight: isSelected ? 'bold' : 'normal'
                            }}>
                                {item.name}
                            </p>
                            {isSelected && (
                                <p style={{
                                    color: '#818cf8',
                                    margin: '4px 0 0',
                                    fontSize: '10px'
                                }}>
                                    ✅ Selected
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Outfit Summary */}
            <div style={{
                marginTop: '25px',
                backgroundColor: '#0f3460',
                borderRadius: '10px',
                padding: '15px'
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
                            fontSize: '13px',
                            textTransform: 'uppercase'
                        }}>
                            {cat}:
                        </span>
                        <span style={{
                            color: item ? '#6366f1' : '#555',
                            fontSize: '13px'
                        }}>
                            {item ? item.name : 'None'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}