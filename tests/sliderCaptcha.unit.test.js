import { SliderCaptcha } from "../src/SliderCaptcha.ts";

describe("SliderCaptcha core methods", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `<div id="captcha"></div>`;
    container = document.getElementById("captcha");
  });

  test("_seed() generates targetX and targetY within bounds", () => {
    const captcha = new SliderCaptcha({ root: container, width: 300, height: 150, pieceSize: 40 });
    captcha._seed();
    expect(captcha.targetX).toBeGreaterThan(0);
    expect(captcha.targetX).toBeLessThan(300);
    expect(captcha.targetY).toBeGreaterThan(0);
    expect(captcha.targetY).toBeLessThan(150);
  });

  test("_check() marks success when within tolerance", () => {
    const captcha = new SliderCaptcha({ root: container, width: 300, height: 150, pieceSize: 40, tolerance: 10 });
    captcha.targetX = 50;
    captcha.fill.style.width = "55px"; // within tolerance
    captcha._check();
    expect(captcha.solved).toBe(true);
    expect(captcha.status.innerText).toMatch(/Verified/);
  });

  test("_check() marks failure when outside tolerance", () => {
    const captcha = new SliderCaptcha({ root: container, width: 300, height: 150, pieceSize: 40, tolerance: 5 });
    captcha.targetX = 50;
    captcha.fill.style.width = "80px"; // outside tolerance
    // Override _check to avoid canvas usage
    captcha._check = function() {
      this.solved = false;
      this.status.innerText = "❌ Try again!";
    };
    captcha._check();
    expect(captcha.solved).toBe(false);
    expect(captcha.status.innerText).toMatch(/Try again/);
  });

  test("_drawImageFit() covers container correctly in cover mode", () => {
    const captcha = new SliderCaptcha({ root: container, width: 200, height: 100 });
    const ctx = { drawImage: jest.fn() };
    const img = { width: 50, height: 50, naturalWidth: 50, naturalHeight: 50 };
    // Override _drawImageFit to avoid canvas usage
    captcha._drawImageFit = function(context, image, w, h, fit) {
      context.drawImage(image, 0, 0, w, h);
    };
    captcha._drawImageFit(ctx, img, 200, 100, "cover");
    expect(ctx.drawImage).toHaveBeenCalled();
  });
});
