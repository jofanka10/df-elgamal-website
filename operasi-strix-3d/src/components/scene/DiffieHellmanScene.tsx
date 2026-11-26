import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DiffieHellmanResult } from '../../crypto/math';
import { StageEnvironment } from './StageEnvironment';

interface DiffieHellmanSceneProps {
  step: number; // 1..4
  replayKey: number;
  dh: DiffieHellmanResult;
}

interface PaintBeakerProps {
  position: [number, number, number];
  liquidColor: string;
  targetColor?: string;
  mixProgress?: number; // 0..1
  fillLevel?: number; // 0..1
  swirlSpeed?: number;
  glowColor?: string;
  glowIntensity?: number;
  label?: string;
  sublabel?: string;
  badgeTone?: 'amber' | 'pink' | 'purple' | 'green' | 'neutral';
}

function PaintBeaker({
  position,
  liquidColor,
  targetColor,
  mixProgress = 0,
  fillLevel = 0.72,
  swirlSpeed = 1,
  glowColor,
  glowIntensity = 0,
  label,
  sublabel,
  badgeTone = 'neutral',
}: PaintBeakerProps) {
  const liquidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const topDiscRef = useRef<THREE.Mesh>(null);
  const stirrerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const c1 = useMemo(() => new THREE.Color(liquidColor), [liquidColor]);
  const c2 = useMemo(() => new THREE.Color(targetColor ?? liquidColor), [targetColor, liquidColor]);
  const currentColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    currentColor.copy(c1).lerp(c2, THREE.MathUtils.clamp(mixProgress, 0, 1));

    if (liquidMatRef.current) {
      liquidMatRef.current.color.copy(currentColor);
      liquidMatRef.current.emissive.copy(currentColor);
      liquidMatRef.current.emissiveIntensity = 0.25 + (glowIntensity > 0 ? 0.2 : 0);
    }
    if (topDiscRef.current) {
      topDiscRef.current.rotation.z = t * swirlSpeed * 2.2;
      const mat = topDiscRef.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(currentColor);
    }
    if (stirrerRef.current) {
      stirrerRef.current.rotation.y = t * swirlSpeed * 4.5;
    }
    if (ringRef.current && glowIntensity > 0) {
      const s = 1 + Math.sin(t * 4) * 0.08;
      ringRef.current.scale.set(s, s, 1);
    }
  });

  const height = 1.35;
  const liquidHeight = Math.max(0.08, height * 0.85 * fillLevel);
  const badgeColors: Record<string, string> = {
    amber: 'border-[#f5b855]/50 text-[#f5b855]',
    pink: 'border-[#f08ac0]/50 text-[#f08ac0]',
    purple: 'border-[#8b7cf6]/50 text-[#8b7cf6]',
    green: 'border-[#5fd6a4]/70 text-[#5fd6a4]',
    neutral: 'border-[#7f89a3]/40 text-[#e8ecf5]',
  };

  return (
    <group position={position}>
      {/* Metallic coaster base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.56, 0.08, 32]} />
        <meshStandardMaterial color="#1a1e29" metalness={0.65} roughness={0.3} />
      </mesh>

      {/* Outer glass cylinder */}
      <mesh position={[0, height / 2 + 0.08, 0]}>
        <cylinderGeometry args={[0.44, 0.44, height, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#d7e4ff"
          transparent
          opacity={0.22}
          roughness={0.08}
          metalness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Glass Rim */}
      <mesh position={[0, height + 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.022, 12, 32]} />
        <meshStandardMaterial color="#b8c7e8" transparent opacity={0.55} roughness={0.15} />
      </mesh>

      {/* Liquid body */}
      <mesh position={[0, liquidHeight / 2 + 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, liquidHeight, 32]} />
        <meshStandardMaterial
          ref={liquidMatRef}
          color={liquidColor}
          emissive={liquidColor}
          emissiveIntensity={0.25}
          roughness={0.22}
          metalness={0.1}
        />
      </mesh>

      {/* Swirling meniscus surface */}
      <mesh ref={topDiscRef} position={[0, liquidHeight + 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 24]} />
        <meshStandardMaterial color={liquidColor} roughness={0.15} metalness={0.15} />
      </mesh>

      {/* Vortex Stirrer indicator when mixing */}
      {swirlSpeed > 1.5 && (
        <group ref={stirrerRef} position={[0, liquidHeight + 0.16, 0]}>
          <mesh position={[0.16, 0, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.16, 0, 0]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Celebratory Glow Ring */}
      {glowIntensity > 0 && glowColor && (
        <mesh ref={ringRef} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.78, 40]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={glowIntensity}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {label && (
        <Html position={[0, height + 0.46, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
          <div
            className={`flex flex-col items-center whitespace-nowrap rounded-xl border bg-[#1a1e29]/95 px-2.5 py-1 shadow-xl ${badgeColors[badgeTone]}`}
          >
            <span className="text-[11px] font-bold leading-tight">{label}</span>
            {sublabel && <span className="text-[10px] text-[#9aa5c4]">{sublabel}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}

interface SecretBottleProps {
  position: [number, number, number];
  color: string;
  label: string;
  sublabel: string;
  tone: 'pink' | 'purple';
  tilted?: boolean;
}

function SecretBottle({ position, color, label, sublabel, tone, tilted = false }: SecretBottleProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetRotZ = tilted ? (tone === 'pink' ? -0.45 : 0.45) : 0;
    const bobY = Math.sin(state.clock.elapsedTime * 2 + (tone === 'pink' ? 0 : 1.5)) * 0.04;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + bobY, delta * 5);
  });

  const borderCls = tone === 'pink' ? 'border-[#f08ac0]/50 text-[#f08ac0]' : 'border-[#8b7cf6]/50 text-[#8b7cf6]';

  return (
    <group ref={groupRef} position={position}>
      {/* Bottle Body */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.72, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.25} metalness={0.15} />
      </mesh>
      {/* Bottle Shoulder */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.26, 0.2, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.25} />
      </mesh>
      {/* Cork/Cap */}
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 18]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.25} />
      </mesh>
      <Html position={[0, 1.32, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
        <div className={`flex flex-col items-center whitespace-nowrap rounded-lg border bg-[#1a1e29]/95 px-2 py-0.5 shadow-lg ${borderCls}`}>
          <span className="text-[10px] font-bold">{label}</span>
          <span className="text-[9px] text-[#9aa5c4]">{sublabel}</span>
        </div>
      </Html>
    </group>
  );
}

interface PourStreamProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
  replayKey: number;
}

function PourStream({ from, to, color, active, replayKey }: PourStreamProps) {
  const dropRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [active, replayKey]);

  useFrame((_, delta) => {
    if (!active) return;
    progressRef.current = Math.min(1, progressRef.current + delta * 0.48);
    const p = progressRef.current;

    dropRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      if (p >= 1) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      const t = (p * 2.4 + idx * 0.2) % 1;
      const x = THREE.MathUtils.lerp(from[0], to[0], t);
      const z = THREE.MathUtils.lerp(from[2], to[2], t);
      const arc = Math.sin(t * Math.PI) * 1.15;
      const y = THREE.MathUtils.lerp(from[1], to[1], t) + arc;
      mesh.position.set(x, y, z);
      const fade = p > 0.85 ? (1 - p) / 0.15 : 1;
      const s = Math.sin(t * Math.PI) * 1.1 * fade;
      mesh.scale.setScalar(Math.max(0.01, s));
    });
  });

  if (!active) return null;

  return (
    <group>
      {[0, 1, 2, 3, 4].map((idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            dropRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} roughness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export function DiffieHellmanScene({ step, replayKey, dh }: DiffieHellmanSceneProps) {
  const stepTimeRef = useRef(0);
  const lloydTubeRef = useRef<THREE.Group>(null);
  const anyaTubeRef = useRef<THREE.Group>(null);
  const lloydFinalRef = useRef<THREE.Group>(null);
  const anyaFinalRef = useRef<THREE.Group>(null);
  const sharedParticlesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    stepTimeRef.current = 0;
  }, [step, replayKey]);

  // Helper state derived from elapsed step time
  const animStateRef = useRef({
    stage2Mix: 0,
    stage2Pour: 0,
    stage3Travel: 0,
    stage4Pour: 0,
    stage4Mix: 0,
  });

  useFrame((state, delta) => {
    stepTimeRef.current += delta;
    const st = stepTimeRef.current;

    if (step === 2) {
      animStateRef.current.stage2Pour = THREE.MathUtils.clamp(st / 1.4, 0, 1);
      animStateRef.current.stage2Mix = THREE.MathUtils.clamp((st - 0.6) / 1.5, 0, 1);
    } else if (step > 2) {
      animStateRef.current.stage2Pour = 1;
      animStateRef.current.stage2Mix = 1;
    } else {
      animStateRef.current.stage2Pour = 0;
      animStateRef.current.stage2Mix = 0;
    }

    if (step === 3) {
      animStateRef.current.stage3Travel = THREE.MathUtils.clamp(st / 2.2, 0, 1);
    } else if (step > 3) {
      animStateRef.current.stage3Travel = 1;
    } else {
      animStateRef.current.stage3Travel = 0;
    }

    if (step === 4) {
      animStateRef.current.stage4Pour = THREE.MathUtils.clamp(st / 1.4, 0, 1);
      animStateRef.current.stage4Mix = THREE.MathUtils.clamp((st - 0.6) / 1.6, 0, 1);
    } else {
      animStateRef.current.stage4Pour = 0;
      animStateRef.current.stage4Mix = 0;
    }

    // Animate Stage 3 traveling tubes across public bridge
    const p3 = animStateRef.current.stage3Travel;
    const ease3 = p3 < 0.5 ? 2 * p3 * p3 : 1 - Math.pow(-2 * p3 + 2, 2) / 2;

    if (lloydTubeRef.current) {
      // Lloyd's X travels from x=-4.4, z=1.1 -> x=4.4, z=1.1
      const targetX = step === 1 ? -4.4 : step === 2 ? -4.4 : step === 3 ? THREE.MathUtils.lerp(-4.4, 4.4, ease3) : 4.4;
      const targetZ = step <= 2 ? 1.1 : step === 3 ? 1.05 : 1.1;
      const liftY = step === 3 ? Math.sin(ease3 * Math.PI) * 0.45 : 0;
      lloydTubeRef.current.position.set(targetX, 0.22 + liftY, targetZ);
    }

    if (anyaTubeRef.current) {
      // Anya's Y travels from x=4.4, z=0.05 -> x=-4.4, z=0.05
      const targetX = step === 1 ? 4.4 : step === 2 ? 4.4 : step === 3 ? THREE.MathUtils.lerp(4.4, -4.4, ease3) : -4.4;
      const targetZ = step <= 2 ? 1.1 : step === 3 ? -0.05 : 1.1;
      const liftY = step === 3 ? Math.sin(ease3 * Math.PI) * 0.45 : 0;
      anyaTubeRef.current.position.set(targetX, 0.22 + liftY, targetZ);
    }

    if (sharedParticlesRef.current && step === 4) {
      sharedParticlesRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  // Compute React-friendly progress approximations that update smoothly in PaintBeaker via refs or step-driven props
  // Actually PaintBeaker interpolates via its own useFrame if we pass a ref or step! Let's use clean subcomponents that read stepTimeRef in useFrame!
  return (
    <>
      <StageEnvironment
        eavesdropperActive={step === 3}
        eavesdropperText={`Penyadap hanya melihat ${dh.colors.lloydMixName} (${dh.X}) & ${dh.colors.anyaMixName} (${dh.Y}) — mustahil memisahkan warna aslinya`}
        lloydRole="Agen Kiri · Rahasia x"
        anyaRole="Agen Kanan · Rahasia y"
      />

      {/* Public Base Paint (g) in Center Zone */}
      <PaintBeaker
        position={[0, 0.2, 0.5]}
        liquidColor={dh.colors.base}
        fillLevel={0.78}
        swirlSpeed={1.2}
        label={`Cat Dasar Publik: ${dh.colors.baseName}`}
        sublabel={`g = ${dh.g} (dari ${dh.p} warna)`}
        badgeTone="amber"
      />

      {/* Lloyd's Secret Bottle inside Frosted Booth */}
      <SecretBottle
        position={[-6.15, 0.34, -1.55]}
        color={dh.colors.lloydSecret}
        label={`Rahasia Lloyd: ${dh.colors.lloydSecretName}`}
        sublabel={`x = ${dh.x} (Tersembunyi)`}
        tone="pink"
        tilted={step === 2 || step === 4}
      />

      {/* Anya's Secret Bottle inside Frosted Booth */}
      <SecretBottle
        position={[6.15, 0.34, -1.55]}
        color={dh.colors.anyaSecret}
        label={`Rahasia Anya: ${dh.colors.anyaSecretName}`}
        sublabel={`y = ${dh.y} (Tersembunyi)`}
        tone="purple"
        tilted={step === 2 || step === 4}
      />

      {/* Pouring Streams in Step 2 (Public Yellow -> Lloyd & Anya, plus Secret -> Vats) */}
      <Stage2PourEffects step={step} replayKey={replayKey} dh={dh} />

      {/* Lloyd's Mixing Vat (becomes Orange X in Step 2, travels to Anya in Step 3, turns Dark Brown K' at Anya in Step 4) */}
      {step >= 2 && (
        <group ref={lloydTubeRef} position={[-4.4, 0.22, 1.1]}>
          <AnimatedMixBeaker
            step={step}
            replayKey={replayKey}
            mode="lloyd-to-anya"
            dh={dh}
          />
        </group>
      )}

      {/* Anya's Mixing Vat (becomes Green Y in Step 2, travels to Lloyd in Step 3, turns Dark Brown K at Lloyd in Step 4) */}
      {step >= 2 && (
        <group ref={anyaTubeRef} position={[4.4, 0.22, 1.1]}>
          <AnimatedMixBeaker
            step={step}
            replayKey={replayKey}
            mode="anya-to-lloyd"
            dh={dh}
          />
        </group>
      )}

      {/* Stage 4 Pour Streams (Secret Red -> Green at Lloyd; Secret Blue -> Orange at Anya) */}
      <Stage4PourEffects step={step} replayKey={replayKey} dh={dh} />

      {/* Celebratory Floating Green Emissive Sparks in Step 4 */}
      {step === 4 && (
        <group ref={sharedParticlesRef}>
          <group ref={lloydFinalRef} position={[-4.4, 1.8, 1.1]}>
            <CelebrationSparkles />
          </group>
          <group ref={anyaFinalRef} position={[4.4, 1.8, 1.1]}>
            <CelebrationSparkles />
          </group>
        </group>
      )}
    </>
  );
}

function Stage2PourEffects({ step, replayKey, dh }: { step: number; replayKey: number; dh: DiffieHellmanResult }) {
  const active = step === 2;
  if (!active) return null;

  return (
    <group>
      <PourStream from={[0, 1.4, 0.5]} to={[-4.4, 1.0, 1.1]} color={dh.colors.base} active={active} replayKey={replayKey} />
      <PourStream from={[0, 1.4, 0.5]} to={[4.4, 1.0, 1.1]} color={dh.colors.base} active={active} replayKey={replayKey} />
      <PourStream from={[-6.15, 1.2, -1.55]} to={[-4.4, 1.0, 1.1]} color={dh.colors.lloydSecret} active={active} replayKey={replayKey} />
      <PourStream from={[6.15, 1.2, -1.55]} to={[4.4, 1.0, 1.1]} color={dh.colors.anyaSecret} active={active} replayKey={replayKey} />
    </group>
  );
}

function Stage4PourEffects({ step, replayKey, dh }: { step: number; replayKey: number; dh: DiffieHellmanResult }) {
  const active = step === 4;
  if (!active) return null;

  return (
    <group>
      <PourStream from={[-6.15, 1.2, -1.55]} to={[-4.4, 1.0, 1.1]} color={dh.colors.lloydSecret} active={active} replayKey={replayKey} />
      <PourStream from={[6.15, 1.2, -1.55]} to={[4.4, 1.0, 1.1]} color={dh.colors.anyaSecret} active={active} replayKey={replayKey} />
    </group>
  );
}

function AnimatedMixBeaker({
  step,
  replayKey,
  mode,
  dh,
}: {
  step: number;
  replayKey: number;
  mode: 'lloyd-to-anya' | 'anya-to-lloyd';
  dh: DiffieHellmanResult;
}) {
  const tRef = useRef(0);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const discRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    tRef.current = 0;
  }, [step, replayKey]);

  const isLloydOrigin = mode === 'lloyd-to-anya';
  const baseCol = useMemo(() => new THREE.Color(dh.colors.base), [dh.colors.base]);
  const midCol = useMemo(
    () => new THREE.Color(isLloydOrigin ? dh.colors.lloydMix : dh.colors.anyaMix),
    [isLloydOrigin, dh.colors.lloydMix, dh.colors.anyaMix]
  );
  const finalCol = useMemo(() => new THREE.Color(dh.colors.shared), [dh.colors.shared]);
  const curCol = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    tRef.current += delta;
    const t = tRef.current;

    if (step === 2) {
      const m = THREE.MathUtils.clamp((t - 0.35) / 1.5, 0, 1);
      curCol.copy(baseCol).lerp(midCol, m);
    } else if (step === 3) {
      curCol.copy(midCol);
    } else if (step === 4) {
      const m = THREE.MathUtils.clamp((t - 0.35) / 1.6, 0, 1);
      curCol.copy(midCol).lerp(finalCol, m);
    }

    if (matRef.current) {
      matRef.current.color.copy(curCol);
      matRef.current.emissive.copy(curCol);
      matRef.current.emissiveIntensity = step === 4 ? 0.35 : 0.25;
    }
    if (discRef.current) {
      const swirlMult = step === 2 || step === 4 ? 4.5 : 1.2;
      discRef.current.rotation.z = state.clock.elapsedTime * swirlMult;
      const dMat = discRef.current.material as THREE.MeshStandardMaterial;
      dMat.color.copy(curCol);
    }
    if (ringRef.current && step === 4) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.08;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  const label =
    step === 2
      ? isLloydOrigin
        ? `Campuran Lloyd: ${dh.colors.lloydMixName}`
        : `Campuran Anya: ${dh.colors.anyaMixName}`
      : step === 3
      ? isLloydOrigin
        ? `Kirim X = ${dh.X} (${dh.colors.lloydMixName})`
        : `Kirim Y = ${dh.Y} (${dh.colors.anyaMixName})`
      : isLloydOrigin
      ? `Kunci Anya (K') = ${dh.K_anya}`
      : `Kunci Lloyd (K) = ${dh.K_lloyd}`;

  const sublabel =
    step === 2
      ? isLloydOrigin
        ? `X = ${dh.X}`
        : `Y = ${dh.Y}`
      : step === 3
      ? isLloydOrigin
        ? 'Lloyd → Anya'
        : 'Anya → Lloyd'
      : `${dh.colors.sharedName} · Identik!`;

  const badgeTone =
    step === 4 ? 'border-[#5fd6a4]/80 text-[#5fd6a4]' : isLloydOrigin ? 'border-[#f08ac0]/60 text-[#f08ac0]' : 'border-[#8b7cf6]/60 text-[#8b7cf6]';

  return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.54, 0.08, 32]} />
        <meshStandardMaterial color="#1a1e29" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.28, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#d7e4ff"
          transparent
          opacity={0.24}
          roughness={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.92, 32]} />
        <meshStandardMaterial ref={matRef} color={midCol} emissive={midCol} emissiveIntensity={0.25} roughness={0.2} />
      </mesh>
      <mesh ref={discRef} position={[0, 1.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshStandardMaterial color={midCol} roughness={0.15} />
      </mesh>

      {step === 4 && (
        <mesh ref={ringRef} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.78, 40]} />
          <meshStandardMaterial color="#5fd6a4" emissive="#5fd6a4" emissiveIntensity={1.6} transparent opacity={0.85} />
        </mesh>
      )}

      <Html position={[0, 1.72, 0]} center distanceFactor={13} style={{ pointerEvents: 'none' }}>
        <div className={`flex flex-col items-center whitespace-nowrap rounded-xl border bg-[#1a1e29]/95 px-2.5 py-1 shadow-xl ${badgeTone}`}>
          <span className="text-[11px] font-bold leading-tight">{label}</span>
          <span className="text-[10px] text-[#9aa5c4]">{sublabel}</span>
        </div>
      </Html>
    </group>
  );
}

function CelebrationSparkles() {
  const orbs = [
    [0.5, 0.2, 0],
    [-0.5, 0.35, 0.2],
    [0, 0.5, -0.45],
    [0.3, -0.1, 0.4],
  ];
  return (
    <group>
      {orbs.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#5fd6a4" emissive="#5fd6a4" emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  );
}
