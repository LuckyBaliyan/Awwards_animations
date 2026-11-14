# 🎬 Zoom Transition — Awwwards Page Transitions in React

An Awwwards-inspired, high-performance page transition experience built with **React 19**, the browser-native **View Transitions API** (`view-transition-class`), **Tailwind CSS v4**, and **Vite**.

---

## ✨ Features

- **Native View Transitions API**: Zero third-party animation libraries (no Framer Motion or GSAP needed). Powered entirely by the browser engine via `document.startViewTransition()` and React 19 `flushSync`.
- **Unified `view-transition-class`**: Leverages the View Transitions Level 2 specification (`view-transition-class: film`) to animate all media items uniformly with clean, minimal CSS.
- **Center-Stage Bento Grid**: An architectural Bento Grid showcasing a commanding tall center pillar, flanked by balanced square cards and anchored with a panoramic widescreen footer.
- **Universal Epoch Video Synchronization**: All looping videos synchronize playback time to universal real-world epoch time `(Date.now() / 1000) % duration`, guaranteeing seamless, uninterrupted playback between thumbnails and expanded hero views without frame jumps.
- **Failover Stream Resilience**: Integrated automatic error recovery (`onError`) with secondary CDN fallback sources to ensure reliable playback.
- **Full History & Keyboard Navigation**: Synchronized with browser history (`popstate`, `#hash`), back/forward buttons, and keyboard accessibility (`Enter`, `Space`, and `Escape` to return home).
- **Reduced Motion Support**: Fully respects `@media (prefers-reduced-motion: reduce)` for complete accessibility.

---

## 📐 Bento Grid Architecture

The homepage uses a responsive Bento layout:

```
Desktop (3 columns × 3 rows):
┌──────────────┬──────────────────────────────┬──────────────┐
│ Azure (1×1)  │                              │ Amber (1×1)  │
├──────────────┤ Solaris (Tall Centerpiece)   ├──────────────┤
│ Neon (1×1)   │         (1 col × 2 rows)     │ Metropol(1×1)│
├──────────────┴──────────────────────────────┴──────────────┤
│               Coastal (Wide Panoramic Base)                 │
│                       (3 cols × 1 row)                     │
└────────────────────────────────────────────────────────────┘
```

- **Solaris** *(Centerpiece)*: `col-start-2 row-start-1 col-span-1 row-span-2`
- **Azure & Neon** *(Left Flank)*: `col-start-1`
- **Amber & Metropolis** *(Right Flank)*: `col-start-3`
- **Coastal** *(Panoramic Base)*: `col-span-3 row-start-3`
- **Mobile**: Automatically re-flows into a fluid 2-column mobile bento.

---

## 🧠 How the View Transition Works

### 1. Synchronous React State Flush
In single-page React apps, DOM updates must commit synchronously within the `document.startViewTransition()` callback:

```javascript
/**
 * Executes state change inside document.startViewTransition with flushSync.
 */
document.startViewTransition(() => {
  flushSync(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedFilmId(targetId);
  });
});
```

### 2. Pure CSS Pseudo-Element Orchestration (`src/global.css`)
```css
/* Assigns the transition class to both card and hero elements */
.film {
  view-transition-class: film;
}

/* 0.9s fluid size and position morph */
::view-transition-group(.film) {
  animation-duration: 0.9s;
  animation-timing-function: cubic-bezier(0.7, 0, 0.2, 1);
  overflow: hidden;
  border-radius: 16px;
}

/* Snapshots scale with object-fit cover to prevent stretching */
::view-transition-old(.film),
::view-transition-new(.film) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Non-active cards fade out smoothly during page entrance */
::view-transition-old(.film):only-child {
  animation: fade-out 0.25s ease both;
}

/* Non-active cards fade back in gently when returning home */
::view-transition-new(.film):only-child {
  animation: fade-in 0.3s ease 0.6s both;
}

/* Detail page title slides up smoothly from below */
::view-transition-new(title) {
  animation: rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s both;
}
```

---

## 📁 Project Structure

```text
pr11/
├── public/
│   └── posters/             # Static poster fallbacks
├── src/
│   ├── components/
│   │   ├── FilmCard.jsx     # Bento Grid interactive card
│   │   ├── FilmDetail.jsx   # Expanded hero view with rising title
│   │   ├── Header.jsx       # Minimalist top navigation bar
│   │   └── VideoPlayer.jsx  # Synchronized video element with failover
│   ├── data/
│   │   └── films.js         # Film metadata, CDN URLs, and grid configurations
│   ├── utils/
│   │   └── videoSync.js     # Epoch-based video synchronization utility
│   ├── App.jsx              # Main transition orchestrator and router
│   ├── global.css           # View Transition API CSS rules & Tailwind v4
│   └── main.jsx             # React root mount
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- A browser supporting the **View Transitions API** (Google Chrome 111+, Microsoft Edge 111+, or Safari 18.2+)

### Installation

1. Clone or navigate to the project repository:
   ```bash
   cd pr11
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🛠️ Scripts

- `npm run dev`: Starts the Vite local development server.
- `npm run build`: Compiles and bundles production-ready assets.
- `npm run lint`: Fast linting check via Oxlint.
- `npm run preview`: Locally previews the production build.

---

## 📜 Credits & License

- Original concept and CSS rules inspired by [Hank-D-Tank/zoom-transition](https://github.com/Hank-D-Tank/zoom-transition.git).
- Design inspired by [Cyd Stumpel](https://cydstumpel.nl).
- Media streams served via [Mixkit](https://mixkit.co), [Pexels](https://www.pexels.com), and [Cloudinary](https://cloudinary.com).
- Font: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) via Google Fonts.
