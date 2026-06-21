import { useState } from 'react';
import ControlPanel from './ControlPanel';
import AvatarViewport from './AvatarViewport';
import UploadModal from '../wardrobe/UploadModal';

export default function DashboardLayout({ user, onLogout }) {
    const [selectedItems, setSelectedItems] = useState({
        top: null,
        bottom: null,
        footwear: null,
        outerwear: null
    });
    const [showUpload, setShowUpload] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSelectItem = (category, item) => {
        setSelectedItems(prev => ({
            ...prev,
            [category.toLowerCase()]: item
        }));
    };

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setShowUpload(false);
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#1a1a2e',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Navbar */}
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
                    <span style={{
                        color: '#aaa',
                        fontSize: '14px'
                    }}>
                        Welcome, {user?.fullName || 'User'}!
                    </span>
                    <button
                        onClick={onLogout}
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
    key={refreshKey}
    onSelectItem={handleSelectItem}
    selectedItems={selectedItems}
    onOpenUpload={() => setShowUpload(true)}
    userEmail={user?.email || ''}
    userCity={user?.locationCity || 'Hyderabad'}
/>
                </div>

                {/* Right Side */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#0f3460',
                    height: 'calc(100vh - 60px)'
                }}>
                    <AvatarViewport
                        selectedItems={selectedItems}
                        user={user}
                    />
                </div>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onUploadSuccess={handleUploadSuccess}
                    userEmail={user?.email || ''}
                />
            )}
        </div>
    );
}