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
  onVerify?: (data: VerifyParam) => Promise<any>;
  request?: () => Promise<{ bgUrl: string; puzzleUrl: string }>;
  successText?: string;
  failText?: string;
}

export interface VerifyParam {
  duration: number;
  trail: [number, number][];
  targetType: "puzzle" | "button";
  [key: string]: any;
}

export const defaultConfig = {
  bgSize: {
    width: 320,
    height: 160
  },
  puzzleSize: {
    width: 60,
    left: 0
  }
};

export class SliderCaptcha {
  private opt: SliderCaptchaOptions;
  private root: HTMLElement;
  private stage: HTMLDivElement;
  private bgCanvas: HTMLCanvasElement;
  private cutCanvas: HTMLCanvasElement;
  private pieceCanvas: HTMLCanvasElement;
  private bar: HTMLDivElement;
  private track: HTMLDivElement;
  private fill: HTMLDivElement;
  private thumb: HTMLDivElement;
  private status: HTMLDivElement;
  private refreshBtn: HTMLDivElement;
  private loadingBox: HTMLDivElement;
  private numericWidth: number;
  private numericHeight: number;
  private targetX!: number;
  private targetY!: number;
  private solved: boolean = false;
  private _piecePath?: Path2D;
  private _puzzleImage?: HTMLImageElement;
  private _dpr: number = window.devicePixelRatio || 1;
  private _startTime?: number;
  private _trail?: any[];
  private _targetType?: string;
  private _startY?: number;
  private _deltaY?: number;
  private _errorCount?: number;

  private bgImgEl: HTMLImageElement;
  private pieceImgEl: HTMLImageElement;

  constructor(opts: SliderCaptchaOptions = { root: null }) {
    this.opt = Object.assign(
      {
        root: null,
        width: 320,
        height: 160,
        pieceSize: 44,
        tolerance: 6,
        imageUrl: null,
        fit: "cover",
        crossOrigin: null,
        theme: "light",
        onSuccess: () => {},
        onFail: () => {},
        onRefresh: () => {}
      },
      opts
    );
    this.root =
      typeof this.opt.root === "string"
        ? (document.querySelector(this.opt.root) as HTMLElement)
        : (this.opt.root as HTMLElement);

    this.stage = document.createElement("div");
    this.stage.className = "slider-captcha-stage";
    const widthValue =
      typeof this.opt.width === "number" ? this.opt.width + "px" : this.opt.width;
    this.stage.style.width = widthValue as string;
    this.stage.style.height = this.opt.height + "px";
    this.root.appendChild(this.stage);

    this.bgImgEl = document.createElement("img");
    this.bgImgEl.style.position = "absolute";
    this.bgImgEl.style.width = "100%";
    this.bgImgEl.style.height = "100%";
    this.bgImgEl.style.objectFit = "cover";

    this.pieceImgEl = document.createElement("img");
    this.pieceImgEl.style.position = "absolute";
    this.pieceImgEl.style.width = "44px";
    this.pieceImgEl.style.cursor = "grab";

    this.bgCanvas = document.createElement("canvas");
    this.cutCanvas = document.createElement("canvas");
    this.pieceCanvas = document.createElement("canvas");
    this.pieceCanvas.style.cursor = "grab";

    this.bar = document.createElement("div");
    this.bar.className = "slider-captcha-bar";
    this.track = document.createElement("div");
    this.track.className = "slider-captcha-track";
    this.fill = document.createElement("div");
    this.fill.className = "slider-captcha-fill";
    this.track.appendChild(this.fill);
    this.thumb = document.createElement("div");
    this.thumb.className = "slider-captcha-thumb";
    this.thumb.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l8 7-8 7"/></svg>';
    this.thumb.style.cursor = "grab";
    this.status = document.createElement("div");
    this.status.className = "slider-captcha-status";
    this.status.innerText = "Slide to verify";
    this.bar.append(this.track, this.thumb, this.status);
    this.bar.style.width = widthValue as string;
    this.root.appendChild(this.bar);

    this.root.classList.remove("slider-captcha-light", "slider-captcha-dark");
    this.root.classList.add(
      this.opt.theme === "dark" ? "slider-captcha-dark" : "slider-captcha-light"
    );

    this._bindDrag();
    this.numericWidth =
      typeof this.opt.width === "number"
        ? this.opt.width
        : this.stage.offsetWidth || 320;
    this.numericHeight =
      typeof this.opt.height === "number"
        ? this.opt.height
        : this.stage.offsetHeight || 160;
    [this.bgCanvas, this.cutCanvas, this.pieceCanvas].forEach((c) => {
      c.width = this.numericWidth * this._dpr;
      c.height = this.numericHeight * this._dpr;
      c.style.width = widthValue as string;
      c.style.height = this.numericHeight + "px";
      c.getContext("2d")?.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    });

    this.loadingBox = document.createElement("div");
    this.loadingBox.className = "slider-captcha-loading";
    this.loadingBox.appendChild(document.createElement("div")).className =
      "spinner";
    this.stage.style.position = "relative";
    this.stage.appendChild(this.loadingBox);
    this._showLoading(false);

    this.refreshBtn = document.createElement("div");
    this.refreshBtn.className = "slider-captcha-refresh";
    this.refreshBtn.innerHTML = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#333"><path d="M866.133333 573.013333a42.666667 42.666667 0 0 0-53.333333 27.733334A304.64 304.64 0 0 1 519.68 810.666667 302.933333 302.933333 0 0 1 213.333333 512a302.933333 302.933333 0 0 1 306.346667-298.666667 309.76 309.76 0 0 1 198.4 71.253334l-92.586667-15.36a42.666667 42.666667 0 0 0-49.066666 35.413333 42.666667 42.666667 0 0 0 35.413333 49.066667l180.906667 29.866666h7.253333a42.666667 42.666667 0 0 0 14.506667-2.56 14.08 14.08 0 0 0 4.266666-2.56 33.28 33.28 0 0 0 8.533334-4.693333l3.84-4.693333c0-2.133333 3.84-3.84 5.546666-6.4s0-4.266667 2.133334-5.973334a57.173333 57.173333 0 0 0 2.986666-7.68l32-170.666666a42.666667 42.666667 0 0 0-85.333333-16.213334l-11.52 61.866667A392.96 392.96 0 0 0 519.68 128 388.266667 388.266667 0 0 0 128 512a388.266667 388.266667 0 0 0 391.68 384A389.12 389.12 0 0 0 896 626.346667a42.666667 42.666667 0 0 0-29.866667-53.333334z"/></svg>';
    this.refreshBtn.style.cssText = `
      position:absolute;top:8px;right:8px;cursor:pointer;
      background:#fff;border:1px solid #ddd;border-radius:50%;padding:4px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.15);
      transition:background 0.2s;
      color:#333;
      z-index:20;
    `;
    this.refreshBtn.onmouseover = () => {
      this.refreshBtn.style.background = "#f0f0f0";
    };
    this.refreshBtn.onmouseout = () => {
      this.refreshBtn.style.background = "#fff";
    };
    this.stage.appendChild(this.refreshBtn);
    this.refreshBtn.addEventListener("click", () => this.refresh());

    this._seed();
    this.refresh();
  }

  private _showLoading(show: boolean) {
    if (this.loadingBox) {
      this.loadingBox.style.display = show ? "flex" : "none";
    }
    // Hide puzzle canvases while loading
    if (this.cutCanvas && this.pieceCanvas) {
      this.cutCanvas.style.visibility = show ? "hidden" : "visible";
      this.pieceCanvas.style.visibility = show ? "hidden" : "visible";
    }
  }

  private _seed() {
    const piece = this.opt.pieceSize || 44;
    const margin = 8; // small margin from edges
    this.targetX = Math.floor(
      Math.random() * (this.numericWidth - piece - margin) + margin
    );
    this.targetY = Math.floor(
      Math.random() * (this.numericHeight - piece - margin) + margin
    );
  }

  async refresh() {
    this.solved = false;
    try {
      this.numericWidth =
        typeof this.opt.width === "number"
          ? this.opt.width
          : this.stage.offsetWidth || 320;
      this.numericHeight =
        typeof this.opt.height === "number"
          ? this.opt.height
          : this.stage.offsetHeight || 160;
      this._seed(); // regenerate random cutout each refresh
      await this._drawBackground();
      // only use canvas fallback when no bgUrl/puzzleUrl provided
      if (!this.bgImgEl.src || !this.pieceImgEl.src) {
        this._prepareCutout();
        this._drawPiece(0);
      }
      this.fill.style.width = "0px";
      this.thumb.style.transform = "translateX(0px)";
      if (this.status) {
        this.status.innerText = "Slide to verify";
        this.status.className = "slider-captcha-status";
      }
      this.opt.onRefresh?.();
      this._resetPosition();
    } catch (e) {
      console.error("SliderCaptcha refresh failed:", e);
    }
  }

  private async _drawBackground() {
    const ctx = this.bgCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, this.numericWidth, this.numericHeight);
    this._showLoading(true);
    try {
      if (this.opt.request) {
        const { bgUrl, puzzleUrl } = await this.opt.request();
        if (this.bgImgEl && this.pieceImgEl) {
          this.bgImgEl.src = bgUrl;
          this.bgImgEl.style.width = defaultConfig.bgSize.width + "px";
          this.bgImgEl.style.height = defaultConfig.bgSize.height + "px";

          this.pieceImgEl.src = puzzleUrl;
          this.pieceImgEl.style.width = defaultConfig.puzzleSize.width + "px";
          this.pieceImgEl.style.left = defaultConfig.puzzleSize.left + "px";
        }
        this._puzzleImage = undefined; // disable canvas puzzle drawing
        this.stage.appendChild(this.bgImgEl);
        this.stage.appendChild(this.pieceImgEl);
      } else {
        // no request() or no bgUrl/puzzleUrl: use canvas fallback
        if (!this.bgCanvas.parentNode) {
          this.stage.append(this.bgCanvas, this.cutCanvas, this.pieceCanvas);
          // enforce proper stacking order
          this.bgCanvas.style.position = "absolute";
          this.bgCanvas.style.top = "0";
          this.bgCanvas.style.left = "0";
          // this.bgCanvas.style.zIndex = "1";

          this.cutCanvas.style.position = "absolute";
          this.cutCanvas.style.top = "0";
          this.cutCanvas.style.left = "0";
          this.cutCanvas.style.zIndex = "5";

          this.pieceCanvas.style.position = "absolute";
          this.pieceCanvas.style.top = "0";
          this.pieceCanvas.style.left = "0";
          this.pieceCanvas.style.zIndex = "10";
        }

        let src = this.opt.imageUrl;
        if (!src) {
          const w =
            typeof this.opt.width === "number"
              ? this.opt.width
              : this.root.offsetWidth || 320;
          const h =
            typeof this.opt.height === "number"
              ? this.opt.height
              : this.root.offsetHeight || 160;
          src = `https://picsum.photos/${w}/${h}?random=${Date.now()}`;
          this.opt.crossOrigin = "anonymous";
        }
        const img = await this._loadImage(src, this.opt.crossOrigin || undefined);
        this._drawImageFit(ctx, img, this.numericWidth, this.numericHeight, this.opt.fit);
      }
    } catch (e) {
      console.warn("Image load failed, fallback to gradient:", e);
      this._drawGradient(ctx);
    }
    this._showLoading(false);
  }

  private _drawGradient(ctx: CanvasRenderingContext2D) {
    const g = ctx.createLinearGradient(0, 0, this.numericWidth, this.numericHeight);
    g.addColorStop(0, "#0b1020");
    g.addColorStop(1, "#131c34");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.numericWidth, this.numericHeight);
  }

  private _drawImageFit(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    containerWidth: number,
    containerHeight: number,
    fit: "cover" | "contain" | "stretch" = "cover"
  ) {
    const imageWidth = img.naturalWidth || img.width;
    const imageHeight = img.naturalHeight || img.height;
    if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return;
    if (fit === "stretch") {
      ctx.drawImage(img, 0, 0, containerWidth, containerHeight);
      return;
    }
    const scale =
      fit === "cover"
        ? Math.max(containerWidth / imageWidth, containerHeight / imageHeight)
        : Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    const offsetX = (containerWidth - drawWidth) / 2;
    const offsetY = (containerHeight - drawHeight) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  private _prepareCutout() {
    const p = this.opt.pieceSize || 44;
    const x = this.targetX;
    const y = this.targetY;
    const r = 8;
    const path = new Path2D();

    // replicate original complex puzzle shape
    path.moveTo(x + r, y);
    path.lineTo(x + p / 3, y);
    path.arc(x + p / 2, y, p / 6, Math.PI, 0, true);
    path.lineTo(x + p - r, y);
    path.arcTo(x + p, y, x + p, y + r, r);
    path.lineTo(x + p, y + p / 3);
    path.arc(x + p, y + p / 2, p / 6, -Math.PI / 2, Math.PI / 2, false);
    path.lineTo(x + p, y + p - r);
    path.arcTo(x + p, y + p, x + p - r, y + p, r);
    path.lineTo(x + 2 * p / 3, y + p);
    path.arc(x + p / 2, y + p, p / 6, 0, Math.PI, true);
    path.lineTo(x + r, y + p);
    path.arcTo(x, y + p, x, y + p - r, r);
    path.lineTo(x, y + 2 * p / 3);
    path.arc(x, y + p / 2, p / 6, Math.PI / 2, -Math.PI / 2, true);
    path.lineTo(x, y + r);
    path.arcTo(x, y, x + r, y, r);
    path.closePath();

    this._piecePath = path;

    const ctxCut = this.cutCanvas.getContext("2d")!;
    const w = this.cutCanvas.width / this._dpr;
    const h = this.cutCanvas.height / this._dpr;
    ctxCut.clearRect(0, 0, w, h);
    ctxCut.save();
    ctxCut.fillStyle = "rgba(0,0,0,.45)";
    ctxCut.fillRect(0, 0, w, h);

    ctxCut.globalCompositeOperation = "destination-out";
    ctxCut.lineJoin = "round";
    ctxCut.lineCap = "round";
    ctxCut.lineWidth = 2;
    ctxCut.stroke(path);
    ctxCut.fill(path);
    ctxCut.restore();

    // overlay whitish highlight
    ctxCut.save();
    ctxCut.globalCompositeOperation = "source-over";
    ctxCut.fillStyle = "rgba(255,255,255,0.45)";
    ctxCut.fill(path);
    ctxCut.restore();

    // inner shadow
    ctxCut.save();
    ctxCut.globalCompositeOperation = "source-over";
    ctxCut.strokeStyle = "rgba(0,0,0,0.25)";
    ctxCut.lineWidth = 3;
    ctxCut.shadowColor = "rgba(0,0,0,0.4)";
    ctxCut.shadowBlur = 4;
    ctxCut.stroke(path);
    ctxCut.restore();

    // white outline
    ctxCut.save();
    ctxCut.strokeStyle = "#fff";
    ctxCut.lineWidth = 2;
    ctxCut.shadowColor = "rgba(0,0,0,0.3)";
    ctxCut.shadowBlur = 2;
    ctxCut.lineJoin = "round";
    ctxCut.lineCap = "round";
    ctxCut.stroke(path);
    ctxCut.restore();
  }

  private _drawPiece(dx: number) {
    if (!this._piecePath) return;
    const ctx = this.pieceCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.numericWidth, this.numericHeight);
    ctx.save();
    ctx.clip(this._piecePath);
    ctx.drawImage(this.bgCanvas, 0, 0);
    ctx.restore();

    // Add white outline to slider piece
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 2;
    ctx.stroke(this._piecePath);
    ctx.restore();
    this.pieceCanvas.style.transform = `translateX(${dx - this.targetX}px)`;
  }

  private async _check() {
    const dx = (parseFloat(this.fill.style.width) || 0) - this.thumb.offsetWidth;

    // If using server-provided images via request(), bypass client tolerance and always call onVerify
    if (this.opt.request && this.opt.onVerify) {
      try {
        await this.opt.onVerify({
          duration: Date.now() - (this._startTime || Date.now()),
          trail: this._trail || [],
          targetType: this._targetType as "puzzle" | "button",
          x: dx
        });
        this.solved = true;
        this.status.innerText = this.opt.successText || "✅ Verified!";
        this.status.className = "slider-captcha-status ok";
        this.opt.onSuccess?.();
      } catch {
        this._fail();
      }
      return;
    }

    let clientPass = false;

    if (this.opt.onVerify) {
      try {
          await this.opt.onVerify({
            duration: Date.now() - (this._startTime || Date.now()),
            trail: this._trail || [],
            targetType: this._targetType as "puzzle" | "button",
            x: dx
          });
          clientPass = true;
        } catch {
          this._fail();
        }
    } else {
      clientPass = Math.abs(dx - this.targetX) <= (this.opt.tolerance || 6);
    }

    if (clientPass) {
      this.solved = true;
      this.status.innerText = this.opt.successText || "✅ Verified!";
      this.status.className = "slider-captcha-status ok";
      this.opt.onSuccess?.();
    } else {
      this._fail();
    }
  }

  private _resetPosition() {
    // reset slider bar
    this.fill.style.width = "0px";
    this.thumb.style.transform = "translateX(0px)";

    // reset puzzle piece
    if (!this.bgImgEl.src || !this.pieceImgEl.src) {
      this._drawPiece(0);
    } else {
      this.pieceImgEl.style.left = defaultConfig.puzzleSize.left + "px";
      this.pieceImgEl.style.transform = "translateX(0px)";
    }
  }

  private _fail() {
    this._errorCount = (this._errorCount || 0) + 1;

    this.status.innerText = this.opt.failText || "❌ Try again!";
    this.status.className = "slider-captcha-status err shake";
    this._resetPosition();
    
    if (this._errorCount >= 3) {
      // too many attempts, regenerate puzzle
      this.refresh();
      this._errorCount = 0;
      return;
    }
  }

  private _bindDrag() {
    let down = false, startX = 0, startLeft = 0;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (this.solved) return;
      down = true;
      if ("touches" in e) {
        startX = e.touches[0].clientX;
        this._startY = e.touches[0].clientY;
      } else {
        startX = (e as MouseEvent).clientX;
        this._startY = (e as MouseEvent).clientY;
      }
      startLeft = parseFloat(getComputedStyle(this.fill).width) || 0;
      // Safari fix: ensure preventDefault is called to stop native drag/scroll
      if (e.cancelable) {
        e.preventDefault();
      }
      this._startTime = Date.now();
      this._trail = [];
      this._targetType = "button";
      this._deltaY = 0;
      this.thumb.style.cursor = "grabbing";
      this.pieceCanvas.style.cursor = "grabbing";
      this.pieceImgEl.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!down) return;
      let x: number, y: number;
      if ("touches" in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      }
      const width =
        typeof this.opt.width === "number"
          ? this.opt.width
          : this.stage.offsetWidth || 320;
      const dx = Math.max(0, Math.min(width - 44, startLeft + (x - startX)));
      this.fill.style.width = dx + this.thumb.offsetWidth + "px";
      this.thumb.style.transform = `translateX(${dx}px)`;
      if (!this.bgImgEl.src || !this.pieceImgEl.src) {
        this._drawPiece(dx);
      } else {
        // move puzzleUrl image horizontally with slider
        this.pieceImgEl.style.transform = `translateX(${dx}px)`;
      }
      this._deltaY = y - (this._startY || 0);
      this._trail?.push([x, y]);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      this._check();
      this.thumb.style.cursor = "grab";
      this.pieceCanvas.style.cursor = "grab";
      this.pieceImgEl.style.cursor = "grab";
    };
    // allow dragging from both thumb and puzzle piece
    this.thumb.addEventListener("mousedown", onDown);
    this.thumb.addEventListener("touchstart", onDown, { passive: false });
    this.pieceCanvas.addEventListener("mousedown", onDown);
    this.pieceCanvas.addEventListener("touchstart", onDown, { passive: false });
    this.pieceImgEl.addEventListener("mousedown", onDown);
    this.pieceImgEl.addEventListener("touchstart", onDown, { passive: false });

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  }

  private _loadImage(src: string, crossOrigin?: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (crossOrigin) img.crossOrigin = crossOrigin;
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  destroy() {
    if (this.root && this.stage) {
      this.root.removeChild(this.stage);
      this.root.removeChild(this.bar);
    }
  }
}
