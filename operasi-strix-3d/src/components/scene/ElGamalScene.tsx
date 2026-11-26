import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ElGamalBlockInfo, ElGamalResult } from '../../crypto/math';
import { StageEnvironment } from './StageEnvironment';
import { usePlaqueTexture } from './CanvasTextures';

interface ElGamalSceneProps {
  step: number; // 1..4
  replayKey: number;
  eg: ElGamalResult;
}

function GoldenKeyMesh({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
  label,
  sublabel,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  label?: string;
  sublabel?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Key Bow (ring) */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <torusGeometry args={[0.2, 0.055, 16, 32]} />
        <meshStandardMaterial color="#f5b855" emissive="#f5b855" emissiveIntensity={0.32} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Inner jewel */}
      <mesh position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.075, 0]} />
        <meshStandardMaterial color="#8b7cf6" emissive="#8b7cf6" emissiveIntensity={0.7} metalness={0.4} roughness={0.15} />
      </mesh>
      {/* Key Shaft */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.55, 16]} />
        <meshStandardMaterial color="#f5b855" emissive="#d99a32" emissiveIntensity={0.22} metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Key Teeth */}
      <mesh position={[0.08, -0.22, 0]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.045]} />
        <meshStandardMaterial color="#f5b855" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0.06, -0.12, 0]} castShadow>
        <boxGeometry args={[0.1, 0.05, 0.045]} />
        <meshStandardMaterial color="#f5b855" metalness={0.85} roughness={0.22} />
      </mesh>

      {label && (
        <Html position={[0, 0.85, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center whitespace-nowrap rounded-lg border border-[#f5b855]/60 bg-[#1a1e29]/95 px-2.5 py-0.5 shadow-lg">
            <span className="text-[10px] font-bold text-[#f5b855]">{label}</span>
            {sublabel && <span className="text-[9px] text-[#9aa5c4]">{sublabel}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

function PadlockMesh({
  locked,
  scale = 1,
  color = '#8b7cf6',
  label,
  sublabel,
}: {
  locked: boolean;
  scale?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const shackleRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!shackleRef.current) return;
    const targetY = locked ? 0.19 : 0.34;
    const targetRotY = locked ? 0 : 0.65;
    shackleRef.current.position.y = THREE.MathUtils.lerp(shackleRef.current.position.y, targetY, delta * 7);
    shackleRef.current.rotation.y = THREE.MathUtils.lerp(shackleRef.current.rotation.y, targetRotY, delta * 7);
  });

  return (
    <group scale={scale}>
      {/* Lock Body */}
      <RoundedBox args={[0.42, 0.36, 0.18]} radius={0.05} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} metalness={0.65} roughness={0.28} />
      </RoundedBox>
      {/* Keyhole */}
      <mesh position={[0, -0.02, 0.095]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial color="#11141c" />
      </mesh>
      <mesh position={[0, -0.07, 0.095]}>
        <boxGeometry args={[0.035, 0.09, 0.01]} />
        <meshStandardMaterial color="#11141c" />
      </mesh>
      {/* Shackle */}
      <group ref={shackleRef} position={[0, locked ? 0.19 : 0.34, 0]}>
        <mesh>
          <torusGeometry args={[0.13, 0.032, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#d9e2f5" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {label && (
        <Html position={[0, 0.65, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div className="flex flex-col items-center whitespace-nowrap rounded-lg border border-[#8b7cf6]/60 bg-[#1a1e29]/95 px-2.5 py-0.5 shadow-lg">
            <span className="text-[10px] font-bold text-[#8b7cf6]">{label}</span>
            {sublabel && <span className="text-[9px] text-[#9aa5c4]">{sublabel}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

function LetterCube({
  char,
  code,
  position,
  tone,
}: {
  char: string;
  code: string;
  position: [number, number, number];
  tone: 'purple' | 'green';
}) {
  const accent = tone === 'green' ? '#5fd6a4' : '#8b7cf6';
  const tex = usePlaqueTexture({
    text: char,
    subtext: code,
    bgColor: tone === 'green' ? '#132a24' : '#1f2536',
    borderColor: accent,
    textColor: tone === 'green' ? '#5fd6a4' : '#e8ecf5',
    subColor: tone === 'green' ? '#9be8c8' : '#f08ac0',
    width: 256,
    height: 256,
    fontSize: 120,
  });

  const cubeRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!cubeRef.current) return;
    cubeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2.5 + position[0]) * 0.05;
  });

  return (
    <group ref={cubeRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.56, 0.56, 0.56]} />
        <meshStandardMaterial
          map={tex}
          emissive={accent}
          emissiveIntensity={tone === 'green' ? 0.35 : 0.14}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

function CargoCrate({
  block,
  totalBlocks,
  step,
  replayKey,
  yPublic,
}: {
  block: ElGamalBlockInfo;
  totalBlocks: number;
  step: number;
  replayKey: number;
  yPublic: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);
  const stepTimeRef = useRef(0);

  useEffect(() => {
    stepTimeRef.current = 0;
  }, [step, replayKey]);

  const spacing = 1.28;
  const offsetZ = (block.index - (totalBlocks - 1) / 2) * spacing;

  const frontTex = usePlaqueTexture({
    text: step === 3 ? `(${block.a}, ${block.b})` : block.digits,
    subtext:
      step === 3
        ? `Segel k=${block.k}`
        : step === 4
        ? `Pulih: ${block.label.replace(/_/g, '')}`
        : `Blok ${block.index + 1} (${block.label})`,
    bgColor: step === 3 ? '#1a1523' : '#1b2434',
    borderColor: step === 3 ? '#f08ac0' : step === 4 ? '#5fd6a4' : '#8b7cf6',
    textColor: step === 3 ? '#f08ac0' : step === 4 ? '#5fd6a4' : '#e8ecf5',
    subColor: '#9aa5c4',
    width: 512,
    height: 256,
    fontSize: step === 3 ? 82 : 108,
  });

  useFrame((_, delta) => {
    stepTimeRef.current += delta;
    const t = stepTimeRef.current;

    // Target X based on step
    let targetX = -4.6;
    if (step === 2) targetX = -4.6;
    if (step === 3) {
      const p = THREE.MathUtils.clamp((t - 0.8) / 1.5, 0, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetX = THREE.MathUtils.lerp(-4.6, 0, ease);
    }
    if (step === 4) {
      const p = THREE.MathUtils.clamp(t / 1.1, 0, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetX = THREE.MathUtils.lerp(0, 4.6, ease);
    }

    if (groupRef.current) {
      groupRef.current.position.x = targetX;
      groupRef.current.position.z = offsetZ + 0.5;
    }

    // Lid rotation: open in Step 2 & late Step 4; closed in Step 3
    if (lidRef.current) {
      const lidOpen = step === 2 || (step === 4 && t > 1.7);
      const targetLidRot = lidOpen ? -1.45 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetLidRot, delta * 6);
    }

    // Seal pop animation in Step 3
    if (sealRef.current) {
      const sealScale = step === 3 ? THREE.MathUtils.clamp((t - 0.3) * 2.5, 0.01, 1) : 0.01;
      sealRef.current.scale.setScalar(sealScale);
    }
  });

  return (
    <group ref={groupRef} position={[-4.6, 0.25, offsetZ + 0.5]}>
      {/* Crate Base Box */}
      <RoundedBox args={[0.92, 0.62, 0.88]} radius={0.04} position={[0, 0.31, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a3246" metalness={0.65} roughness={0.35} />
      </RoundedBox>

      {/* Front Display Plaque */}
      <mesh position={[0, 0.31, 0.45]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial map={frontTex} />
      </mesh>
      {/* Top/Side Metallic Ribs */}
      <mesh position={[-0.42, 0.31, 0]}>
        <boxGeometry args={[0.1, 0.64, 0.9]} />
        <meshStandardMaterial color="#1a1e29" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.42, 0.31, 0]}>
        <boxGeometry args={[0.1, 0.64, 0.9]} />
        <meshStandardMaterial color="#1a1e29" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hinged Lid */}
      <group ref={lidRef} position={[0, 0.62, -0.42]}>
        <RoundedBox args={[0.94, 0.1, 0.9]} radius={0.03} position={[0, 0.05, 0.42]} castShadow>
          <meshStandardMaterial
            color={step === 4 ? '#2d4a43' : '#354059'}
            metalness={0.7}
            roughness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Padlock attached on Crate Front-Top in Step 3 & early Step 4 */}
      {(step === 3 || step === 4) && (
        <group position={[0.24, 0.56, 0.5]} scale={0.55}>
          <PadlockMesh locked={step === 3} color={step === 4 ? '#5fd6a4' : '#8b7cf6'} />
        </group>
      )}

      {/* One-time Randomizer Seal (k -> a) in Step 3 */}
      {step === 3 && (
        <mesh ref={sealRef} position={[-0.26, 0.68, 0.42]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.06, 16]} />
          <meshStandardMaterial color="#f08ac0" emissive="#f08ac0" emissiveIntensity={0.85} roughness={0.25} />
        </mesh>
      )}

      {/* Floating Tag (hidden in Step 4 because crate plaques & reassembled INTEL already show clear result) */}
      {step !== 4 && (
        <Html position={[0, 1.02, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div
            className={`whitespace-nowrap rounded-lg border bg-[#1a1e29]/95 px-2 py-0.5 text-[10px] font-bold shadow-lg ${
              step === 3
                ? 'border-[#f08ac0]/60 text-[#f08ac0]'
                : 'border-[#8b7cf6]/50 text-[#e8ecf5]'
            }`}
          >
            {step === 2 && `Kotak ${block.index + 1}: ${block.digits}`}
            {step === 3 && `Terkunci (y=${yPublic}): (a=${block.a}, b=${block.b})`}
          </div>
        </Html>
      )}
    </group>
  );
}

export function ElGamalScene({ step, replayKey, eg }: ElGamalSceneProps) {
  const stepTimeRef = useRef(0);
  const publicPadlockRef = useRef<THREE.Group>(null);
  const flyingKeyRef = useRef<THREE.Group>(null);

  useEffect(() => {
    stepTimeRef.current = 0;
  }, [step, replayKey]);

  const letters = useMemo(() => eg.cleanMessage.split(''), [eg.cleanMessage]);

  useFrame((state, delta) => {
    stepTimeRef.current += delta;
    const t = stepTimeRef.current;

    // Stage 1: Open Padlock (y) spawns at Anya (x=4.5) and glides to Lloyd (x=-4.5)
    if (publicPadlockRef.current) {
      if (step === 1) {
        const p = THREE.MathUtils.clamp((t - 0.5) / 1.8, 0, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        publicPadlockRef.current.position.x = THREE.MathUtils.lerp(4.4, -4.4, ease);
        publicPadlockRef.current.position.y = 1.05 + Math.sin(ease * Math.PI) * 0.8;
        publicPadlockRef.current.position.z = 0.5;
      } else {
        publicPadlockRef.current.position.set(-4.4, 0.95 + Math.sin(state.clock.elapsedTime * 2) * 0.05, -0.9);
      }
    }

    // Stage 4: Golden key flies out of Anya's booth to unlock the arrived crates
    if (flyingKeyRef.current) {
      if (step === 4) {
        const p = THREE.MathUtils.clamp((t - 0.9) / 0.8, 0, 1);
        const x = THREE.MathUtils.lerp(6.15, 4.6, p);
        const y = THREE.MathUtils.lerp(1.25, 1.5, p);
        const z = THREE.MathUtils.lerp(-1.55, 0.5, p);
        flyingKeyRef.current.position.set(x, y, z);
        flyingKeyRef.current.rotation.z = t > 1.4 && t < 2.2 ? (t - 1.4) * 8 : 0;
      } else {
        flyingKeyRef.current.position.set(6.15, 1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.06, -1.55);
        flyingKeyRef.current.rotation.z = 0;
      }
    }
  });

  const cipherSummary = eg.blocks.map((b) => `(${b.a},${b.b})`).join(' ');

  return (
    <>
      <StageEnvironment
        eavesdropperActive={step === 3}
        eavesdropperText={`Penyadap hanya melihat kotak baja terkunci & angka acak ${cipherSummary}`}
        lloydRole="Pengirim · Kunci Publik y & Segel k"
        anyaRole="Penerima · Pemilik Kunci Emas x"
      />

      {/* Anya's Golden Private Key (Inside Frosted Booth in Steps 1-3, flies to unlock in Step 4) */}
      <group ref={flyingKeyRef} position={[6.15, 1.1, -1.55]}>
        <GoldenKeyMesh
          scale={1.25}
          label={step === 4 ? undefined : 'Kunci Privat Anya'}
          sublabel={step === 4 ? undefined : `x = ${eg.x} (Rahasia)`}
        />
      </group>

      {/* Public Open Padlock (y) generated by Anya and sent to Lloyd */}
      {(step === 1 || step === 2) && (
        <group ref={publicPadlockRef} position={[4.4, 1.05, 0.5]}>
          <PadlockMesh
            locked={false}
            scale={1.35}
            color="#8b7cf6"
            label={`Gembok Publik (Terbuka)`}
            sublabel={`y = ${eg.y}`}
          />
        </group>
      )}

      {/* Stage 2: Floating 3D Letter Cubes above Lloyd's Station */}
      {step === 2 && (
        <group position={[-4.6, 1.85, 0.5]}>
          {letters.map((ch, idx) => {
            const xOff = (idx - (letters.length - 1) / 2) * 0.72;
            const code = String(ch.charCodeAt(0) - 65).padStart(2, '0');
            return (
              <LetterCube
                key={`${ch}-${idx}`}
                char={ch}
                code={code}
                position={[xOff, 0, 0]}
                tone="purple"
              />
            );
          })}
          <Html position={[0, 0.75, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-full border border-[#8b7cf6]/60 bg-[#1a1e29]/95 px-3 py-0.5 text-[11px] font-bold text-[#e8ecf5] shadow-lg">
              Pesan "{eg.cleanMessage}" → {eg.blocks.length} Blok Angka
            </div>
          </Html>
        </group>
      )}

      {/* Stage 2, 3, 4: Cargo Crates */}
      {step >= 2 &&
        eg.blocks.map((block) => (
          <CargoCrate
            key={`${block.index}-${block.a}-${block.b}`}
            block={block}
            totalBlocks={eg.blocks.length}
            step={step}
            replayKey={replayKey}
            yPublic={eg.y}
          />
        ))}

      {/* Stage 4: Reassembled Glowing Green 3D Text Cubes at Anya's Station */}
      {step === 4 && (
        <group position={[4.6, 2.7, 0.5]}>
          {eg.decryptedMessage.split('').map((ch, idx) => {
            const xOff = (idx - (eg.decryptedMessage.length - 1) / 2) * 0.72;
            const code = String(ch.charCodeAt(0) - 65).padStart(2, '0');
            return (
              <LetterCube
                key={`dec-${ch}-${idx}`}
                char={ch}
                code={code}
                position={[xOff, 0, 0]}
                tone="green"
              />
            );
          })}
          <Html position={[0, 0.78, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-full border border-[#5fd6a4]/70 bg-[#122923]/95 px-3 py-0.5 text-[11px] font-bold text-[#5fd6a4] shadow-xl">
              ✓ Pesan Terbuka: "{eg.decryptedMessage}"
            </div>
          </Html>
        </group>
      )}
    </>
  );
}
