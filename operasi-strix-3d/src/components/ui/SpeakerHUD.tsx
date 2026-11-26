import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, RotateCw, Sparkles } from 'lucide-react';
import { StageNarration } from '../../data/narratives';

interface SpeakerHUDProps {
  narrations: StageNarration[];
  currentStep: number;
  onSelectStep: (step: number) => void;
  onReplay: () => void;
}

const toneClasses: Record<string, string> = {
  purple: 'border-[#8b7cf6]/40 bg-[#8b7cf6]/10 text-[#c4bcff]',
  pink: 'border-[#f08ac0]/40 bg-[#f08ac0]/10 text-[#f8b9db]',
  green: 'border-[#5fd6a4]/45 bg-[#5fd6a4]/12 text-[#8be8c2]',
  amber: 'border-[#f5b855]/45 bg-[#f5b855]/10 text-[#fad58c]',
  neutral: 'border-white/10 bg-[#1a1e29] text-[#cbd5e1]',
};

export function SpeakerHUD({
  narrations,
  currentStep,
  onSelectStep,
  onReplay,
}: SpeakerHUDProps) {
  const active = narrations.find((n) => n.step === currentStep) ?? narrations[0];
  const isFirst = currentStep <= 1;
  const isLast = currentStep >= narrations.length;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:p-5">
      <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col gap-3">
        {/* Step Timeline Pills & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="neu-card-sm flex items-center gap-1.5 rounded-2xl p-1.5">
            {narrations.map((item) => {
              const isActive = item.step === currentStep;
              const isDone = item.step < currentStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => onSelectStep(item.step)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#8b7cf6] text-white shadow-md shadow-[#8b7cf6]/30'
                      : isDone
                      ? 'bg-[#5fd6a4]/15 text-[#5fd6a4] hover:bg-[#5fd6a4]/25'
                      : 'text-[#7f89a3] hover:text-[#e8ecf5]'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/20 text-[10px] font-bold">
                    {item.step}
                  </span>
                  <span className="hidden sm:inline">{item.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="neu-btn flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#e8ecf5]"
              title="Putar ulang animasi tahap ini"
            >
              <RotateCw className="h-3.5 w-3.5 text-[#8b7cf6]" />
              <span className="hidden sm:inline">Ulangi Animasi</span>
            </button>

            <button
              type="button"
              disabled={isFirst}
              onClick={() => onSelectStep(currentStep - 1)}
              className="neu-btn flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-[#e8ecf5] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>

            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  onSelectStep(1);
                } else {
                  onSelectStep(currentStep + 1);
                }
              }}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8b7cf6] to-[#f08ac0] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#8b7cf6]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isLast ? 'Mulai Ulang Misi' : 'Langkah Selanjutnya'}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Speaker Narration Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active.step}-${active.headline}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="neu-card rounded-2xl p-4 backdrop-blur-md bg-[#232939]/95"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#8b7cf6]/20 border border-[#8b7cf6]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#c4bcff]">
                    <Sparkles className="h-3 w-3" />
                    Narasi Presentasi
                  </span>
                  <h2 className="text-sm font-bold text-[#e8ecf5]">{active.headline}</h2>
                </div>
                <span className="rounded-full border border-[#5fd6a4]/35 bg-[#5fd6a4]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#5fd6a4]">
                  {active.analogyBadge}
                </span>
              </div>

              <p className="text-xs md:text-[13px] leading-relaxed text-[#cbd5e1]">
                {active.speakerText}
              </p>

              {/* Live Data Highlights */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {active.highlights.map((h, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] ${toneClasses[h.tone]}`}
                  >
                    <span className="opacity-75">{h.label}:</span>
                    <span className="font-bold">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
