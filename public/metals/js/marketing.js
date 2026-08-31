/* Jagetiya Metals marketing — tabs, nav, quick search */
(function () {
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var tabs = document.querySelectorAll(".shop-tab");
  var panels = {
    "by-grade": document.getElementById("by-grade"),
    "by-shape": document.getElementById("by-shape"),
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-panel");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      Object.keys(panels).forEach(function (key) {
        var panel = panels[key];
        if (!panel) return;
        var on = key === id;
        panel.classList.toggle("on", on);
        if (on) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
    });
  });

  // Observe viz when visible to restart fill animation
  var viz = document.querySelector(".nest-viz");
  if (viz && "IntersectionObserver" in window) {
    var fills = viz.querySelectorAll(".fill");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          fills.forEach(function (el) {
            el.style.animation = "none";
            void el.offsetWidth;
            el.style.animation = "";
          });
        });
      },
      { threshold: 0.35 }
    );
    io.observe(viz);
  }
})();
