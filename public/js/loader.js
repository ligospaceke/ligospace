// js/loader.js
// Classic (non-module) script, loaded before main.js. Its only job: if the site
// itself fails to start, replace the loading screen with a readable message.
// Once main.js has rendered (it sets data-ready on #app) this does nothing.
(function () {
  var app = document.getElementById("app");
  if (!app) return;

  function fail(msg) {
    if (app.getAttribute("data-ready")) return;
    app.innerHTML =
      '<div class="ligo-boot-error">' +
      "<b>L.I.G.O. SPACE could not start.</b><br>" +
      String(msg).replace(/</g, "&lt;") +
      "<br><br>Please refresh the page. If this keeps happening, contact the team on 0182809790.</div>";
  }

  window.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (t && t !== window) {
        // Resource errors: only care about our own scripts failing to load.
        if (t.tagName === "SCRIPT" && t.src && t.src.indexOf(location.origin + "/js/") === 0)
          fail("A site file could not be loaded (" + t.src.split("/").slice(-2).join("/") + ").");
        return;
      }
      if (e.filename && e.filename.indexOf(location.origin) === 0)
        fail(
          (e.message || "Script error") + " (" + e.filename.split("/").slice(-2).join("/") + ":" + e.lineno + ")"
        );
    },
    true
  );

  window.addEventListener("unhandledrejection", function (e) {
    fail((e.reason && e.reason.message) || e.reason);
  });
})();