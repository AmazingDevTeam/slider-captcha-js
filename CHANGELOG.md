# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.7] - 2025-10-03
### Changed
- Bumped version to **1.0.7** (`chore(release)`).
- Added `export type { SliderCaptchaRef }` in `src/index.ts` so TypeScript consumers can import the ref type directly from the package entry point.
- Rebuilt distribution bundles (`dist/slider-captcha.esm.js`, `dist/react-slider-captcha.esm.js`, etc.).
- Updated README.md:
  - Clarified React usage examples for both JavaScript (`.jsx`) and TypeScript (`.tsx`).
  - Added example showing how to use `SliderCaptchaRef` with `useRef` in TypeScript.
  - Ensured JavaScript example uses plain `useRef(null)` without type import.

## [1.0.6] - 2025-09-29
### Fixed
- Fixed slider not draggable on Safari 18.4 (macOS).
- Replaced `instanceof TouchEvent` checks with feature detection (`"touches" in e`) to avoid runtime errors on Safari desktop.
- Ensured `preventDefault()` is only called when event is cancelable, improving Safari compatibility.
- Verified cross-browser drag support (Safari, Chrome, Firefox, Edge).

---

## [1.0.5] - 2025-09-29
### Documentation
- Updated **public/index.html** demo page to use implementation **UMD** builds (`docs(demo)`).

---

## [1.0.4] - 2025-09-29
### Fixed
- Ensure `slider-captcha.css` is built and included in both `dist/` and `public/` directories (`fix(build)`).

---

## [1.0.3] - 2025-09-29
### Documentation
- Updated **README.md** to include CSS reference when using the library via CDN (`docs(readme)`).

---

## [1.0.2] - 2025-09-29
### Fixed
- Ensure `slider-captcha.css` is included in the published npm package (`fix(package)`).

---

## [1.0.1] - 2025-09-28
### Added
- Storybook story for **SliderCaptcha** component (`feat(slider-captcha)`).

### Fixed
- Refined `.npmignore` rules for a cleaner npm package (`fix(npmignore)`).

---

## [1.0.0] - 2025-09-24
### Added
- Initial release of **Slider Captcha JS** 🎉
- Supports **Vanilla JS** and **React**.
- Provides both **function API** (`sliderCaptcha`) and **class API** (`new SliderCaptcha`).
- Includes **UMD** and **ESM** builds.
- Built-in **refresh button** and **theming support**.
- **Unit tests** and **E2E tests** with Jest + Playwright.
- **TypeScript definitions** (`index.d.ts`).
- **CI/CD pipeline** with GitHub Actions.
- **ESLint + Prettier** for code style.
- Documentation with installation, usage, theming, and backend integration examples.

---
