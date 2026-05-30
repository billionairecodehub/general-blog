// Basic index.js for General blog template
// Implements a simple scroll-reveal and a touch-flicker mitigation

(function () {
  // Touch flicker mitigation: ensure passive touch listeners and no tap highlight
  try {
    document.addEventListener("touchstart", function () {}, { passive: true });
    document.documentElement.style.touchAction = "manipulation";
    document.documentElement.style.webkitTapHighlightColor = "transparent";
  } catch (e) {}

  // Minimal IntersectionObserver-based reveal
  function mountScrollReveal(root) {
    const opts = { root: null, rootMargin: "0px", threshold: 0.06 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("scroll-reveal-visible");
          io.unobserve(e.target);
        }
      });
    }, opts);
    const items = (root || document).querySelectorAll(".scroll-reveal-item");
    items.forEach((i) => io.observe(i));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      mountScrollReveal(document),
    );
  } else {
    mountScrollReveal(document);
  }
})();
