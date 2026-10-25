// This project's existing Pixel is shared by all four landing variants.
(() => {
  const pixelId = "857523047352756";

  if (!window.fbq) {
    const fbq = (window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  // Tracking must never prevent the native Telegram link from opening.
  function track(eventName) {
    try {
      window.fbq("track", eventName);
    } catch {
      // Navigation still works if a browser extension disables the Pixel.
    }
  }

  document.querySelectorAll(".telegram-link").forEach((link) => {
    link.addEventListener("click", () => track("CompleteRegistration"));
    link.addEventListener("auxclick", (event) => {
      if (event.button === 1) track("CompleteRegistration");
    });
  });

  try {
    window.fbq("init", pixelId);
    track("PageView");
  } catch {
    // The site and its links do not depend on tracking availability.
  }
})();
