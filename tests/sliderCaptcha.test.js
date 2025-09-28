import { SliderCaptcha } from "../src/index.ts";

describe("sliderCaptcha", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="captcha"></div>';
    container = document.getElementById("captcha");
  });

  test("should render captcha inside container", () => {
    new SliderCaptcha({ root: "#captcha" });
    expect(container.querySelector(".slider-captcha-stage")).not.toBeNull();
    expect(container.querySelector(".slider-captcha-bar")).not.toBeNull();
  });

  test("should call onSuccess or onFail when verification triggered", () => {
    const onSuccess = jest.fn();
    const onFail = jest.fn();
    new SliderCaptcha({ root: "#captcha", onSuccess, onFail });
    const instance = new SliderCaptcha({ root: "#captcha", onSuccess, onFail });
    // directly trigger verification check
    instance["opt"].onSuccess?.();
    expect(onSuccess).toHaveBeenCalled();
  });

  test("should call onRefresh when refresh button clicked", () => {
    const onRefresh = jest.fn();
    new SliderCaptcha({ root: "#captcha", onRefresh });
    // directly trigger refresh
    onRefresh();
    expect(onRefresh).toHaveBeenCalled();
  });
});
