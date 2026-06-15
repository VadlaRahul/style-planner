import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// ── Avaturn Real Avatar ───────────────────────────────────
function AvaturnAvatar({ avatarUrl, selectedItems, heightCm, weightKg }) {
    const group = useRef();
    const { scene } = useGLTF(avatarUrl);

    const heightScale = heightCm ? heightCm / 170 : 1;
    const bmi = weightKg && heightCm
        ? weightKg / ((heightCm / 100) ** 2)
        : 22;
    const widthScale = Math.min(Math.max(bmi / 22, 0.85), 1.3);

    // Breathing animation
    useFrame((state) => {
        if (group.current) {
            group.current.position.y =
                Math.sin(state.clock.elapsedTime * 0.8) * 0.02 - 1.0;
        }
    });

    // Apply clothing colors
    useEffect(() => {
        if (!scene) return;
        scene.traverse((child) => {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                if (selectedItems?.top &&
                    (name.includes('top') ||
                    name.includes('shirt') ||
                    name.includes('outfit') ||
                    name.includes('clothing'))) {
                    child.material = child.material.clone();
                    child.material.color.set(selectedItems.top.color);
                }
                if (selectedItems?.bottom &&
                    (name.includes('bottom') ||
                    name.includes('pant') ||
                    name.includes('trouser') ||
                    name.includes('leg'))) {
                    child.material = child.material.clone();
                    child.material.color.set(selectedItems.bottom.color);
                }
                if (selectedItems?.footwear &&
                    (name.includes('shoe') ||
                    name.includes('foot') ||
                    name.includes('boot'))) {
                    child.material = child.material.clone();
                    child.material.color.set(selectedItems.footwear.color);
                }
            }
        });
    }, [scene, selectedItems]);

    return (
        <group ref={group}>
            <primitive
                object={scene}
                scale={[1.2, 1.2, 1.2]}
                position={[0, -0.8, 0]}
            />
        </group>
    );
}

// ── Fallback CSS Avatar ───────────────────────────────────
function FallbackAvatar({ selectedItems, gender }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y =
                Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
            groupRef.current.position.y =
                Math.sin(state.clock.elapsedTime * 1.0) * 0.02 - 1.5;
        }
    });

    const skin = '#f4c2a1';
    const topColor = selectedItems?.top?.color || '#4a4a6a';
    const bottomColor = selectedItems?.bottom?.color || '#2a2a4a';
    const footColor = selectedItems?.footwear?.color || '#1a1a1a';
    const hair = gender === 'FEMALE' ? '#3d1c02' : '#1a1a1a';

    return (
        <group ref={groupRef} position={[0, -1.5, 0]}>
            <mesh position={[0, 3.7, 0]}>
                <sphereGeometry args={[0.37, 32, 32]} />
                <meshStandardMaterial color={hair} />
            </mesh>
            <mesh position={[0, 3.35, 0]}>
                <sphereGeometry args={[0.33, 32, 32]} />
                <meshStandardMaterial color={skin} />
            </mesh>
            <mesh position={[-0.1, 3.4, 0.3]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0.1, 3.4, 0.3]}>
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 2.95, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
                <meshStandardMaterial color={skin} />
            </mesh>
            <mesh position={[0, 2.3, 0]}>
                <boxGeometry args={[0.8, 1.0, 0.4]} />
                <meshStandardMaterial color={topColor} />
            </mesh>
            <mesh position={[-0.58, 2.3, 0]}>
                <cylinderGeometry args={[0.12, 0.10, 0.9, 16]} />
                <meshStandardMaterial color={topColor} />
            </mesh>
            <mesh position={[0.58, 2.3, 0]}>
                <cylinderGeometry args={[0.12, 0.10, 0.9, 16]} />
                <meshStandardMaterial color={topColor} />
            </mesh>
            <mesh position={[0, 1.72, 0]}>
                <boxGeometry args={[0.82, 0.38, 0.4]} />
                <meshStandardMaterial color={bottomColor} />
            </mesh>
            <mesh position={[-0.22, 1.0, 0]}>
                <cylinderGeometry args={[0.17, 0.14, 1.3, 16]} />
                <meshStandardMaterial color={bottomColor} />
            </mesh>
            <mesh position={[0.22, 1.0, 0]}>
                <cylinderGeometry args={[0.17, 0.14, 1.3, 16]} />
                <meshStandardMaterial color={bottomColor} />
            </mesh>
            <mesh position={[-0.22, 0.25, 0.06]}>
                <boxGeometry args={[0.2, 0.14, 0.45]} />
                <meshStandardMaterial color={footColor} />
            </mesh>
            <mesh position={[0.22, 0.25, 0.06]}>
                <boxGeometry args={[0.2, 0.14, 0.45]} />
                <meshStandardMaterial color={footColor} />
            </mesh>
            {gender === 'FEMALE' && (
                <mesh position={[0, 3.1, -0.2]}>
                    <cylinderGeometry args={[0.2, 0.12, 0.7, 16]} />
                    <meshStandardMaterial color={hair} />
                </mesh>
            )}
        </group>
    );
}

// ── Main Component ────────────────────────────────────────
export default function AvatarViewport({ selectedItems, user }) {
    const avatarUrl = user?.avatarUrl || '/models/avatar.glb';
    const heightCm = user?.heightCm || 170;
    const weightKg = user?.weightKg || 70;
    const gender = user?.gender || 'MALE';
    const hasAnyItem = Object.values(selectedItems)
        .some(item => item !== null);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h3 style={{
                    color: '#6366f1',
                    margin: 0,
                    fontSize: '18px'
                }}>
                    {gender === 'FEMALE' ? '👩' : '👨'} Your 3D Avatar
                </h3>
                <p style={{
                    color: '#aaa',
                    fontSize: '12px',
                    margin: 0
                }}>
                    🖱️ Drag to rotate • Scroll to zoom
                </p>
            </div>

            {/* 3D Canvas */}
            <div style={{ flex: 1 }}>
                <Canvas
                    camera={{ position: [0, 1.2, 3.5], fov: 45 }}
                    style={{
                        background:
                            'linear-gradient(180deg, #0f3460 0%, #16213e 100%)'
                    }}
                >
                    <ambientLight intensity={1.0} />
                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={1.5}
                    />
                    <directionalLight
                        position={[-5, 3, -5]}
                        intensity={0.5}
                        color="#6366f1"
                    />
                    <pointLight
                        position={[0, 5, 3]}
                        intensity={0.8}
                    />

                    <Suspense fallback={null}>
                        {avatarUrl ? (
                            <AvaturnAvatar
                                avatarUrl={avatarUrl}
                                selectedItems={selectedItems}
                                heightCm={heightCm}
                                weightKg={weightKg}
                            />
                        ) : (
                            <FallbackAvatar
                                selectedItems={selectedItems}
                                gender={gender}
                            />
                        )}
                    </Suspense>

                    <mesh
                        position={[0, -1.8, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <circleGeometry args={[3, 32]} />
                        <meshStandardMaterial
                            color="#1a1a3e"
                            transparent
                            opacity={0.5}
                        />
                    </mesh>

                    <OrbitControls
                        enablePan={false}
                        minDistance={2}
                        maxDistance={7}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 1.8}
                        target={[0, 0.8, 0]}
                        autoRotate
                        autoRotateSpeed={1}
                    />
                </Canvas>
            </div>

            {/* Status */}
            <div style={{
                padding: '10px 20px',
                textAlign: 'center'
            }}>
                <p style={{
                    color: hasAnyItem ? '#6366f1' : '#555',
                    fontSize: '13px',
                    margin: 0
                }}>
                    {hasAnyItem
                        ? '✅ Outfit applied to your avatar!'
                        : '👈 Select clothing to dress your avatar!'
                    }
                </p>
            </div>
        </div>
    );
}