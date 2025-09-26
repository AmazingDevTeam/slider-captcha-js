/**
 * Simple functional slider captcha implementation (TypeScript version).
 */
export interface SliderCaptchaOptions {
  id: string | HTMLElement;
  width?: number;
  height?: number;
  loadingText?: string;
  failedText?: string;
  barText?: string;
  repeatIcon?: string;
  setSrc?: () => string | null;
  onSuccess?: (data?: any) => void;
  onFail?: (data?: any) => void;
  onRefresh?: () => void;
  verifyUrl?: string;
  token?: string;
  successText?: string;
  className?: string;
}

export function sliderCaptcha(options: SliderCaptchaOptions = { id: "" }) {
  const {
    id,
    width = 320,
    height = 160,
    loadingText = "Loading...",
    failedText = "Try again",
    barText = "Slide right to fill",
    repeatIcon = "↻",
    setSrc = null,
    onSuccess = () => {},
    onFail = () => {},
    onRefresh = () => {},
    verifyUrl,
    token,
    successText,
    className
  } = options;

  const root = typeof id === "string" ? document.getElementById(id) : id;
  if (!root) throw new Error("sliderCaptcha: root element not found");

  const stage = document.createElement("div");
  stage.className = "slider-captcha-stage " + (className || "");
  stage.style.width = width + "px";
  stage.style.height = height + "px";
  root.appendChild(stage);

  const bar = document.createElement("div");
  bar.className = "slider-captcha-bar";
  bar.style.width = width + "px";
  bar.innerText = barText;
  bar.setAttribute("role", "slider");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.setAttribute("aria-valuenow", "0");
  bar.setAttribute("tabindex", "0");
  root.appendChild(bar);

  const refreshBtn = document.createElement("span");
  refreshBtn.className = "slider-captcha-refresh";
  refreshBtn.innerHTML = repeatIcon;
  refreshBtn.setAttribute("role", "button");
  refreshBtn.setAttribute("aria-label", "Refresh captcha");
  refreshBtn.setAttribute("tabindex", "0");
  bar.appendChild(refreshBtn);

  refreshBtn.addEventListener("click", () => {
    onRefresh();
  });
  refreshBtn.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRefresh();
    }
  });

  // Handle image source if provided
  if (typeof setSrc === "function") {
    const img = new Image();
    const src = setSrc();
    if (src) {
      bar.innerText = loadingText;
      img.src = src;
      img.onload = () => {
        stage.style.backgroundImage = `url(${img.src})`;
        stage.style.backgroundSize = "cover";
        bar.innerText = barText;
      };
      img.onerror = () => {
        console.warn("sliderCaptcha: failed to load image from setSrc()");
        bar.innerText = failedText;
      };
    }
  }

  function verify() {
    if (verifyUrl) {
      fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token || null,
          sliderValue: 100
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            bar.innerText = successText || "✔ Verified";
            bar.setAttribute("aria-valuenow", "100");
            onSuccess(data);
          } else {
            bar.innerText = failedText;
            bar.setAttribute("aria-valuenow", "0");
            onFail(data);
          }
        })
        .catch(() => {
          bar.innerText = "Server error";
          bar.setAttribute("aria-valuenow", "0");
          onFail();
        });
    } else {
      if (Math.random() > 0.5) {
        bar.innerText = successText || "✔ Verified";
        bar.setAttribute("aria-valuenow", "100");
        onSuccess();
      } else {
        bar.innerText = failedText;
        bar.setAttribute("aria-valuenow", "0");
        onFail();
      }
    }
  }

  bar.addEventListener("click", verify);
  bar.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter") {
      e.preventDefault();
      verify();
    }
  });

  return { refresh: onRefresh };
}
