import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { SliderCaptcha as SliderCaptchaCore, SliderCaptchaOptions } from "../SliderCaptcha";
import "../slider-captcha.css";

export interface SliderCaptchaProps extends SliderCaptchaOptions {}
export interface SliderCaptchaRef {
  refresh: () => void;
  destroy: () => void;
}

const SliderCaptcha = forwardRef<SliderCaptchaRef, SliderCaptchaProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [captchaInstance, setCaptchaInstance] = useState<SliderCaptchaCore | null>(null);

  useEffect(() => {
    if (containerRef.current && !captchaInstance) {
      const instance = new SliderCaptchaCore({
        ...props,
        root: containerRef.current,
      });
      setCaptchaInstance(instance);
    }

    return () => {
      captchaInstance?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    refresh: () => captchaInstance?.refresh(),
    destroy: () => captchaInstance?.destroy(),
  }));

  return <div ref={containerRef} role="application" aria-label="Slider captcha verification"></div>;
});

export default SliderCaptcha;
