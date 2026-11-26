import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function useRoyalBannerTexture(accentColor: string, emblemText: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Rich fabric base
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 0, 256, 512);

      // Gold trim border
      ctx.strokeStyle = '#e6bd5a';
      ctx.lineWidth = 14;
      ctx.strokeRect(12, 12, 232, 488);

      // Center crest diamond / shield
      ctx.fillStyle = '#1f2336';
      ctx.beginPath();
      ctx.moveTo(128, 125);
      ctx.lineTo(205, 195);
      ctx.lineTo(128, 305);
      ctx.lineTo(51, 195);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e6bd5a';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Crown icon drawn with simple geometric paths
      ctx.fillStyle = '#f5c85c';
      ctx.beginPath();
      ctx.moveTo(86, 200);
      ctx.lineTo(94, 162);
      ctx.lineTo(114, 184);
      ctx.lineTo(128, 152);
      ctx.lineTo(142, 184);
      ctx.lineTo(162, 162);
      ctx.lineTo(170, 200);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f5e6c8';
      ctx.font = 'bold 28px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(emblemText, 128, 252);

      // Decorative horizontal gold stripe
      ctx.fillStyle = '#e6bd5a';
      ctx.fillRect(36, 360, 184, 8);
      ctx.fillRect(56, 382, 144, 5);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [accentColor, emblemText]);
}

function useTapestryMapTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Aged parchment canvas
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#dfc89b');
      grad.addColorStop(1, '#c9ab78');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Ornate border
      ctx.strokeStyle = '#5c3c22';
      ctx.lineWidth = 8;
      ctx.strokeRect(12, 12, 488, 232);
      ctx.strokeStyle = '#8b5e34';
      ctx.lineWidth = 2;
      ctx.strokeRect(22, 22, 468, 212);

      // Dotted route connecting two castles
      ctx.strokeStyle = '#8b2e3c';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(95, 145);
      ctx.quadraticCurveTo(256, 70, 415, 145);
      ctx.stroke();
      ctx.setLineDash([]);

      // Castle markers
      ctx.fillStyle = '#3b2b22';
      ctx.fillRect(72, 130, 44, 34);
      ctx.fillRect(70, 120, 12, 12);
      ctx.fillRect(88, 120, 12, 12);
      ctx.fillRect(106, 120, 12, 12);

      ctx.fillRect(394, 130, 44, 34);
      ctx.fillRect(392, 120, 12, 12);
      ctx.fillRect(410, 120, 12, 12);
      ctx.fillRect(428, 120, 12, 12);

      // Compass rose
      ctx.strokeStyle = '#5c3c22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(256, 172, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(256, 140);
      ctx.lineTo(256, 204);
      ctx.moveTo(224, 172);
      ctx.lineTo(288, 172);
      ctx.stroke();

      ctx.fillStyle = '#3b2414';
      ctx.font = 'bold 22px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('PETA RAHASIA KERAJAAN STRIX', 256, 54);

      ctx.font = 'italic 15px Georgia, serif';
      ctx.fillText('Kastil Barat (Lloyd)', 95, 195);
      ctx.fillText('Kastil Timur (Anya)', 415, 195);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Torch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 9 + position[0]) * 0.12;
    flameRef.current.scale.set(s, 1 + Math.cos(t * 11 + position[0]) * 0.16, s);
  });

  return (
    <group position={position}>
      {/* Iron Wall Bracket */}
      <mesh position={[0, 0, 0.12]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.55, 10]} />
        <meshStandardMaterial color="#2a2d36" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0.24]}>
        <cylinderGeometry args={[0.1, 0.06, 0.14, 12]} />
        <meshStandardMaterial color="#3c404d" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.42, 0.24]}>
        <coneGeometry args={[0.11, 0.3, 12]} />
        <meshStandardMaterial color="#ffbb45" emissive="#ff8811" emissiveIntensity={2.6} />
      </mesh>
      <pointLight position={[0, 0.45, 0.55]} intensity={2.2} color="#ffb35c" distance={10} />
    </group>
  );
}

function Candelabra({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Brass Stand */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.08, 18]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.055, 0.45, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.48, 0.035, 0.035]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* 3 Wax Candles & Flames */}
      {[-0.21, 0, 0.21].map((cx, i) => {
        const cy = i === 1 ? 0.58 : 0.54;
        return (
          <group key={i} position={[cx, cy, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.042, 0.22, 12]} />
              <meshStandardMaterial color="#f5ebd6" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <coneGeometry args={[0.025, 0.09, 10]} />
              <meshStandardMaterial color="#ffd166" emissive="#ff9f1c" emissiveIntensity={2.5} />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[0, 0.85, 0.2]} intensity={1.9} color="#ffc978" distance={8} />
    </group>
  );
}

function MedievalBookshelf({ position }: { position: [number, number, number] }) {
  const tomeColors = ['#7c3f4c', '#5b4b8a', '#3d6b58', '#8a5d3b', '#445a7d', '#946f38'];

  return (
    <group position={position}>
      {/* Heavy Oak Frame */}
      <RoundedBox args={[2.7, 4.5, 0.78]} radius={0.05} position={[0, 2.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3323" roughness={0.72} />
      </RoundedBox>
      <mesh position={[0, 2.25, 0.06]}>
        <boxGeometry args={[2.42, 4.15, 0.62]} />
        <meshStandardMaterial color="#2c1e15" roughness={0.85} />
      </mesh>

      {/* Shelves with Leather Tomes & Rolled Scrolls */}
      {[0.8, 1.7, 2.6, 3.5].map((y, sIdx) => (
        <group key={sIdx} position={[0, y, 0.16]}>
          <mesh>
            <boxGeometry args={[2.46, 0.08, 0.66]} />
            <meshStandardMaterial color="#5e412c" roughness={0.65} />
          </mesh>
          {[-0.9, -0.68, -0.45, -0.18, 0.15, 0.42, 0.66, 0.88].map((bx, bIdx) => {
            const h = 0.5 + ((sIdx + bIdx) % 3) * 0.09;
            const col = tomeColors[(sIdx * 2 + bIdx) % tomeColors.length];
            return (
              <mesh key={bIdx} position={[bx, h / 2 + 0.04, 0.05]} castShadow>
                <boxGeometry args={[0.16, h, 0.38]} />
                <meshStandardMaterial color={col} roughness={0.6} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function GothicWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Luminous Indigo Moonlit Sky */}
      <mesh position={[0, 0, -1.8]}>
        <planeGeometry args={[4.4, 5.4]} />
        <meshBasicMaterial color="#273659" />
      </mesh>
      {/* Distant Moon */}
      <mesh position={[0.9, 1.35, -1.65]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#fff3cf" />
      </mesh>
      {/* Distant Castle Turrets Silhouette */}
      <group position={[0, -1.4, -1.3]}>
        <mesh position={[-1.0, 0.6, 0]}>
          <boxGeometry args={[0.7, 1.6, 0.4]} />
          <meshStandardMaterial color="#1d2640" />
        </mesh>
        <mesh position={[-1.0, 1.65, 0]}>
          <coneGeometry args={[0.48, 0.7, 8]} />
          <meshStandardMaterial color="#283558" />
        </mesh>
        <mesh position={[0.2, 0.4, 0]}>
          <boxGeometry args={[1.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#1f2944" />
        </mesh>
        <mesh position={[1.15, 0.75, 0]}>
          <boxGeometry args={[0.65, 1.8, 0.4]} />
          <meshStandardMaterial color="#1d2640" />
        </mesh>
        <mesh position={[1.15, 1.9, 0]}>
          <coneGeometry args={[0.45, 0.65, 8]} />
          <meshStandardMaterial color="#283558" />
        </mesh>
      </group>

      {/* Stone Arch Frame */}
      <mesh position={[-1.85, 0, 0.06]}>
        <boxGeometry args={[0.26, 4.6, 0.24]} />
        <meshStandardMaterial color="#6e5640" roughness={0.8} />
      </mesh>
      <mesh position={[1.85, 0, 0.06]}>
        <boxGeometry args={[0.26, 4.6, 0.24]} />
        <meshStandardMaterial color="#6e5640" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.2, 0.06]}>
        <boxGeometry args={[4.0, 0.3, 0.24]} />
        <meshStandardMaterial color="#6e5640" roughness={0.8} />
      </mesh>
      <mesh position={[0, -2.2, 0.06]}>
        <boxGeometry args={[4.0, 0.3, 0.24]} />
        <meshStandardMaterial color="#6e5640" roughness={0.8} />
      </mesh>

      {/* Iron Mullion Crossbars */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.09, 4.2, 0.08]} />
        <meshStandardMaterial color="#262936" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0.02]}>
        <boxGeometry args={[3.5, 0.09, 0.08]} />
        <meshStandardMaterial color="#262936" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Chandelier({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Hanging Chain */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
        <meshStandardMaterial color="#2a2d38" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Wrought-Iron Wheel Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.06, 12, 32]} />
        <meshStandardMaterial color="#2e323f" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Cross spokes */}
      <mesh>
        <boxGeometry args={[2.55, 0.05, 0.05]} />
        <meshStandardMaterial color="#2e323f" metalness={0.75} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.55, 0.05, 0.05]} />
        <meshStandardMaterial color="#2e323f" metalness={0.75} />
      </mesh>
      {/* 6 Candles around the ring */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = (i / 6) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(ang) * 1.3, 0.16, Math.sin(ang) * 1.3]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.05, 0.24, 10]} />
              <meshStandardMaterial color="#f5ebd6" />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <coneGeometry args={[0.03, 0.11, 10]} />
              <meshStandardMaterial color="#ffd166" emissive="#ff9f1c" emissiveIntensity={2.5} />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[0, -0.3, 0]} intensity={2.6} color="#ffdaa0" distance={18} />
    </group>
  );
}

export function CastleBackdrop() {
  const lloydBanner = useRoyalBannerTexture('#9e3b68', 'LLOYD');
  const anyaBanner = useRoyalBannerTexture('#5c4db8', 'ANYA');
  const mapTex = useTapestryMapTexture();

  return (
    <group>
      {/* Warm Sandstone Castle Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
        <planeGeometry args={[52, 36]} />
        <meshStandardMaterial color="#635040" roughness={0.86} metalness={0.05} />
      </mesh>

      {/* Ornate Royal Carpet Under the Main Oak Table */}
      <RoundedBox args={[20.8, 0.05, 11.6]} radius={0.02} position={[0, -1.53, -0.4]} receiveShadow>
        <meshStandardMaterial color="#59283a" roughness={0.95} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -0.4]}>
        <ringGeometry args={[4.4, 4.7, 48]} />
        <meshStandardMaterial color="#d4af37" roughness={0.6} />
      </mesh>

      {/* Heavy Medieval Oak Council / Alchemist Table */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[17.8, 0.26, 6.8]} radius={0.07} position={[0, -0.15, -0.1]} receiveShadow castShadow>
          <meshStandardMaterial color="#583c28" roughness={0.62} metalness={0.08} />
        </RoundedBox>
        {/* Brass & Iron Edge Trim */}
        <mesh position={[0, -0.15, 3.31]}>
          <boxGeometry args={[17.82, 0.1, 0.05]} />
          <meshStandardMaterial color="#b38d39" metalness={0.75} roughness={0.35} />
        </mesh>
        {/* Sturdy Carved Timber Legs */}
        {[
          [-8.0, -0.88, 2.6],
          [8.0, -0.88, 2.6],
          [-8.0, -0.88, -2.8],
          [8.0, -0.88, -2.8],
        ].map(([lx, ly, lz], idx) => (
          <mesh key={idx} position={[lx, ly, lz]} castShadow>
            <boxGeometry args={[0.36, 1.38, 0.36]} />
            <meshStandardMaterial color="#3c281a" roughness={0.75} />
          </mesh>
        ))}

        {/* Candelabras on Both Ends of the Royal Table */}
        <Candelabra position={[-7.8, -0.02, -1.9]} />
        <Candelabra position={[7.8, -0.02, -1.9]} />

        {/* Parchment Scrolls, Leather Tomes & Brass Goblets */}
        <group position={[-7.95, 0.02, 0.4]} rotation={[0, 0.25, 0]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.9, 0.16, 0.65]} />
            <meshStandardMaterial color="#6b342b" roughness={0.65} />
          </mesh>
          <mesh position={[0.04, 0.2, -0.05]} rotation={[0, -0.12, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.85, 14]} />
            <meshStandardMaterial color="#e6d2aa" roughness={0.7} />
          </mesh>
        </group>

        <group position={[7.95, 0.02, 0.45]} rotation={[0, -0.25, 0]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.9, 0.16, 0.65]} />
            <meshStandardMaterial color="#3b4c70" roughness={0.65} />
          </mesh>
          <mesh position={[-0.04, 0.2, 0.04]} rotation={[0, 0.16, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.85, 14]} />
            <meshStandardMaterial color="#e6d2aa" roughness={0.7} />
          </mesh>
        </group>

        {/* Brass Goblets */}
        {[-7.25, 7.25].map((gx, idx) => (
          <group key={idx} position={[gx, -0.02, 2.1]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.1, 0.12, 0.06, 14]} />
              <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.18, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.08, 0.2, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Castle Back Wall: Warm Brown Wainscot Lower + Cream-Brown Sandstone Upper */}
      <mesh position={[0, 0.1, -7.2]} receiveShadow>
        <boxGeometry args={[36, 3.4, 0.45]} />
        <meshStandardMaterial color="#6a4d36" roughness={0.82} />
      </mesh>
      {/* Trim moulding between lower wainscot and upper cream-brown wall */}
      <mesh position={[0, 1.82, -6.96]}>
        <boxGeometry args={[36, 0.14, 0.14]} />
        <meshStandardMaterial color="#4d3422" roughness={0.7} />
      </mesh>
      {/* Sandstone / Brown Pillars */}
      {[-11.8, -6.2, -2.2, 2.2, 6.2, 11.8].map((px, i) => (
        <mesh key={i} position={[px, 2.8, -6.95]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 8.8, 0.55]} />
          <meshStandardMaterial color="#73573f" roughness={0.8} />
        </mesh>
      ))}
      {/* Center Cream-Brown Wall Section Behind Tapestry */}
      <mesh position={[0, 4.1, -7.2]} receiveShadow>
        <boxGeometry args={[4.4, 5.2, 0.45]} />
        <meshStandardMaterial color="#9c8264" roughness={0.85} />
      </mesh>
      {/* Outer Left & Right Cream-Brown Castle Walls */}
      <mesh position={[-9.2, 4.1, -7.2]} receiveShadow>
        <boxGeometry args={[6.2, 5.2, 0.45]} />
        <meshStandardMaterial color="#9c8264" roughness={0.85} />
      </mesh>
      <mesh position={[9.2, 4.1, -7.2]} receiveShadow>
        <boxGeometry args={[6.2, 5.2, 0.45]} />
        <meshStandardMaterial color="#9c8264" roughness={0.85} />
      </mesh>
      {/* Upper Timber Roof Beam */}
      <mesh position={[0, 6.7, -7.1]} receiveShadow>
        <boxGeometry args={[36, 0.9, 0.6]} />
        <meshStandardMaterial color="#4a3120" roughness={0.75} />
      </mesh>

      {/* Side Castle Walls (Warm Cream-Brown) */}
      <mesh position={[-13.4, 2.8, -1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14.5, 9, 0.45]} />
        <meshStandardMaterial color="#8c7357" roughness={0.85} />
      </mesh>
      <mesh position={[13.4, 2.8, -1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14.5, 9, 0.45]} />
        <meshStandardMaterial color="#8c7357" roughness={0.85} />
      </mesh>

      {/* Twin Gothic Moonlit Castle Windows */}
      <GothicWindow position={[-4.2, 4.1, -7.15]} />
      <GothicWindow position={[4.2, 4.1, -7.15]} />

      {/* Center Royal Kingdom Map Tapestry */}
      <group position={[0, 3.6, -6.9]}>
        <RoundedBox args={[3.7, 2.0, 0.12]} radius={0.04} castShadow>
          <meshStandardMaterial color="#4c3321" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.42, 1.72]} />
          <meshStandardMaterial map={mapTex} roughness={0.75} />
        </mesh>
      </group>

      {/* Royal Heraldic Banners */}
      <group position={[-8.8, 3.8, -6.85]}>
        <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.35, 2.6]} />
          <meshStandardMaterial map={lloydBanner} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group position={[8.8, 3.8, -6.85]}>
        <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.35, 2.6]} />
          <meshStandardMaterial map={anyaBanner} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Medieval Wooden Bookcases */}
      <MedievalBookshelf position={[-11.2, -1.55, -6.4]} />
      <MedievalBookshelf position={[11.2, -1.55, -6.4]} />

      {/* Warm Glowing Wall Torches */}
      <Torch position={[-6.2, 2.9, -6.65]} />
      <Torch position={[-2.2, 2.9, -6.65]} />
      <Torch position={[2.2, 2.9, -6.65]} />
      <Torch position={[6.2, 2.9, -6.65]} />

      {/* Overhead Royal Iron Chandelier */}
      <Chandelier position={[0, 5.8, -0.5]} />
    </group>
  );
}
