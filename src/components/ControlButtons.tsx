import React from 'react';
import { ChevronUp, Square, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlindStatus, CurtainOpenType } from '../types.ts';

interface ControlButtonsProps {
  status: BlindStatus;
  openPercent: number;
  openType?: CurtainOpenType;
  onOpen: () => void;
  onStop: () => void;
  onClose: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  status,
  openType = 'vertical',
  onOpen,
  onStop,
  onClose,
}) => {
  const isOpening = status === 'opening';
  const isClosing = status === 'closing';

  return (
    <div className="w-full max-w-[325px]">
      {/* 3 Core Action Buttons: 开、停、关 */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 开 (Open) */}
        <button
          type="button"
          onClick={onOpen}
          aria-label="打开窗帘"
          className={`flex flex-col items-center justify-center h-18 rounded-2xl transition-all duration-150 select-none active:scale-[0.96] touch-manipulation border ${
            isOpening
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md border-transparent ring-2 ring-emerald-500/30'
              : 'bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 border-neutral-200/90 dark:border-neutral-700/70 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <div
            className={`p-1 rounded-full mb-0.5 transition-colors ${
              isOpening ? 'text-emerald-400 dark:text-emerald-600' : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {openType === 'horizontal' ? (
              <div className="flex items-center -space-x-1.5">
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.4]" />
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
            ) : (
              <ChevronUp className="w-5 h-5 stroke-[2.4]" />
            )}
          </div>
          <span className="text-xs font-medium tracking-wide">开</span>
        </button>

        {/* 停 (Stop) */}
        <button
          type="button"
          onClick={onStop}
          aria-label="停止窗帘"
          className={`flex flex-col items-center justify-center h-18 rounded-2xl transition-all duration-150 select-none active:scale-[0.96] touch-manipulation border ${
            status === 'stopped'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-600 shadow-sm'
              : 'bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 border-neutral-200/90 dark:border-neutral-700/70 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <div className="p-1 rounded-full mb-0.5 text-neutral-600 dark:text-neutral-300">
            <Square className="w-3.5 h-3.5 fill-current stroke-none" />
          </div>
          <span className="text-xs font-medium tracking-wide">停</span>
        </button>

        {/* 关 (Close) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭窗帘"
          className={`flex flex-col items-center justify-center h-18 rounded-2xl transition-all duration-150 select-none active:scale-[0.96] touch-manipulation border ${
            isClosing
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md border-transparent ring-2 ring-amber-500/30'
              : 'bg-white text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 border-neutral-200/90 dark:border-neutral-700/70 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <div
            className={`p-1 rounded-full mb-0.5 transition-colors ${
              isClosing ? 'text-amber-400 dark:text-amber-600' : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {openType === 'horizontal' ? (
              <div className="flex items-center -space-x-1.5">
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.4]" />
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
            ) : (
              <ChevronDown className="w-5 h-5 stroke-[2.4]" />
            )}
          </div>
          <span className="text-xs font-medium tracking-wide">关</span>
        </button>
      </div>
    </div>
  );
};
