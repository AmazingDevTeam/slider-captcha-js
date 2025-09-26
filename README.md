# 🎯 Slider Captcha Library

[![npm version](https://img.shields.io/npm/v/slider-captcha-js.svg)](https://www.npmjs.com/package/slider-captcha-js)
[![Build Status](https://github.com/AmazingDevTeam/slider-captcha-js/actions/workflows/ci.yml/badge.svg)](https://github.com/AmazingDevTeam/slider-captcha-js/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/AmazingDevTeam/slider-captcha-js.svg)](https://codecov.io/gh/AmazingDevTeam/slider-captcha-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/slider-captcha-js)](https://bundlephobia.com/package/slider-captcha-js)
[![npm downloads](https://img.shields.io/npm/dw/slider-captcha-js)](https://www.npmjs.com/package/slider-captcha-js)

A **lightweight, customizable slider captcha** for **JavaScript, React, and TypeScript**.  
Supports **UMD + ESM builds**, **themes**, **async verification**, and **server integration**.  
Perfect for adding a secure, interactive human verification step to your apps.

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

## ⚙️ Options

Both the **function API** (`sliderCaptcha`) and the **class API** (`new SliderCaptcha`) accept an options object:

| Option        | Type       | Default     | Description |
|---------------|-----------|-------------|-------------|
| `root`        | `string` / `HTMLElement` | `null` | Container element where captcha will render |
| `width`       | `number` / `string` | `320` | Width of the captcha |
| `height`      | `number` | `160` | Height of the captcha |
| `fit`         | `"cover"` / `"contain"` / `"stretch"` | `"cover"` | How the image should fit |
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
<script src="https://unpkg.com/slider-captcha-js/dist/slider-captcha.umd.js"></script>
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

### React

```jsx
import SliderCaptchaReact from "slider-captcha-js/react";

function App() {
  return (
    <SliderCaptchaReact
      width={320}
      height={160}
      theme="light"
      onSuccess={() => console.log("Verified!")}
      onFail={() => console.log("Try again")}
    />
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
