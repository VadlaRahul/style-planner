import { useEffect, useRef, useState } from 'react';

export default function AvatarCreator({ gender, onAvatarCreated }) {
    const iframeRef = useRef();
    const [avatarReady, setAvatarReady] = useState(false);
    const [avatarBlobUrl, setAvatarBlobUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [log, setLog] = useState('⏳ Waiting for avatar...');
    const [messageCount, setMessageCount] = useState(0);

    const url = `https://styleplanner.avaturn.dev`;

    useEffect(() => {
        const handleMessage = async (event) => {
            const data = event.data;
            if (!data) return;

            setMessageCount(prev => prev + 1);

            // Log everything
            const dataStr = typeof data === 'string'
                ? data
                : JSON.stringify(data);

            console.log('Message received:', dataStr.substring(0, 200));

            // Check for avatar export - multiple ways
            const isExport =
                dataStr.includes('avatar.exported') ||
                dataStr.includes('gltf-binary') ||
                dataStr.includes('blobURI') ||
                (dataStr.includes('avaturn') &&
                 dataStr.includes('exported'));

            if (isExport) {
                console.log('🎉 AVATAR EXPORT DETECTED!');
                setLog('🎉 Avatar detected! Processing...');

                try {
                    let avatarUrl = '';

                    // Try all possible locations
                    if (typeof data === 'object') {
                        avatarUrl =
                            data?.data?.url ||
                            data?.data?.blobURI ||
                            data?.url ||
                            data?.blobURI ||
                            data?.avatarUrl || '';
                    }

                    // Try extracting from string
                    if (!avatarUrl) {
                        const base64Match = dataStr.match(
                            /data:model\/gltf-binary;base64,[A-Za-z0-9+/=]+/
                        );
                        if (base64Match) {
                            avatarUrl = base64Match[0];
                        }
                    }

                    if (avatarUrl) {
                        console.log('Converting avatar...');
                        setLog('Converting avatar...');
                        const response = await fetch(avatarUrl);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        setAvatarBlobUrl(blobUrl);
                        setAvatarReady(true);
                        setLog('✅ Avatar ready! Click Save button below!');
                        console.log('✅ Avatar blob URL ready!');
                    } else {
                        console.log('No URL found in message');
                        setLog('Avatar processing... Please wait...');
                    }
                } catch (err) {
                    console.error('Error:', err);
                    setLog('⚠️ Error processing. Try Skip button.');
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Send ready message to Avaturn iframe
    useEffect(() => {
        const timer = setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    { type: 'v1.ready' },
                    '*'
                );
                console.log('Sent ready message to Avaturn');
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        if (!avatarReady || !avatarBlobUrl) return;
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            onAvatarCreated(avatarBlobUrl);
        }, 500);
    };

    const handleSkip = () => {
        onAvatarCreated('/models/avatar.glb');
    };

    return (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <h2 style={{
                textAlign: 'center',
                color: '#333',
                padding: '20px 20px 5px',
                margin: 0
            }}>
                🎭 Create Your 3D Avatar
            </h2>

            <p style={{
                textAlign: 'center',
                color: '#666',
                fontSize: '13px',
                padding: '0 20px 10px',
                margin: 0
            }}>
                1️⃣ Customize avatar →
                2️⃣ Click <strong>Next</strong> inside Avaturn →
                3️⃣ Click <strong>Save</strong> below
            </p>

            {/* Status */}
            <div style={{
                margin: '0 20px 10px',
                padding: '12px',
                backgroundColor: avatarReady ? '#d4edda' : '#fff3cd',
                borderRadius: '8px',
                border: `2px solid ${avatarReady ? '#28a745' : '#ffc107'}`,
                textAlign: 'center'
            }}>
                <p style={{
                    margin: 0,
                    fontWeight: 'bold',
                    color: avatarReady ? '#155724' : '#856404',
                    fontSize: '14px'
                }}>
                    {log}
                </p>
                <p style={{
                    margin: '4px 0 0',
                    color: '#888',
                    fontSize: '11px'
                }}>
                    Messages received: {messageCount}
                </p>
            </div>

            {/* Avaturn iframe */}
            <iframe
                ref={iframeRef}
                src={url}
                style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                    display: 'block'
                }}
                allow="camera *; microphone *"
                title="Avaturn"
            />

            {/* Buttons */}
            <div style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderTop: '3px solid #dee2e6'
            }}>
                <button
                    onClick={handleSave}
                    disabled={!avatarReady || saving || saved}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: saved ? '#6c757d' :
                            avatarReady ? '#28a745' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: avatarReady && !saved
                            ? 'pointer' : 'not-allowed',
                        fontSize: '17px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        boxShadow: avatarReady && !saved
                            ? '0 4px 15px rgba(40,167,69,0.5)'
                            : 'none'
                    }}
                >
                    {saving ? '⏳ Saving...' :
                     saved ? '✅ Saved! Going to next step...' :
                     avatarReady ? '💾 Save My Avatar!' :
                     '🔒 Click Next in Avaturn First'}
                </button>

                <button
                    onClick={handleSkip}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'transparent',
                        border: '2px solid #6366f1',
                        color: '#6366f1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    ⏭️ Skip — Use Default Avatar
                </button>
            </div>
        </div>
    );
}