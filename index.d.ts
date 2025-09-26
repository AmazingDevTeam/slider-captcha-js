export interface SliderCaptchaOptions {
  root: HTMLElement | string | null;
  width?: number | string;
  height?: number;
  pieceSize?: number;
  tolerance?: number;
  imageUrl?: string | null;
  fit?: "cover" | "contain" | "stretch";
  crossOrigin?: string | null;
  theme?: "light" | "dark";
  onSuccess?: () => void;
  onFail?: () => void;
  onRefresh?: () => void;
  onVerify?: (data: VerifyParam) => Promise<boolean> | boolean;
  successText?: string;
  failText?: string;
}

export interface VerifyParam {
  duration: number;
  trail: [number, number][];
  targetType: "puzzle" | "button";
  [key: string]: any;
}

export class SliderCaptcha {
  constructor(options?: SliderCaptchaOptions);
  refresh(): void;
  destroy(): void;
}

import * as React from "react";

export interface SliderCaptchaReactProps extends SliderCaptchaOptions {
  verified?: boolean;
}

declare const SliderCaptchaReact: React.FC<SliderCaptchaReactProps>;
export default SliderCaptchaReact;
