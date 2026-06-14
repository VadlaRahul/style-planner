export default function AvatarViewport({ selectedItems }) {
    const hasAnyItem = Object.values(selectedItems).some(item => item !== null);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
        }}>
            <h3 style={{
                color: '#6366f1',
                marginBottom: '20px',
                fontSize: '18px'
            }}>
                🧍 Your Avatar
            </h3>

            {/* Avatar Body */}
            <div style={{ position: 'relative', width: '200px' }}>

                {/* Head */}
                <div style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#f4c2a1',
                    borderRadius: '50%',
                    margin: '0 auto 5px',
                    border: '2px solid #e8a882'
                }} />

                {/* Neck */}
                <div style={{
                    width: '25px',
                    height: '20px',
                    backgroundColor: '#f4c2a1',
                    margin: '0 auto'
                }} />

                {/* Top */}
                <div style={{
                    width: '120px',
                    height: '130px',
                    backgroundColor: selectedItems.top
                        ? selectedItems.top.color
                        : '#555',
                    margin: '0 auto',
                    borderRadius: '10px 10px 0 0',
                    border: selectedItems.top
                        ? '2px solid rgba(255,255,255,0.3)'
                        : '2px dashed #777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s'
                }}>
                    {!selectedItems.top && (
                        <span style={{ color: '#888', fontSize: '11px' }}>
                            No Top
                        </span>
                    )}
                </div>

                {/* Outerwear overlay */}
                {selectedItems.outerwear && (
                    <div style={{
                        position: 'absolute',
                        top: '95px',
                        left: '0px',
                        width: '200px',
                        height: '140px',
                        backgroundColor: selectedItems.outerwear.color,
                        borderRadius: '10px 10px 0 0',
                        opacity: 0.75,
                        border: '2px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            color: 'white',
                            fontSize: '10px'
                        }}>
                            {selectedItems.outerwear.name}
                        </span>
                    </div>
                )}

                {/* Bottom */}
                <div style={{
                    width: '120px',
                    height: '130px',
                    backgroundColor: selectedItems.bottom
                        ? selectedItems.bottom.color
                        : '#555',
                    margin: '0 auto',
                    borderRadius: '0 0 5px 5px',
                    border: selectedItems.bottom
                        ? '2px solid rgba(255,255,255,0.3)'
                        : '2px dashed #777',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s'
                }}>
                    {!selectedItems.bottom && (
                        <span style={{ color: '#888', fontSize: '11px' }}>
                            No Bottom
                        </span>
                    )}
                </div>

                {/* Footwear */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '5px'
                }}>
                    {[0, 1].map(i => (
                        <div
                            key={i}
                            style={{
                                width: '45px',
                                height: '25px',
                                backgroundColor: selectedItems.footwear
                                    ? selectedItems.footwear.color
                                    : '#555',
                                borderRadius: '5px',
                                border: selectedItems.footwear
                                    ? '2px solid rgba(255,255,255,0.3)'
                                    : '2px dashed #777',
                                transition: 'background-color 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Instructions */}
            {!hasAnyItem && (
                <p style={{
                    color: '#555',
                    marginTop: '30px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    👈 Select clothing from the left panel
                </p>
            )}

            {hasAnyItem && (
                <div style={{
                    marginTop: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#6366f1',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        ✅ Outfit selected!
                    </p>
                    <p style={{
                        color: '#aaa',
                        fontSize: '12px',
                        margin: '5px 0 0'
                    }}>
                        3D rendering coming in next phase!
                    </p>
                </div>
            )}
        </div>
    );
}