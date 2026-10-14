import React, { useRef, useState, useEffect, useCallback } from 'react';
import { BlindStatus, CurtainOpenType } from '../types.ts';

interface RollerBlindVisualProps {
  openPercent: number; // 0 (closed) to 100 (fully open)
  status: BlindStatus;
  openType?: CurtainOpenType;
  onPositionChange: (newPercent: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const RollerBlindVisual: React.FC<RollerBlindVisualProps> = ({
  openPercent,
  status,
  openType = 'vertical',
  onPositionChange,
  onDragStart,
  onDragEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Minimum exposure constants (so fabric is always clearly visible even when 100% open)
  const MIN_VERTICAL_VISIBLE = 15; // 15% height always exposed at top
  const MIN_HORIZONTAL_VISIBLE = 15; // 15% width on each side always exposed at sides

  // Vertical curtain height: 15% (when 100% open) to 100% (when 0% open)
  const verticalVisibleHeight =
    MIN_VERTICAL_VISIBLE + ((100 - MIN_VERTICAL_VISIBLE) * (100 - openPercent)) / 100;

  // Horizontal curtain panel width: 15% (when 100% open) to 50% (when 0% open)
  const horizontalPanelWidth =
    MIN_HORIZONTAL_VISIBLE + ((50 - MIN_HORIZONTAL_VISIBLE) * (100 - openPercent)) / 100;

  // Pointer position update
  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (openType === 'horizontal') {
        const trackWidth = rect.width;
        if (trackWidth <= 0) return;
        const centerX = rect.left + trackWidth / 2;
        const distFromCenter = Math.abs(clientX - centerX);
        const halfWidth = trackWidth / 2;
        // Map 0 at center (0% open) to halfWidth * 0.85 at outer boundary (100% open)
        const maxInteractiveDist = halfWidth * 0.88;
        const newOpen = Math.round(Math.min(100, (distFromCenter / maxInteractiveDist) * 100));
        onPositionChange(Math.max(0, Math.min(100, newOpen)));
      } else {
        const trackHeight = rect.height;
        if (trackHeight <= 0) return;
        const relativeY = clientY - rect.top;
        const clampedY = Math.max(0, Math.min(trackHeight, relativeY));
        // Map top 15% to 100% open, bottom 100% to 0% open
        const minY = trackHeight * (MIN_VERTICAL_VISIBLE / 100);
        if (clampedY <= minY) {
          onPositionChange(100);
        } else {
          const ratio = (clampedY - minY) / (trackHeight - minY);
          const newOpen = Math.round((1 - ratio) * 100);
          onPositionChange(Math.max(0, Math.min(100, newOpen)));
        }
      }
    },
    [openType, onPositionChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart?.();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.();
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore
      }
    }
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.();
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging, onDragEnd]);

  const getStatusText = () => {
    if (status === 'opening') return '正在拉开窗帘...';
    if (status === 'closing') return '正在合上窗帘...';
    if (status === 'stopped') return '已暂停';
    if (openPercent >= 99.5) return '已完全打开';
    if (openPercent <= 0.5) return '已完全合上';
    return '已就绪';
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center select-none px-1">
      {/* Status Indicator */}
      <div className="w-full max-w-[325px] flex items-center justify-center px-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-normal">
          {status === 'opening' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {status === 'closing' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          )}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Household Window Frame (Clean architectural window with radiant sunshine) */}
      <div className="relative w-full max-w-[325px] h-[360px] rounded-2xl bg-white dark:bg-stone-900 p-1.5 border border-stone-200/90 dark:border-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
        
        {/* Elegant Minimalist Home Curtain Valance / Pelmet (家居极简窗帘盒与静音滑轨) */}
        <div className="w-full h-4.5 rounded-t-xl bg-gradient-to-b from-stone-100 via-white to-stone-100 dark:from-stone-800 dark:via-stone-750 dark:to-stone-800 shadow-xs flex items-center justify-between px-4 relative z-20 border-b border-stone-200/60 dark:border-stone-750">
          <div className="w-8 h-[2px] rounded-full bg-stone-300 dark:bg-stone-600 opacity-60" />
          <div className="flex-1 mx-3 flex items-center justify-around opacity-40">
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
          </div>
          <div className="w-8 h-[2px] rounded-full bg-stone-300 dark:bg-stone-600 opacity-60" />
        </div>

        {/* Window Pane and Curtain Motion Track Area */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`relative w-full flex-1 rounded-b-xl overflow-hidden touch-none ${
            openType === 'horizontal' ? 'cursor-ew-resize' : 'cursor-ns-resize'
          }`}
        >
          {/* Minimalist Window with Natural Sunlight (极简阳光窗户背景) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* 1. Clear Blue Sky to Warm Horizon Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#cce5fc] via-[#eaf3fb] to-[#fcf7ec] dark:from-[#172738] dark:via-[#1c222a] dark:to-[#24211a]" />

            {/* 2. Warm Sun Disc (右上角温暖阳光光芒) */}
            <div
              className="absolute -top-10 -right-6 w-44 h-44 rounded-full bg-gradient-to-br from-[#fff7d6] via-[#ffe89e] to-transparent dark:from-amber-400/20 dark:via-amber-500/10 blur-xl transition-all duration-300"
              style={{
                opacity: 0.5 + (openPercent / 100) * 0.5,
                transform: `scale(${0.92 + (openPercent / 100) * 0.16})`,
              }}
            />

            {/* 3. Diagonal Sunbeam Stream (斜照室内的温暖阳光光束) */}
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: 0.4 + (openPercent / 100) * 0.6,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 248, 220, 0.45) 30%, rgba(255, 238, 185, 0.15) 60%, transparent 85%)',
              }}
            />

            {/* 4. Fine Subtle Light Streaks (轻盈透明阳光漫射光缕) */}
            <div
              className="absolute -top-10 -left-10 w-[140%] h-[140%] pointer-events-none transition-opacity duration-300"
              style={{
                opacity: 0.2 + (openPercent / 100) * 0.5,
                background:
                  'repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.2) 32px, rgba(255, 250, 230, 0.03) 32px, rgba(255, 250, 230, 0.03) 64px)',
              }}
            />

            {/* 5. Minimalist Window Pane Grids (极简大雅的现代窗格) */}
            <div className="absolute inset-0">
              {/* Upper Horizontal Bar */}
              <div className="absolute top-[36%] left-0 right-0 h-[2px] bg-white/75 dark:bg-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" />
              {/* Lower Horizontal Bar */}
              <div className="absolute top-[68%] left-0 right-0 h-[1.5px] bg-white/60 dark:bg-white/15" />
              {/* Vertical Mullion */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -ml-[1px] bg-white/75 dark:bg-white/20 shadow-[1px_0_3px_rgba(0,0,0,0.04)]" />
            </div>

            {/* 6. Clean Specular Glass Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 dark:to-white/5 pointer-events-none" />

            {/* 7. Bottom Sill Sunlight Pool (窗台明亮阳光投影) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-200/35 dark:from-amber-400/10 to-transparent transition-opacity duration-300"
              style={{ opacity: 0.2 + (openPercent / 100) * 0.8 }}
            />
          </div>

          {/* MODE A: Vertical Curtain (上下开合布艺升降帘) */}
          {openType === 'vertical' && (
            <div
              className="absolute top-0 left-0 right-0 z-10 transition-[height] ease-out will-change-[height]"
              style={{
                height: `${verticalVisibleHeight}%`,
                transitionDuration: isDragging ? '0ms' : '90ms',
              }}
            >
              {/* Fabric Body: Warm Cream/Linen with Soft Vertical Drape Folds */}
              <div className="w-full h-full relative overflow-hidden bg-[#faf8f4] dark:bg-[#2b2926] shadow-[0_8px_18px_rgba(0,0,0,0.1)]">
                {/* Vertical Drape Waves & Soft Fabric Folds */}
                <div
                  className="absolute inset-0 opacity-40 dark:opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0px, rgba(0,0,0,0.03) 12px, rgba(0,0,0,0.08) 24px, rgba(255,255,255,0.85) 36px, rgba(255,255,255,0.95) 48px)',
                  }}
                />

                {/* Delicate Linen Texture Grain */}
                <div
                  className="absolute inset-0 opacity-15 dark:opacity-10 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />

                {/* Side Edge Drapery Shadows */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-stone-400/15 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-stone-400/15 to-transparent pointer-events-none" />

                {/* Soft Translucent Light Filtering Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-100/25 via-transparent to-stone-400/10 pointer-events-none" />

                {/* Always-visible Tailored Fabric Bottom Hem (拉到头时始终露出的精致包缝与坠饰，清晰表明窗帘身份) */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#f4f0e6] dark:bg-[#34312d] border-t border-stone-200/90 dark:border-stone-700/80 flex flex-col justify-center items-center shadow-xs">
                  <div className="w-full border-t border-dashed border-stone-300 dark:border-stone-600 mb-1 opacity-60" />
                  <div className="w-7 h-1.5 rounded-full bg-stone-300/80 dark:bg-stone-500/60" />
                </div>
              </div>

              {/* Soft Warm Drapery Shadow onto Window */}
              <div className="w-full h-3 -mb-3 bg-gradient-to-b from-stone-900/14 to-transparent pointer-events-none" />

              {/* Discreet Position Slider Bead */}
              <div
                className="absolute right-2 w-1.5 h-4 rounded-full bg-stone-400/60 dark:bg-stone-500/60 pointer-events-none transition-all duration-150 shadow-xs"
                style={{
                  top: `calc(${verticalVisibleHeight}% - 8px)`,
                }}
              />
            </div>
          )}

          {/* MODE B: Horizontal Curtain (左右开合对开布艺窗帘) */}
          {openType === 'horizontal' && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Left Curtain Panel (左侧窗帘幅 - 拉到头时保留宽厚的束叠褶皱布身) */}
              <div
                className="absolute top-0 bottom-0 left-0 transition-[width] ease-out will-change-[width] overflow-hidden"
                style={{
                  width: `${horizontalPanelWidth}%`,
                  transitionDuration: isDragging ? '0ms' : '90ms',
                }}
              >
                <div className="w-full h-full relative overflow-hidden bg-[#faf8f4] dark:bg-[#2b2926] shadow-[3px_0_14px_rgba(0,0,0,0.12)] border-r border-stone-200/90 dark:border-stone-700">
                  {/* Rich Vertical Drape Waves */}
                  <div
                    className="absolute inset-0 opacity-45 dark:opacity-30"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(0,0,0,0.04) 8px, rgba(0,0,0,0.1) 16px, rgba(255,255,255,0.9) 24px)',
                    }}
                  />
                  {/* Linen Texture */}
                  <div
                    className="absolute inset-0 opacity-15 dark:opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
                      backgroundSize: '4px 4px',
                    }}
                  />
                  {/* Leading Edge Hem with Soft Shading */}
                  <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-stone-300/40 to-transparent border-r border-stone-300/80 dark:border-stone-600" />
                  
                  {/* Soft Curtain Tieback / Waist Contour Hint when pulled open */}
                  {openPercent > 50 && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-1 w-2.5 h-12 rounded-l-md bg-stone-300/40 dark:bg-stone-600/40 border border-stone-300/60 dark:border-stone-500/60" />
                  )}
                </div>
              </div>

              {/* Right Curtain Panel (右侧窗帘幅 - 拉到头时保留宽厚的束叠褶皱布身) */}
              <div
                className="absolute top-0 bottom-0 right-0 transition-[width] ease-out will-change-[width] overflow-hidden"
                style={{
                  width: `${horizontalPanelWidth}%`,
                  transitionDuration: isDragging ? '0ms' : '90ms',
                }}
              >
                <div className="w-full h-full relative overflow-hidden bg-[#faf8f4] dark:bg-[#2b2926] shadow-[-3px_0_14px_rgba(0,0,0,0.12)] border-l border-stone-200/90 dark:border-stone-700">
                  {/* Rich Vertical Drape Waves */}
                  <div
                    className="absolute inset-0 opacity-45 dark:opacity-30"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.04) 16px, rgba(255,255,255,0.8) 24px)',
                    }}
                  />
                  {/* Linen Texture */}
                  <div
                    className="absolute inset-0 opacity-15 dark:opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)',
                      backgroundSize: '4px 4px',
                    }}
                  />
                  {/* Leading Edge Hem with Soft Shading */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-stone-300/40 to-transparent border-l border-stone-300/80 dark:border-stone-600" />

                  {/* Soft Curtain Tieback / Waist Contour Hint when pulled open */}
                  {openPercent > 50 && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-1 w-2.5 h-12 rounded-r-md bg-stone-300/40 dark:bg-stone-600/40 border border-stone-300/60 dark:border-stone-500/60" />
                  )}
                </div>
              </div>

              {/* Center Split Alignment Guide Dot when near closed */}
              {openPercent < 85 && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-stone-300/60 dark:bg-stone-600/60 pointer-events-none"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-2 font-normal">
        {openType === 'horizontal'
          ? '轻触或左右滑动窗帘调节开合'
          : '轻触或上下滑动窗帘调节开合'}
      </span>
    </div>
  );
};
