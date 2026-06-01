/**
 * appindex.js — Page & Modal Orchestrator
 *
 * Manages the single-page application:
 * - Routes between home, about, and blog pages (full-page swaps in main)
 * - Slide-up subscribe modal from bottom (overlay, doesn't replace main)
 * - Event binding for all navigation boards and back buttons
 */

const AppRouter = (() => {
  // ══════════════════════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════════════════════
  let currentPage = null; // Start as null so first showPage call works
  let subscribeOpen = false;

  // Page content cache
  const pages = {
    home: null,
    about: null,
    blog: null,
    subscribe: null,
  };

  // ══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════════════════════════════
  const init = async () => {
    console.log("[AppRouter] Initializing...");

    // Load all page HTML files
    await loadPages();

    // Render home page by default
    await showPage("home");

    // Bind all navigation events
    bindEvents();

    console.log("[AppRouter] Ready");
  };

  // ══════════════════════════════════════════════════════════════
  // PAGE LOADING
  // ══════════════════════════════════════════════════════════════
  const loadPages = async () => {
    try {
      pages.home = await fetchPageHTML("pages/home.html");
      pages.about = await fetchPageHTML("pages/about.html");
      pages.blog = await fetchPageHTML("pages/blog.html");
      pages.subscribe = await fetchPageHTML("pages/subscribe.html");
      console.log("[AppRouter] Pages loaded");
    } catch (error) {
      console.error("[AppRouter] Failed to load pages:", error);
    }
  };

  const fetchPageHTML = async (filePath) => {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    return await response.text();
  };

  // ══════════════════════════════════════════════════════════════
  // PAGE SWITCHING (full-page swaps in main)
  // ══════════════════════════════════════════════════════════════
  const showPage = async (pageName) => {
    if (currentPage === pageName && pages[pageName]) {
      console.log(`[AppRouter] Already on ${pageName}`);
      return;
    }

    const main = document.getElementById("main");
    if (!main) {
      console.error("[AppRouter] main element not found");
      return;
    }

    const pageHTML = pages[pageName];
    if (!pageHTML) {
      console.error(`[AppRouter] Page ${pageName} not loaded`);
      return;
    }

    // Clear previous page content
    main.innerHTML = "";

    // Insert new page content
    main.innerHTML = pageHTML;

    // Update state
    currentPage = pageName;

    // Re-bind events for new page content
    bindPageEvents(pageName);

    console.log(`[AppRouter] Switched to ${pageName}`);
  };

  // ══════════════════════════════════════════════════════════════
  // SUBSCRIBE MODAL (slide-up from bottom)
  // ══════════════════════════════════════════════════════════════
  const toggleSubscribeModal = () => {
    subscribeOpen = !subscribeOpen;

    let modal = document.getElementById("subscribe-modal");

    if (subscribeOpen) {
      // Create modal if it doesn't exist
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "subscribe-modal";
        modal.className = "subscribe-modal-overlay";
        document.body.appendChild(modal);
      }

      // Insert subscribe content
      modal.innerHTML = pages.subscribe;
      modal.classList.add("active");

      // Bind close buttons
      const cancelBtn = modal.querySelector(".cancel");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", toggleSubscribeModal);
      }

      console.log("[AppRouter] Subscribe modal opened");
    } else {
      if (modal) {
        modal.classList.remove("active");
        modal.innerHTML = "";
      }
      console.log("[AppRouter] Subscribe modal closed");
    }
  };

  // ══════════════════════════════════════════════════════════════
  // EVENT BINDING
  // ══════════════════════════════════════════════════════════════
  const bindEvents = () => {
    // Global events (footer toggle & join community from home)
    bindGlobalEvents();

    // Initial page-specific events
    bindPageEvents("home");
  };

  const bindGlobalEvents = () => {
    // Footer toggle button (blog-toggle-icon)
    const footerToggle = document.querySelector(".blog-toggle-icon");
    if (footerToggle) {
      footerToggle.addEventListener("click", toggleSubscribeModal);
      console.log("[AppRouter] Bound footer toggle");
    }
  };

  const bindPageEvents = (pageName) => {
    if (pageName === "home") {
      bindHomePageEvents();
    } else if (pageName === "about") {
      bindAboutPageEvents();
    } else if (pageName === "blog") {
      bindBlogPageEvents();
    }
  };

  const bindHomePageEvents = () => {
    // Blog About Board — go to about page
    const aboutBoard = document.querySelector(".blog-about-board");
    if (aboutBoard) {
      aboutBoard.addEventListener("click", () => {
        showPage("about");
      });
      console.log("[AppRouter] Bound about board");
    }

    // Blog Join Community Board — open subscribe modal
    const joinCommunity = document.querySelector(".blog-join-community");
    if (joinCommunity) {
      joinCommunity.addEventListener("click", toggleSubscribeModal);
      console.log("[AppRouter] Bound join community board");
    }

    // Blog Blog Board — go to blog page
    const blogBoard = document.querySelector(".blog-blog-board");
    if (blogBoard) {
      blogBoard.addEventListener("click", () => {
        showPage("blog");
      });
      console.log("[AppRouter] Bound blog board");
    }
  };

  const bindAboutPageEvents = () => {
    // About Back Icon — return to home
    const backIcon = document.querySelector(".about-back-icon");
    if (backIcon) {
      backIcon.addEventListener("click", () => {
        showPage("home");
      });
      console.log("[AppRouter] Bound about back icon");
    }
  };

  const bindBlogPageEvents = () => {
    // Blog Header Board — return to home
    const headerBoard = document.querySelector(".blog-header-board");
    if (headerBoard) {
      headerBoard.addEventListener("click", () => {
        showPage("home");
      });
      console.log("[AppRouter] Bound blog header board");
    }
  };

  // ══════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════
  return {
    init,
    showPage,
    toggleSubscribeModal,
    getCurrentPage: () => currentPage,
    isSubscribeOpen: () => subscribeOpen,
  };
})();

// Start the app when DOM is ready
// Handle both cases: if DOMContentLoaded already fired or will fire
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AppRouter.init();
  });
} else {
  // DOM is already loaded (script is deferred)
  AppRouter.init();
}
