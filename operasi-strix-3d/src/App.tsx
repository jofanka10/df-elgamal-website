import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Camera, Eye, Shield } from 'lucide-react';
import {
  computeDiffieHellman,
  computeElGamal,
  DH_PRESET,
  DiffieHellmanParams,
  EG_PRESET,
  ElGamalParams,
  generateRandomKs,
} from './crypto/math';
import {
  getDiffieHellmanNarrations,
  getElGamalNarrations,
  MissionId,
} from './data/narratives';
import { Sidebar } from './components/ui/Sidebar';
import { SpeakerHUD } from './components/ui/SpeakerHUD';
import { DiffieHellmanScene } from './components/scene/DiffieHellmanScene';
import { ElGamalScene } from './components/scene/ElGamalScene';

export function App() {
  const [mission, setMission] = useState<MissionId>('diffie-hellman');
  const [step, setStep] = useState<number>(1);
  const [replayKey, setReplayKey] = useState<number>(0);
  const [freeMode, setFreeMode] = useState<boolean>(false);

  // Mission 1: Diffie-Hellman state
  const [dhParams, setDhParams] = useState<DiffieHellmanParams>(DH_PRESET);
  const [lastValidDh, setLastValidDh] = useState(() => computeDiffieHellman(DH_PRESET));

  const dhResult = useMemo(() => computeDiffieHellman(dhParams), [dhParams]);

  useEffect(() => {
    if (dhResult.valid) {
      setLastValidDh(dhResult);
    }
  }, [dhResult]);

  const activeDh = dhResult.valid ? dhResult : lastValidDh;

  // Mission 2: ElGamal state
  const [egParams, setEgParams] = useState<ElGamalParams>(EG_PRESET);
  const [lastValidEg, setLastValidEg] = useState(() => computeElGamal(EG_PRESET));

  const egResult = useMemo(() => computeElGamal(egParams), [egParams]);

  useEffect(() => {
    if (egResult.valid) {
      setLastValidEg(egResult);
    }
  }, [egResult]);

  const activeEg = egResult.valid ? egResult : lastValidEg;

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const narrations = useMemo(() => {
    return mission === 'diffie-hellman'
      ? getDiffieHellmanNarrations(activeDh)
      : getElGamalNarrations(activeEg);
  }, [mission, activeDh, activeEg]);

  const handleSelectMission = (next: MissionId) => {
    setMission(next);
    setStep(1);
    setReplayKey((k) => k + 1);
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 5.9, 13.8);
      controlsRef.current.target.set(0, 1.15, -0.3);
      controlsRef.current.update();
    }
  };

  const handleRandomizeK = () => {
    const blockCount = Math.max(1, activeEg.blocks.length);
    setEgParams((prev) => ({
      ...prev,
      customKs: generateRandomKs(blockCount, prev.p),
    }));
    setReplayKey((k) => k + 1);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1c202c] text-[#e8ecf5]">
      <Sidebar
        mission={mission}
        onSelectMission={handleSelectMission}
        freeMode={freeMode}
        onToggleFreeMode={() => setFreeMode((v) => !v)}
        dhParams={dhParams}
        onChangeDhParams={(next) => {
          setDhParams(next);
          setReplayKey((k) => k + 1);
        }}
        onResetDhPreset={() => {
          setDhParams(DH_PRESET);
          setReplayKey((k) => k + 1);
        }}
        dhResult={dhResult}
        egParams={egParams}
        onChangeEgParams={(next) => {
          setEgParams(next);
          setReplayKey((k) => k + 1);
        }}
        onResetEgPreset={() => {
          setEgParams(EG_PRESET);
          setReplayKey((k) => k + 1);
        }}
        onRandomizeK={handleRandomizeK}
        egResult={egResult}
      />

      {/* Main 3D Stage Viewport */}
      <main className="relative flex-1 h-full overflow-hidden bg-gradient-to-b from-[#171b26] via-[#1c202c] to-[#141722]">
        {/* Top Floating Mission Header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-5">
          <div className="pointer-events-auto neu-card-sm flex items-center gap-3 rounded-2xl px-4 py-2.5 bg-[#232939]/90 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5fd6a4]/15 text-[#5fd6a4]">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#e8ecf5]">
                {mission === 'diffie-hellman'
                  ? 'Modul 1 · Diffie-Hellman (Analogi Pencampuran Cat)'
                  : 'Modul 2 · ElGamal (Analogi Kotak, Gembok & Segel)'}
              </div>
              <div className="text-[11px] text-[#7f89a3]">
                {mission === 'diffie-hellman'
                  ? `Menyepakati kunci rahasia di jalur terbuka · Tahap ${step} dari 4`
                  : `Mengirim pesan rahasia "${activeEg.cleanMessage}" dari Lloyd ke Anya · Tahap ${step} dari 4`}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 neu-card-sm rounded-xl px-3 py-2 text-[11px] text-[#9aa5c4] bg-[#232939]/90">
              <Eye className="h-3.5 w-3.5 text-[#8b7cf6]" />
              <span>Putar: Klik &amp; Seret · Zoom: Scroll</span>
            </div>
            <button
              type="button"
              onClick={handleResetCamera}
              className="neu-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#e8ecf5]"
              title="Kembalikan posisi kamera awal"
            >
              <Camera className="h-3.5 w-3.5 text-[#8b7cf6]" />
              Reset Kamera
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 5.9, 13.8], fov: 44, near: 0.1, far: 100 }}
        >
          <color attach="background" args={['#3b2e24']} />
          <fog attach="fog" args={['#3b2e24', 32, 65]} />

          <OrbitControls
            ref={controlsRef}
            target={[0, 1.15, -0.3]}
            enableDamping
            dampingFactor={0.06}
            minDistance={6}
            maxDistance={21}
            maxPolarAngle={Math.PI / 2 - 0.04}
          />

          {mission === 'diffie-hellman' ? (
            <DiffieHellmanScene step={step} replayKey={replayKey} dh={activeDh} />
          ) : (
            <ElGamalScene step={step} replayKey={replayKey} eg={activeEg} />
          )}
        </Canvas>

        {/* Bottom Presentation Speaker HUD */}
        <SpeakerHUD
          narrations={narrations}
          currentStep={step}
          onSelectStep={(s) => {
            setStep(s);
            setReplayKey((k) => k + 1);
          }}
          onReplay={() => setReplayKey((k) => k + 1)}
        />
      </main>
    </div>
  );
}

export default App;
