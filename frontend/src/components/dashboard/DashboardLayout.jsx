import { useState } from 'react';
import ControlPanel from './ControlPanel';
import AvatarViewport from './AvatarViewport';

export default function DashboardLayout({ user }) {
    const [selectedItems, setSelectedItems] = useState({
        top: null,
        bottom: null,
        footwear: null,
        outerwear: null
    });

    const handleSelectItem = (category, item) => {
        setSelectedItems(prev => ({
            ...prev,
            [category.toLowerCase()]: item
        }));
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#1a1a2e',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Top Navbar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: '#16213e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                zIndex: 100,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{
                    color: '#6366f1',
                    margin: 0,
                    fontSize: '22px'
                }}>
                    👗 StylePlanner
                </h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>
                        Welcome, {user?.fullName || 'User'}!
                    </span>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#6366f1',
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                display: 'flex',
                width: '100%',
                marginTop: '60px'
            }}>
                {/* Left Side */}
                <div style={{
                    width: '380px',
                    minWidth: '380px',
                    backgroundColor: '#16213e',
                    borderRight: '1px solid #0f3460',
                    overflowY: 'auto',
                    height: 'calc(100vh - 60px)'
                }}>
                    <ControlPanel
                        onSelectItem={handleSelectItem}
                        selectedItems={selectedItems}
                    />
                </div>

                {/* Right Side */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#0f3460',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 60px)'
                }}>
                    <AvatarViewport
                        selectedItems={selectedItems}
                    />
                </div>
            </div>
        </div>
    );
}