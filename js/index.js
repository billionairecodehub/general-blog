// layout.js — Core shell logic for the mobile layout template
// Handles: viewport height fix, nav switching, header button hooks

/* ═══════════════════════════════════════════════════════════════
   1. MOBILE VIEWPORT HEIGHT FIX
   Sets --vh custom property so layouts survive browser chrome
   appearing / disappearing on scroll in Safari / Chrome mobile.
   ═══════════════════════════════════════════════════════════════ */
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setViewportHeight();
window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", setViewportHeight);
window.addEventListener("scroll", setViewportHeight);

/* ═══════════════════════════════════════════════════════════════
   2. PAGE REGISTRY
   Map each data-nav value to the matching page element.
   Add / remove entries here as you build out new pages.
   ═══════════════════════════════════════════════════════════════ */
const pages = {
  home: document.getElementById("page-home"),
  // feed:  document.getElementById("page-feed"),
  // Quest: document.getElementById("page-quest"),
  // Block: document.getElementById("page-block"),
  // about: document.getElementById("page-about"),
};

/* ═══════════════════════════════════════════════════════════════
   3. SHOW / HIDE HELPERS
   ═══════════════════════════════════════════════════════════════ */

/** Hide every registered page */
function hideAllPages() {
  Object.values(pages).forEach((page) => {
    if (page) page.style.display = "none";
  });
}

/** Show one page and scroll main back to top */
function showPage(page) {
  if (!page) return;
  hideAllPages();
  page.style.display = "block";
  const main = document.querySelector(".main");
  if (main) main.scrollTop = 0;
}

/* ═══════════════════════════════════════════════════════════════
   4. FOOTER NAV — tap to switch pages
   ═══════════════════════════════════════════════════════════════ */
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    // Update active styling
    navItems.forEach((n) => n.classList.remove("active"));
    navItem.classList.add("active");

    const navType = navItem.getAttribute("data-nav");
    const target = pages[navType];

    if (target) {
      showPage(target);
    }
    // If the page isn't registered yet, nothing breaks — just add it above.
  });
});

/* ═══════════════════════════════════════════════════════════════
   5. HEADER BUTTONS
   Wire up notification and store/menu icon taps.
   Replace the console.log stubs with real behaviour as you build.
   ═══════════════════════════════════════════════════════════════ */
const headerProfile = document.getElementById("header-profile");
if (headerProfile) {
  headerProfile.addEventListener("click", () => {
    // TODO: show profile page
    // showPage(pages.profile);
    console.log("header-profile tapped");
  });
}

const headerNotiBtn = document.getElementById("header-noti-btn");
if (headerNotiBtn) {
  headerNotiBtn.addEventListener("click", () => {
    // TODO: show notifications page
    // showPage(pages.noti);
    console.log("notifications tapped");
  });
}

const headerStoreBtn = document.getElementById("header-store-btn");
if (headerStoreBtn) {
  headerStoreBtn.addEventListener("click", () => {
    // TODO: show store / menu page
    // showPage(pages.menu);
    console.log("store tapped");
  });
}

/* ═══════════════════════════════════════════════════════════════
   6. BOOT — show home page on load
   ═══════════════════════════════════════════════════════════════ */
showPage(pages.home);

const homeNav = document.querySelector('.nav-item[data-nav="home"]');
if (homeNav) homeNav.classList.add("active");
