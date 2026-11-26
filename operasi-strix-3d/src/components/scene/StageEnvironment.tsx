import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CastleBackdrop } from './CastleBackdrop';

interface StageEnvironmentProps {
  eavesdropperActive: boolean;
  eavesdropperText?: string;
  lloydRole?: string;
  anyaRole?: string;
}

export function StageEnvironment({
  eavesdropperActive,
  eavesdropperText,
  lloydRole = 'Agen Pengirim / Pihak Kiri',
  anyaRole = 'Agen Penerima / Pihak Kanan',
}: StageEnvironmentProps) {
  const radarRef = useRef<THREE.Mesh>(null);
  const scanBeamRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (radarRef.current) {
      radarRef.current.rotation.z = t * (eavesdropperActive ? 1.8 : 0.4);
    }
    if (scanBeamRef.current) {
      scanBeamRef.current.rotation.y = Math.sin(t * 1.9) * 0.65;
    }
    if (eyeGlowRef.current) {
      const mat = eyeGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = eavesdropperActive ? 1.6 + Math.sin(t * 6) * 0.6 : 0.4;
    }
  });

  return (
    <group>
      {/* Bright Warm Royal Castle Lighting (clearly visible even at night) */}
      <ambientLight intensity={1.1} color="#f5e6cf" />
      <hemisphereLight args={['#ffe8c4', '#434d6e', 0.85]} />
      <directionalLight
        position={[5, 12, 9]}
        intensity={1.55}
        color="#fff3d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, 4.8, 2.5]} intensity={1.15} color="#f5a3cc" distance={16} />
      <pointLight position={[6, 4.8, 2.5]} intensity={1.15} color="#a69bff" distance={16} />
      <pointLight position={[0, 5.2, 3.5]} intensity={1.0} color="#8ce8c4" distance={15} />
      <pointLight position={[0, 4.5, -4.5]} intensity={1.35} color="#ffd79e" distance={18} />

      {/* Medieval Royal Castle Chamber Backdrop */}
      <CastleBackdrop />

      {/* Public Transmission Bridge / Rail connecting Lloyd <-> Public <-> Anya */}
      <RoundedBox args={[11.4, 0.14, 1.4]} radius={0.05} position={[0, 0.04, 0.5]} receiveShadow>
        <meshStandardMaterial color="#232939" roughness={0.5} metalness={0.45} />
      </RoundedBox>
      {/* Glowing guide rails */}
      <mesh position={[0, 0.12, -0.08]}>
        <boxGeometry args={[10.8, 0.03, 0.05]} />
        <meshStandardMaterial color="#8b7cf6" emissive="#8b7cf6" emissiveIntensity={0.85} />
      </mesh>
      <mesh position={[0, 0.12, 1.08]}>
        <boxGeometry args={[10.8, 0.03, 0.05]} />
        <meshStandardMaterial color="#f08ac0" emissive="#f08ac0" emissiveIntensity={0.85} />
      </mesh>

      {/* ZONA LLOYD (KIRI) */}
      <group position={[-5.4, 0, 0]}>
        <RoundedBox args={[3.9, 0.24, 5.2]} radius={0.12} position={[0, 0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#232939" roughness={0.4} metalness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 1.72, 48]} />
          <meshStandardMaterial color="#f08ac0" emissive="#f08ac0" emissiveIntensity={0.75} />
        </mesh>

        {/* Bilik Kaca Buram (Frosted Privacy Booth) untuk rahasia Lloyd */}
        <group position={[-0.75, 0.22, -1.55]}>
          {/* Base plate */}
          <RoundedBox args={[1.7, 0.1, 1.6]} radius={0.04} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#1a1e29" roughness={0.6} metalness={0.4} />
          </RoundedBox>
          {/* Right frosted wall facing Public Zone (blocks Eve's sight!) */}
          <mesh position={[0.82, 1.05, 0]}>
            <boxGeometry args={[0.06, 1.9, 1.5]} />
            <meshPhysicalMaterial
              color="#7f89a3"
              transparent
              opacity={0.42}
              roughness={0.65}
              metalness={0.1}
              transmission={0.25}
            />
          </mesh>
          {/* Back & Left partial frosted walls */}
          <mesh position={[0, 1.05, -0.75]}>
            <boxGeometry args={[1.64, 1.9, 0.06]} />
            <meshPhysicalMaterial color="#6e7999" transparent opacity={0.34} roughness={0.7} />
          </mesh>
          <mesh position={[-0.82, 1.05, 0]}>
            <boxGeometry args={[0.06, 1.9, 1.5]} />
            <meshPhysicalMaterial color="#6e7999" transparent opacity={0.22} roughness={0.7} />
          </mesh>
          {/* Top security frame */}
          <mesh position={[0, 2.02, 0]}>
            <boxGeometry args={[1.72, 0.06, 1.56]} />
            <meshStandardMaterial color="#2f3750" metalness={0.6} roughness={0.3} />
          </mesh>
          <Html position={[0, 2.3, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-full border border-[#f08ac0]/40 bg-[#1a1e29]/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#f08ac0] uppercase shadow-lg">
              Bilik Privat Lloyd
            </div>
          </Html>
        </group>

        <Html position={[0, 0.25, 2.85]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-[#f08ac0]/35 bg-[#232939]/95 px-3 py-1.5 shadow-lg">
            <span className="text-xs font-bold tracking-wide text-[#f08ac0]">ZONA LLOYD</span>
            <span className="text-[10px] text-[#9aa5c4]">{lloydRole}</span>
          </div>
        </Html>
      </group>

      {/* ZONA PUBLIK / JALUR PENYADAP (TENGAH) */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[4.1, 0.2, 5.2]} radius={0.12} position={[0, 0.08, 0]} receiveShadow>
          <meshStandardMaterial color="#1d2230" roughness={0.5} metalness={0.3} />
        </RoundedBox>

        {/* Warning Radar Ring on Floor */}
        <mesh ref={radarRef} position={[0, 0.2, -1.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.05, 6]} />
          <meshStandardMaterial
            color={eavesdropperActive ? '#f27a7a' : '#7f89a3'}
            emissive={eavesdropperActive ? '#f27a7a' : '#2f3750'}
            emissiveIntensity={eavesdropperActive ? 1.2 : 0.2}
          />
        </mesh>

        {/* Spy Silhouette (Penyadap) */}
        <group position={[0, 0.2, -1.85]}>
          {/* Pedestal */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.68, 0.24, 24]} />
            <meshStandardMaterial color="#1a1e29" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Trenchcoat Torso */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <coneGeometry args={[0.48, 1.25, 20]} />
            <meshStandardMaterial color="#11141c" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Coat Collar */}
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.25, 0.34, 0.2, 16]} />
            <meshStandardMaterial color="#1c202c" roughness={0.5} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.62, 0]} castShadow>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color="#141822" roughness={0.4} />
          </mesh>
          {/* Glowing Spy Visor / Eyes */}
          <mesh ref={eyeGlowRef} position={[0, 1.64, 0.19]}>
            <boxGeometry args={[0.26, 0.06, 0.08]} />
            <meshStandardMaterial
              color={eavesdropperActive ? '#f27a7a' : '#7f89a3'}
              emissive={eavesdropperActive ? '#f27a7a' : '#7f89a3'}
              emissiveIntensity={eavesdropperActive ? 1.8 : 0.4}
            />
          </mesh>
          {/* Fedora Hat Brim & Crown */}
          <mesh position={[0, 1.78, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
            <meshStandardMaterial color="#0d1017" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.21, 0.25, 0.22, 20]} />
            <meshStandardMaterial color="#0d1017" roughness={0.5} />
          </mesh>
          {/* Hat Band */}
          <mesh position={[0, 1.82, 0]}>
            <cylinderGeometry args={[0.255, 0.255, 0.04, 20]} />
            <meshStandardMaterial
              color={eavesdropperActive ? '#f27a7a' : '#8b7cf6'}
              emissive={eavesdropperActive ? '#f27a7a' : '#8b7cf6'}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Active Laser Scanner Cone when intercepting */}
          {eavesdropperActive && (
            <group ref={scanBeamRef} position={[0, 1.62, 0.22]}>
              <mesh position={[0, -0.45, 1.25]} rotation={[Math.PI / 2.4, 0, 0]}>
                <coneGeometry args={[0.95, 2.3, 24, 1, true]} />
                <meshBasicMaterial
                  color="#f27a7a"
                  transparent
                  opacity={0.16}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            </group>
          )}

          {/* Eavesdropper Floating Label & Alert */}
          <Html position={[0, 2.45, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`whitespace-nowrap rounded-full border px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase shadow-lg transition-colors ${
                  eavesdropperActive
                    ? 'border-[#f27a7a]/70 bg-[#2a1720]/95 text-[#f27a7a]'
                    : 'border-[#7f89a3]/30 bg-[#1a1e29]/90 text-[#9aa5c4]'
                }`}
              >
                {eavesdropperActive ? 'Penyadap Memindai Jalur!' : 'Penyadap (Jalur Publik)'}
              </div>
              {eavesdropperActive && eavesdropperText && (
                <div className="max-w-[260px] rounded-xl border border-[#f27a7a]/50 bg-[#1a1e29]/95 px-3 py-2 text-center text-[11px] font-medium leading-snug text-[#f9d0d0] shadow-xl">
                  {eavesdropperText}
                </div>
              )}
            </div>
          </Html>
        </group>

        <Html position={[0, 0.25, 2.85]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-[#7f89a3]/30 bg-[#232939]/95 px-3 py-1.5 shadow-lg">
            <span className="text-xs font-bold tracking-wide text-[#e8ecf5]">ZONA PUBLIK</span>
            <span className="text-[10px] text-[#9aa5c4]">Saluran Terbuka · Rawan Sadap</span>
          </div>
        </Html>
      </group>

      {/* ZONA ANYA (KANAN) */}
      <group position={[5.4, 0, 0]}>
        <RoundedBox args={[3.9, 0.24, 5.2]} radius={0.12} position={[0, 0.1, 0]} receiveShadow>
          <meshStandardMaterial color="#232939" roughness={0.4} metalness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 1.72, 48]} />
          <meshStandardMaterial color="#8b7cf6" emissive="#8b7cf6" emissiveIntensity={0.75} />
        </mesh>

        {/* Bilik Kaca Buram (Frosted Privacy Booth) untuk rahasia Anya */}
        <group position={[0.75, 0.22, -1.55]}>
          <RoundedBox args={[1.7, 0.1, 1.6]} radius={0.04} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#1a1e29" roughness={0.6} metalness={0.4} />
          </RoundedBox>
          {/* Left frosted wall facing Public Zone (blocks Eve's sight!) */}
          <mesh position={[-0.82, 1.05, 0]}>
            <boxGeometry args={[0.06, 1.9, 1.5]} />
            <meshPhysicalMaterial
              color="#7f89a3"
              transparent
              opacity={0.42}
              roughness={0.65}
              metalness={0.1}
              transmission={0.25}
            />
          </mesh>
          <mesh position={[0, 1.05, -0.75]}>
            <boxGeometry args={[1.64, 1.9, 0.06]} />
            <meshPhysicalMaterial color="#6e7999" transparent opacity={0.34} roughness={0.7} />
          </mesh>
          <mesh position={[0.82, 1.05, 0]}>
            <boxGeometry args={[0.06, 1.9, 1.5]} />
            <meshPhysicalMaterial color="#6e7999" transparent opacity={0.22} roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.02, 0]}>
            <boxGeometry args={[1.72, 0.06, 1.56]} />
            <meshStandardMaterial color="#2f3750" metalness={0.6} roughness={0.3} />
          </mesh>
          <Html position={[0, 2.3, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-full border border-[#8b7cf6]/40 bg-[#1a1e29]/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#8b7cf6] uppercase shadow-lg">
              Bilik Privat Anya
            </div>
          </Html>
        </group>

        <Html position={[0, 0.25, 2.85]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center whitespace-nowrap rounded-xl border border-[#8b7cf6]/35 bg-[#232939]/95 px-3 py-1.5 shadow-lg">
            <span className="text-xs font-bold tracking-wide text-[#8b7cf6]">ZONA ANYA</span>
            <span className="text-[10px] text-[#9aa5c4]">{anyaRole}</span>
          </div>
        </Html>
      </group>
    </group>
  );
}
