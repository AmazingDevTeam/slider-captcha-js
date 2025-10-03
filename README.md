# 🎯 Slider Captcha Library

[![npm version](https://img.shields.io/npm/v/slider-captcha-js.svg)](https://www.npmjs.com/package/slider-captcha-js)
[![npm downloads](https://img.shields.io/npm/dw/slider-captcha-js)](https://www.npmjs.com/package/slider-captcha-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A **lightweight, customizable slider captcha** for **JavaScript, React, and TypeScript**.  
Supports **UMD + ESM builds**, **themes**, **async verification**, and **server integration**.  
Perfect for adding a secure, interactive human verification step to your apps.

---

## 🌐 Demo

A live demo is available on GitHub Pages:  
[https://amazingdevteam.github.io/slider-captcha-js](https://amazingdevteam.github.io/slider-captcha-js)

---

## ✨ Features
- ⚡ Works in **Vanilla JS**, **React**, and **TypeScript**
- 📦 UMD + ESM builds
- 🎨 Customizable size, theme (`light` / `dark`), and image source
- 🔄 Built-in refresh button with hover effects
- 🔒 No backend required, but supports async `onVerify` and `request()` for server integration
- 🪶 Lightweight and dependency-free
- 🖼️ Canvas fallback with gradient if image fails to load
- 🧩 Complex puzzle piece shape with shadows and outlines
- 🚫 Auto-refresh after 3 failed attempts

---

## ⚙️ Options & Logic

Both the **function API** (`sliderCaptcha`) and the **class API** (`new SliderCaptcha`) accept an options object.

### Validation & Image Source Logic
- If **`request` + `onVerify`** are provided → the captcha will use **server-side validation**.  
- Otherwise → it falls back to **client-side validation** (local puzzle check).  
- If **`imageUrl`** is provided → it will use that as the **custom image source**.  
- Otherwise → it falls back to a **default random image (picsum)**.

### Available Options

| Option        | Type       | Default     | Description |
|---------------|-----------|-------------|-------------|
| `root`        | `string` / `HTMLElement` | `null` | Container element where captcha will render |
| `width`       | `number` / `string` | `320` | Width of the captcha |
| `height`      | `number` | `160` | Height of the captcha |
| `fit`         | `"cover"` / `"contain"` / `"stretch"` | `"cover"` | How the image should fit |
| `imageUrl`    | `string` / `null` | `null` | Custom image URL for the captcha background (overrides default/request) |
| `crossOrigin` | `string` / `null` | `null` | Cross-origin setting for images |
| `theme`       | `"light"` / `"dark"` | `"light"` | Theme mode |
| `successText` | `string` | `"✅ Verified!"` | Success message |
| `failText`    | `string` | `"❌ Try again!"` | Failure message |
| `onSuccess`   | `function` | `() => {}` | Callback when verification succeeds |
| `onFail`      | `function` | `() => {}` | Callback when verification fails |
| `onRefresh`   | `function` | `() => {}` | Callback when captcha is refreshed |
| `onVerify`    | `function` | `null`     | Optional async callback for custom verification |
| `request`     | `function` | `null`     | Optional async function returning `{ bgUrl, puzzleUrl }` |

---

## 🚀 Installation

```bash
npm install slider-captcha-js
```

or via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/slider-captcha-js/dist/slider-captcha.css" />
<script src="https://unpkg.com/slider-captcha-js/dist/slider-captcha.umd.js"></script>
<script>
  const captcha = new SliderCaptcha({
    root: "#stage",
    width: 320,
    height: 160,
    onSuccess: () => alert("Verified!"),
    onFail: () => alert("Try again"),
  });

  captcha.refresh();
</script>
```

---

## 💻 Usage

### Vanilla JavaScript

```html
<div id="stage"></div>
<script type="module">
  import { SliderCaptcha } from "slider-captcha-js";

  const captcha = new SliderCaptcha({
    root: "#stage",
    width: 320,
    height: 160,
    theme: "dark",
    onSuccess: () => alert("Verified!"),
    onFail: () => alert("Try again"),
  });

  captcha.refresh();
</script>
```

### React (JavaScript)

```jsx
import SliderCaptcha from "slider-captcha-js";
import { useRef } from "react";

function App() {
  const captchaRef = useRef(null);

  return (
    <div>
      <SliderCaptcha
        ref={captchaRef}
        width={320}
        height={160}
        theme="light"
        onSuccess={() => console.log("Verified!")}
        onFail={() => console.log("Try again")}
      />
      <button onClick={() => captchaRef.current?.refresh()}>Refresh</button>
    </div>
  );
}
```

### React (TypeScript)

```tsx
import SliderCaptcha, { type SliderCaptchaRef } from "slider-captcha-js";
import { useRef } from "react";

function App() {
  const captchaRef = useRef<SliderCaptchaRef>(null);

  return (
    <div>
      <SliderCaptcha
        ref={captchaRef}
        width={320}
        height={160}
        theme="light"
        onSuccess={() => console.log("Verified!")}
        onFail={() => console.log("Try again")}
      />
      <button onClick={() => captchaRef.current?.refresh()}>Refresh</button>
    </div>
  );
}
```

### TypeScript

```ts
import { SliderCaptcha } from "slider-captcha-js";

const captcha = new SliderCaptcha({
  root: "#stage",
  width: 320,
  height: 160,
  onVerify: async ({ x, duration, trail }) => {
    // Custom async verification
    if (Math.abs(x - 100) < 6) return true;
    throw new Error("Verification failed");
  },
});
```

---

## 🔒 Backend Integration

```js
sliderCaptcha({
  root: "#captcha",
  request: async () => {
    const res = await fetch("/api/captcha");
    return res.json(); // { bgUrl, puzzleUrl }
  },
  onVerify: async (data) => {
    const res = await fetch("/api/captcha/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.success) throw new Error("Invalid");
  },
});
```

---

## 🎨 Theming

```css
.my-dark-theme .slider-captcha-bar {
  background: #222;
  color: #eee;
}
.my-dark-theme .slider-captcha-refresh {
  color: #0af;
}
```

---

## 🛠 Build

```bash
npm run build
```

Outputs:
- `dist/slider-captcha.umd.js`
- `dist/slider-captcha.esm.js`
- `dist/react-slider-captcha.js`
- `dist/react-slider-captcha.esm.js`

---

## 📜 License
MIT © 2025
