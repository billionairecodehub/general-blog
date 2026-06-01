# App Architecture — SPA Router & Page Management

## Overview
This is a **Single-Page Application (SPA)** built with vanilla HTML, CSS, and JavaScript. The main orchestrator is `appindex.js`, which manages:
- **Page Switching** (Full-page swaps in the main area)
- **Modal Management** (Subscribe modal slides up from bottom)
- **Event Binding** (Navigation between pages)

---

## File Structure

```
General blog/
├── index.html              # Main entry point (header, main, footer shell)
├── appindex.js             # Router & page orchestrator (NEW)
├── js/
│   └── index.js            # Core functionality (touch mitigation, scroll-reveal)
├── css/
│   └── index.css           # All styling + modal CSS
├── pages/
│   ├── home.html           # Home page (default)
│   ├── about.html          # About page
│   ├── blog.html           # Blog page
│   └── subscribe.html      # Subscribe modal content
└── ...other assets
```

---

## How It Works

### 1. **Page Loading**
When `appindex.js` initializes:
- All page HTML files (home, about, blog, subscribe) are fetched and cached
- The home page is shown by default in the main area
- All navigation events are bound

### 2. **Page Switching (Full Replacements)**
When you click on a navigation board:
- The main content is cleared
- New page HTML is inserted
- Page-specific event listeners are attached
- Current page state is updated

**Page Routes:**
- **Home → About**: Click `.blog-about-board`
- **About → Home**: Click `.about-back-icon`
- **Home → Blog**: Click `.blog-blog-board`
- **Blog → Home**: Click `.blog-header-board`

### 3. **Subscribe Modal (Overlay)**
The subscribe page is special — it **slides up from the bottom** instead of replacing the main page:
- Does NOT cover the footer
- Can be opened via:
  - Click `.blog-join-community` (on home page)
  - Click `.blog-toggle-icon` (in footer)
- Can be closed via:
  - Click `.cancel` button
  - Click toggle icon again

---

## Key Components

### `appindex.js` (Router)
```javascript
const AppRouter = (() => {
  // STATE
  let currentPage = null;        // 'home' | 'about' | 'blog' | null
  let subscribeOpen = false;     // Modal state

  // PUBLIC API
  return {
    init(),                       // Initialize app
    showPage(pageName),          // Switch to page
    toggleSubscribeModal(),       // Open/close modal
    getCurrentPage(),            // Get current page
    isSubscribeOpen()            // Get modal state
  };
})();
```

### `index.html` (Shell)
```html
<div class="mobile-layout">
  <header class="header"></header>
  
  <!-- appindex.js populates this -->
  <main class="main" id="main"></main>
  
  <footer class="footer">
    <!-- Toggle icon & Join Community board -->
  </footer>
</div>
```

### Page Files
Each page HTML is a self-contained fragment (no `<html>`, `<head>`, `<body>`):

**pages/home.html** — Home with brand text and 3 boards (About, Join, Blog)
**pages/about.html** — About page with back button
**pages/blog.html** — Blog page with back button
**pages/subscribe.html** — Modal content (inputs, submit button)

---

## CSS for Modal

The subscribe modal uses:
- `.subscribe-modal-overlay` — Fixed position, slides from bottom
- `.active` class — Toggles visibility with smooth transition
- `bottom: -100%` → `bottom: 0` animation

```css
.subscribe-modal-overlay {
  position: fixed;
  bottom: -100%;  /* Hidden below viewport */
  transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.subscribe-modal-overlay.active {
  bottom: 0;  /* Slide to visible */
}
```

---

## Event Flow

### Navigation Flow
1. User clicks board (e.g., `.blog-about-board`)
2. `appindex.js` binds click → `showPage('about')`
3. `showPage()` fetches cached HTML and inserts into main
4. New page events are bound
5. Page renders with styling from `css/index.css`

### Modal Flow
1. User clicks `.blog-toggle-icon` or `.blog-join-community`
2. `appindex.js` calls `toggleSubscribeModal()`
3. Modal div created (if needed) and populated with subscribe HTML
4. `.active` class added → CSS animates `bottom: -100% → 0`
5. User sees modal slide up from bottom

---

## Testing Checklist
✅ Home page loads on startup
✅ Click "About" board → switches to about page
✅ Click back icon on about → returns to home
✅ Click "Visit Blog" board → switches to blog page
✅ Click back on blog page → returns to home
✅ Click footer toggle icon → opens subscribe modal
✅ Click cancel in modal → closes modal
✅ Click toggle again → opens modal again

---

## Future Enhancements
- Add actual form submission for subscribe modal
- Add page transitions/animations
- Add loading states
- Add error handling for failed page loads
- Add search functionality (if needed)
- Mobile gesture support for page navigation
