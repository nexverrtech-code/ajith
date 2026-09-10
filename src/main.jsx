import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Fade out the pre-JS boot screen from index.html once React has painted.
 *
 * Two frames, so the first render is on screen before the curtain lifts — but
 * backed by a timer, because requestAnimationFrame is throttled to a standstill
 * in a background tab and the curtain must never outlive the page load.
 */
const boot = document.getElementById("boot");
if (boot) {
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    boot.classList.add("is-gone");
    setTimeout(() => boot.remove(), 600);
  };

  requestAnimationFrame(() => requestAnimationFrame(dismiss));
  setTimeout(dismiss, 1200);
}
