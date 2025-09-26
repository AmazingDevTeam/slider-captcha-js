import { SliderCaptcha } from "../../src/SliderCaptcha";
import "../../src/slider-captcha.css";

const root = document.getElementById("captcha");

if (root) {
  const captcha = new SliderCaptcha({
    root,
    width: 320,
    height: 160,
    onSuccess: () => console.log("Verified!"),
    onFail: () => console.log("Try again"),
  });

  captcha.refresh();
}
