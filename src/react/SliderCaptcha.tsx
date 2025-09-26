import React, { useEffect, useRef, useState } from "react";
import { SliderCaptcha as SliderCaptchaCore, SliderCaptchaOptions } from "../SliderCaptcha";
import "../slider-captcha.css";

export interface SliderCaptchaProps extends SliderCaptchaOptions {}

const SliderCaptcha: React.FC<SliderCaptchaProps> = (props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // maintain internal state so parent re-renders (like typing in login form) won't reset captcha
  const [captchaInstance, setCaptchaInstance] = useState<SliderCaptchaCore | null>(null);

  useEffect(() => {
    if (containerRef.current && !captchaInstance) {
      const instance = new SliderCaptchaCore({
        ...props,
        root: containerRef.current, // ensure root is always last and not overwritten
      });
      setCaptchaInstance(instance);
    }

    return () => {
      if (captchaInstance && typeof (captchaInstance as any).destroy === "function") {
        (captchaInstance as any).destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return <div ref={containerRef} role="application" aria-label="Slider captcha verification"></div>;
};

export default SliderCaptcha;
