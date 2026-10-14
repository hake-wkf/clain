export type BlindStatus = 'idle' | 'opening' | 'closing' | 'stopped';

export type MotorSpeed = 'silent' | 'normal' | 'fast';

export type CurtainOpenType = 'vertical' | 'horizontal'; // 上下开合 | 左右开合

export interface BlindSettings {
  speed: MotorSpeed;
  openType: CurtainOpenType;
  reverseDirection: boolean;
  soundEnabled: boolean;
}
