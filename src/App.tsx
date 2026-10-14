import { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, ChevronLeft, Wifi } from 'lucide-react';
import { RollerBlindVisual } from './components/RollerBlindVisual.tsx';
import { ControlButtons } from './components/ControlButtons.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { BlindStatus, BlindSettings, MotorSpeed } from './types.ts';
import { soundController } from './utils/audio.ts';

const SPEED_CONFIG: Record<MotorSpeed, number> = {
  silent: 16,
  normal: 28,
  fast: 46,
};

export default function App() {
  const [openPercent, setOpenPercent] = useState<number>(75);
  const [status, setStatus] = useState<BlindStatus>('idle');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<BlindSettings>({
    speed: 'normal',
    openType: 'vertical',
    reverseDirection: false,
    soundEnabled: true,
  });

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const targetPercentRef = useRef<number | null>(null);
  const currentPercentRef = useRef<number>(75);

  useEffect(() => {
    currentPercentRef.current = openPercent;
  }, [openPercent]);

  const stopMotor = useCallback((manual: boolean = false) => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    lastTimeRef.current = null;
    targetPercentRef.current = null;
    setStatus('stopped');
    if (manual && settings.soundEnabled) {
      soundController.playStop(true);
    }
  }, [settings.soundEnabled]);

  const runMotorTo = useCallback((target: number, isOpeningAction: boolean) => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    targetPercentRef.current = target;
    setStatus(isOpeningAction ? 'opening' : 'closing');
    if (settings.soundEnabled) {
      soundController.playStart(true);
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const rate = SPEED_CONFIG[settings.speed];
      const change = rate * deltaSec;
      const current = currentPercentRef.current;
      const targetVal = targetPercentRef.current;

      if (targetVal === null) return;

      if (current < targetVal) {
        const nextVal = Math.min(targetVal, current + change);
        currentPercentRef.current = nextVal;
        setOpenPercent(nextVal);
        if (nextVal >= targetVal) {
          stopMotor(false);
          setStatus('idle');
          if (settings.soundEnabled) soundController.playStop(true);
          return;
        }
      } else if (current > targetVal) {
        const nextVal = Math.max(targetVal, current - change);
        currentPercentRef.current = nextVal;
        setOpenPercent(nextVal);
        if (nextVal <= targetVal) {
          stopMotor(false);
          setStatus('idle');
          if (settings.soundEnabled) soundController.playStop(true);
          return;
        }
      } else {
        stopMotor(false);
        setStatus('idle');
        return;
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  }, [settings.speed, settings.soundEnabled, stopMotor]);

  useEffect(() => {
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  // Core Operations: 开、停、关
  const handleOpen = () => {
    const target = settings.reverseDirection ? 0 : 100;
    if (Math.abs(openPercent - target) < 0.5) return;
    runMotorTo(target, !settings.reverseDirection);
  };

  const handleStop = () => {
    stopMotor(true);
  };

  const handleClose = () => {
    const target = settings.reverseDirection ? 100 : 0;
    if (Math.abs(openPercent - target) < 0.5) return;
    runMotorTo(target, settings.reverseDirection);
  };

  const handleDirectDrag = (newPercent: number) => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    currentPercentRef.current = newPercent;
    setOpenPercent(newPercent);
    setStatus('stopped');
  };

  const handleUpdateSettings = (newSettings: Partial<BlindSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen w-full bg-[#eef0f3] dark:bg-[#09090b] flex items-center justify-center p-0 sm:p-5 select-none font-sans">
      
      {/* Authentic Mobile Phone Shell with Standard 9:19.5 Proportion */}
      <div className="w-full sm:w-[375px] h-dvh sm:h-[780px] sm:max-h-[94vh] bg-[#faf9f6] dark:bg-[#151517] text-neutral-900 dark:text-neutral-100 sm:rounded-[46px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:border-[9px] sm:border-[#1c1c1e] flex flex-col justify-between overflow-hidden relative transition-all">
        
        {/* Ambient Natural Sunlight Aura */}
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-amber-100/40 dark:bg-amber-400/5 blur-3xl pointer-events-none transition-opacity duration-500"
          style={{ opacity: 0.15 + (openPercent / 100) * 0.65 }}
        />

        {/* Top Area: Mobile Status Bar & Navigation */}
        <div className="shrink-0 pt-3 px-5 z-20">
          
          {/* iOS / Mobile Status Bar (Time, Dynamic Island, Signals) */}
          <div className="flex items-center justify-between h-7 text-xs font-semibold px-1 text-neutral-800 dark:text-neutral-200">
            <span className="w-12 tracking-tight">9:41</span>
            
            {/* Dynamic Island Capsule */}
            <div className="w-22 h-4.5 bg-black rounded-full mx-auto" />
            
            {/* Signal, WiFi, Battery Icons */}
            <div className="w-12 flex items-center justify-end gap-1.5 opacity-80">
              {/* Cellular Bars */}
              <div className="flex items-end gap-[1.5px] h-2.5">
                <span className="w-[2.5px] h-1 bg-current rounded-xs" />
                <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
                <span className="w-[2.5px] h-2 bg-current rounded-xs" />
                <span className="w-[2.5px] h-2.5 bg-current rounded-xs" />
              </div>
              <Wifi className="w-3 h-3" />
              {/* Battery */}
              <div className="w-4.5 h-2.5 rounded-[3px] border border-current p-[1px] flex items-center">
                <div className="w-2.5 h-full bg-current rounded-xs" />
              </div>
            </div>
          </div>

          {/* App Header Bar: Back Button, Room Title, Right Settings Button */}
          <header className="flex items-center justify-between h-11 mt-1">
            <button
              type="button"
              aria-label="返回"
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <h1 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              客厅窗帘
            </h1>

            {/* Top-Right Settings Button */}
            <button
              type="button"
              onClick={() => {
                if (settings.soundEnabled) soundController.playTap(true);
                setIsSettingsOpen(true);
              }}
              aria-label="设置"
              className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors active:scale-95"
            >
              <Settings className="w-5 h-5 stroke-[1.9]" />
            </button>
          </header>
        </div>

        {/* Center: Minimalist Roller Blind Visual Display & Touch Track */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-1 z-10">
          <RollerBlindVisual
            openPercent={openPercent}
            status={status}
            openType={settings.openType}
            onPositionChange={handleDirectDrag}
            onDragStart={() => {
              if (animRef.current !== null) {
                cancelAnimationFrame(animRef.current);
                animRef.current = null;
              }
            }}
          />
        </main>

        {/* Bottom Thumb Zone: 3 Core Operation Buttons [开, 停, 关] */}
        <footer className="shrink-0 px-4 pb-3 z-10 flex flex-col items-center">
          <ControlButtons
            status={status}
            openPercent={openPercent}
            openType={settings.openType}
            onOpen={handleOpen}
            onStop={handleStop}
            onClose={handleClose}
          />

          {/* Mobile Phone Home Indicator Bar */}
          <div className="w-28 h-1 rounded-full bg-neutral-400/50 dark:bg-neutral-600 mt-5 mb-1" />
        </footer>

        {/* Settings Modal (Right-top button opens this) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
}
