import React from 'react';
import { X, Volume2, Gauge, Compass, ArrowUpDown, ArrowLeftRight } from 'lucide-react';
import { BlindSettings, MotorSpeed, CurtainOpenType } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BlindSettings;
  onUpdateSettings: (newSettings: Partial<BlindSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const speedOptions: { id: MotorSpeed; label: string; desc: string }[] = [
    { id: 'silent', label: '静音', desc: '平稳静音' },
    { id: 'normal', label: '标准', desc: '日常速度' },
    { id: 'fast', label: '快速', desc: '高效升降' },
  ];

  const openTypeOptions: { id: CurtainOpenType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'vertical',
      label: '上下开合',
      icon: <ArrowUpDown className="w-3.5 h-3.5" />,
    },
    {
      id: 'horizontal',
      label: '左右开合',
      icon: <ArrowLeftRight className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-[380px] bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            设置
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="py-4 space-y-5">
          {/* 开合方式 (上下开合 / 左右开合) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                开合方式
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl">
              {openTypeOptions.map((opt) => {
                const isActive = settings.openType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateSettings({ openType: opt.id })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs transition-all select-none ${
                      isActive
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motor Speed */}
          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-neutral-500" />
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                运行速度
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {speedOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ speed: opt.id })}
                  className={`py-2 px-1 text-center rounded-xl text-xs border transition-all ${
                    settings.speed === opt.id
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent font-medium shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Direction Invert */}
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  电机方向反转
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  反转开与关的方向
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.reverseDirection}
              onClick={() => onUpdateSettings({ reverseDirection: !settings.reverseDirection })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.reverseDirection ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white dark:bg-neutral-900 w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  settings.reverseDirection ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Enabled */}
          <div className="flex items-center justify-between py-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                  按键触控音效
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  点击及到位声音反馈
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white dark:bg-neutral-900 w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-medium rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 transition-colors active:scale-[0.99]"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
