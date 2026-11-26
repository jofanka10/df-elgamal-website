import { Lock, Palette, RotateCcw, Shuffle, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { DiffieHellmanParams, DiffieHellmanResult, ElGamalParams, ElGamalResult } from '../../crypto/math';
import { MissionId } from '../../data/narratives';

interface SidebarProps {
  mission: MissionId;
  onSelectMission: (m: MissionId) => void;
  freeMode: boolean;
  onToggleFreeMode: () => void;
  dhParams: DiffieHellmanParams;
  onChangeDhParams: (next: DiffieHellmanParams) => void;
  onResetDhPreset: () => void;
  dhResult: DiffieHellmanResult;
  egParams: ElGamalParams;
  onChangeEgParams: (next: ElGamalParams) => void;
  onResetEgPreset: () => void;
  onRandomizeK: () => void;
  egResult: ElGamalResult;
}

export function Sidebar({
  mission,
  onSelectMission,
  freeMode,
  onToggleFreeMode,
  dhParams,
  onChangeDhParams,
  onResetDhPreset,
  dhResult,
  egParams,
  onChangeEgParams,
  onResetEgPreset,
  onRandomizeK,
  egResult,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/5 bg-[#1c202c] p-5 z-20">
      {/* Brand Header */}
      <div className="neu-card rounded-2xl p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b7cf6]/15 border border-[#8b7cf6]/40 text-[#8b7cf6]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide text-[#e8ecf5]">
              OPERASI <span className="text-[#8b7cf6]">STRIX</span>
            </h1>
            <p className="text-[11px] text-[#7f89a3]">
              Visualisasi Kriptografi 3D · Misi Lloyd &amp; Anya
            </p>
          </div>
        </div>
      </div>

      {/* Mission Selector */}
      <div className="flex flex-col gap-2.5">
        <span className="px-1 text-[10px] font-bold tracking-widest text-[#7f89a3] uppercase">
          Pilih Misi Simulasi
        </span>

        <button
          type="button"
          onClick={() => onSelectMission('diffie-hellman')}
          className={`flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all ${
            mission === 'diffie-hellman'
              ? 'neu-btn-active border border-[#f08ac0]/45 text-[#e8ecf5]'
              : 'neu-btn text-[#7f89a3] hover:text-[#e8ecf5]'
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              mission === 'diffie-hellman' ? 'bg-[#f08ac0]/20 text-[#f08ac0]' : 'bg-[#1a1e29] text-[#7f89a3]'
            }`}
          >
            <Palette className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-snug">1. Diffie-Hellman</div>
            <div className="text-[11px] text-[#7f89a3] truncate">Analogi Pencampuran Cat</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMission('elgamal')}
          className={`flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all ${
            mission === 'elgamal'
              ? 'neu-btn-active border border-[#8b7cf6]/45 text-[#e8ecf5]'
              : 'neu-btn text-[#7f89a3] hover:text-[#e8ecf5]'
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              mission === 'elgamal' ? 'bg-[#8b7cf6]/20 text-[#8b7cf6]' : 'bg-[#1a1e29] text-[#7f89a3]'
            }`}
          >
            <Lock className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold leading-snug">2. ElGamal</div>
            <div className="text-[11px] text-[#7f89a3] truncate">Analogi Kotak, Gembok &amp; Segel</div>
          </div>
        </button>
      </div>

      {/* Mode Toggle: Presentasi vs Mode Bebas */}
      <div className="neu-card-sm rounded-2xl p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#8b7cf6]" />
            <div>
              <div className="text-xs font-bold text-[#e8ecf5]">Mode Bebas (Custom)</div>
              <div className="text-[10px] text-[#7f89a3]">
                {freeMode ? 'Ubah angka & pesan langsung' : 'Preset presentasi aktif'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleFreeMode}
            aria-label="Toggle Mode Bebas"
            className={`relative h-6 w-11 rounded-full transition-colors p-0.5 ${
              freeMode ? 'bg-[#5fd6a4]' : 'bg-[#1a1e29] border border-white/10'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-[#e8ecf5] shadow transition-transform ${
                freeMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Parameter Control Panel */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest text-[#7f89a3] uppercase">
            Parameter Misi
          </span>
          <button
            type="button"
            onClick={mission === 'diffie-hellman' ? onResetDhPreset : onResetEgPreset}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-[#8b7cf6] hover:bg-[#8b7cf6]/10 transition-colors"
            title="Kembalikan nilai preset presentasi"
          >
            <RotateCcw className="h-3 w-3" />
            Preset
          </button>
        </div>

        {mission === 'diffie-hellman' ? (
          <div className="flex flex-col gap-2.5">
            <ParamInput
              label="Ukuran Katalog Warna (p)"
              value={dhParams.p}
              disabled={!freeMode}
              onChange={(val) => onChangeDhParams({ ...dhParams, p: parseInt(val || '0', 10) })}
            />
            <ParamInput
              label="Cat Dasar Publik (g)"
              value={dhParams.g}
              disabled={!freeMode}
              onChange={(val) => onChangeDhParams({ ...dhParams, g: parseInt(val || '0', 10) })}
            />
            <ParamInput
              label="Cat Rahasia Lloyd (x)"
              value={dhParams.x}
              disabled={!freeMode}
              accent="pink"
              onChange={(val) => onChangeDhParams({ ...dhParams, x: parseInt(val || '0', 10) })}
            />
            <ParamInput
              label="Cat Rahasia Anya (y)"
              value={dhParams.y}
              disabled={!freeMode}
              accent="purple"
              onChange={(val) => onChangeDhParams({ ...dhParams, y: parseInt(val || '0', 10) })}
            />

            {!dhResult.valid && (
              <div className="rounded-xl border border-[#f27a7a]/40 bg-[#f27a7a]/10 px-3 py-2 text-[11px] leading-snug text-[#f27a7a]">
                {dhResult.error}
              </div>
            )}

            {dhResult.valid && (
              <div className="neu-sunk rounded-xl p-3 flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Campuran Lloyd (X)</span>
                  <span className="font-bold text-[#f08ac0]">{dhResult.X}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Campuran Anya (Y)</span>
                  <span className="font-bold text-[#8b7cf6]">{dhResult.Y}</span>
                </div>
                <div className="my-0.5 h-px bg-white/5" />
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Kunci Bersama (K)</span>
                  <span className="font-bold text-[#5fd6a4]">{dhResult.K_lloyd}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <ParamInput
              label="Bilangan Prima Publik (p)"
              value={egParams.p}
              disabled={!freeMode}
              onChange={(val) => onChangeEgParams({ ...egParams, p: parseInt(val || '0', 10) })}
            />
            <ParamInput
              label="Akar Primitif Publik (g)"
              value={egParams.g}
              disabled={!freeMode}
              onChange={(val) => onChangeEgParams({ ...egParams, g: parseInt(val || '0', 10) })}
            />
            <ParamInput
              label="Kunci Privat Anya (x)"
              value={egParams.x}
              disabled={!freeMode}
              accent="amber"
              onChange={(val) => onChangeEgParams({ ...egParams, x: parseInt(val || '0', 10) })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#7f89a3]">
                Pesan Rahasia (A–Z)
              </label>
              <input
                type="text"
                maxLength={8}
                disabled={!freeMode}
                value={egParams.message}
                onChange={(e) =>
                  onChangeEgParams({
                    ...egParams,
                    message: e.target.value.toUpperCase().replace(/[^A-Z]/g, ''),
                  })
                }
                className="neu-sunk w-full rounded-xl px-3 py-2 text-xs font-bold tracking-widest text-[#e8ecf5] outline-none focus:ring-1 focus:ring-[#8b7cf6] disabled:opacity-70"
                placeholder="INTEL"
              />
            </div>

            {freeMode && (
              <button
                type="button"
                onClick={onRandomizeK}
                className="neu-btn flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-[#f08ac0]"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Acak Ulang Segel (k)
              </button>
            )}

            {!egResult.valid && (
              <div className="rounded-xl border border-[#f27a7a]/40 bg-[#f27a7a]/10 px-3 py-2 text-[11px] leading-snug text-[#f27a7a]">
                {egResult.error}
              </div>
            )}

            {egResult.valid && (
              <div className="neu-sunk rounded-xl p-3 flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Gembok Publik (y)</span>
                  <span className="font-bold text-[#8b7cf6]">{egResult.y}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Jumlah Kotak</span>
                  <span className="font-bold text-[#e8ecf5]">{egResult.blocks.length} blok</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f89a3]">Hasil Dekripsi</span>
                  <span className="font-bold text-[#5fd6a4]">{egResult.decryptedMessage}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Camera Hint */}
      <div className="mt-auto px-1 text-[10px] leading-relaxed text-[#7f89a3]">
        Tip Presentasi: Seret layar 3D untuk memutar sudut kamera dan gulir mouse untuk memperbesar objek.
      </div>
    </aside>
  );
}

function ParamInput({
  label,
  value,
  disabled,
  accent = 'neutral',
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  accent?: 'neutral' | 'pink' | 'purple' | 'amber';
  onChange: (val: string) => void;
}) {
  const accentText =
    accent === 'pink'
      ? 'text-[#f08ac0]'
      : accent === 'purple'
      ? 'text-[#8b7cf6]'
      : accent === 'amber'
      ? 'text-[#f5b855]'
      : 'text-[#e8ecf5]';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-[#7f89a3]">{label}</label>
      <input
        type="number"
        disabled={disabled}
        value={Number.isNaN(value) ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        className={`neu-sunk w-full rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:ring-1 focus:ring-[#8b7cf6] disabled:opacity-75 ${accentText}`}
      />
    </div>
  );
}
