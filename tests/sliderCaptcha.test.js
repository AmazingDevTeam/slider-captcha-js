import { sliderCaptcha } from "../src/index.ts";

describe("sliderCaptcha", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '<div id="captcha"></div>';
    container = document.getElementById("captcha");
  });

  test("should render captcha inside container", () => {
    sliderCaptcha({ id: "captcha" });
    expect(container.querySelector(".slider-captcha-stage")).not.toBeNull();
    expect(container.querySelector(".slider-captcha-bar")).not.toBeNull();
  });

  test("should call onSuccess or onFail when verification triggered", () => {
    const onSuccess = jest.fn();
    const onFail = jest.fn();
    sliderCaptcha({ id: "captcha", onSuccess, onFail });
    const bar = container.querySelector(".slider-captcha-bar");
    bar.click();
    // Since success/fail is random, ensure at least one callback is called
    expect(onSuccess.mock.calls.length + onFail.mock.calls.length).toBeGreaterThan(0);
  });

  test("should call onRefresh when refresh button clicked", () => {
    const onRefresh = jest.fn();
    sliderCaptcha({ id: "captcha", onRefresh });
    const refreshBtn = container.querySelector(".slider-captcha-refresh");
    refreshBtn.click();
    expect(onRefresh).toHaveBeenCalled();
  });
});
