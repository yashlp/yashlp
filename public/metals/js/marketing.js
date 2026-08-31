/* Jagetiya Metals marketing — product cards from catalog */
(function () {
  var GRADES = [
    {
      id: "EN-8",
      name: "EN-8",
      tag: "Medium carbon",
      desc: "All-purpose machining grade. Shafts, axles, bolts, and general engineering.",
      chemKey: "EN-8",
      stock: "Round · Square · Flat"
    },
    {
      id: "EN-19",
      name: "EN-19",
      tag: "4140 alloy",
      desc: "Chromium-molybdenum strength for gears, spindles, and high-stress parts.",
      chemKey: "EN-19 (4140)",
      stock: "Round · Forging rod"
    },
    {
      id: "EN-24",
      name: "EN-24",
      tag: "Ni-Cr-Mo",
      desc: "High tensile alloy for aerospace-adjacent and heavy duty shafts.",
      chemKey: "EN-24",
      stock: "Round · Forging rod"
    },
    {
      id: "EN-31",
      name: "EN-31",
      tag: "Bearing steel",
      desc: "High carbon-chromium. Bearings, rollers, and wear-critical tooling.",
      chemKey: "EN-31",
      stock: "Round · Forging"
    },
    {
      id: "20MnCr5",
      name: "20MnCr5",
      tag: "Case hardening",
      desc: "Gear steel with deep hardenability for automotive and gearbox work.",
      chemKey: "20MnCr5",
      stock: "Round · Forging rod"
    },
    {
      id: "WPS",
      name: "WPS (D3)",
      tag: "Tool / die",
      desc: "Wear-resistant cold-work steel for dies, punches, and cutting tools.",
      chemKey: "WPS (D3)",
      stock: "Round · Square · Flat"
    },
    {
      id: "MS",
      name: "Mild Steel",
      tag: "Structural",
      desc: "Bright and black MS for fabrication, fixtures, and general construction.",
      chemKey: "MS",
      stock: "Round · Hex · Flat"
    },
    {
      id: "SS304",
      name: "SS 304",
      tag: "Stainless",
      desc: "Corrosion-resistant austenitic rod for food, chemical, and architectural use.",
      chemKey: "SS 304",
      stock: "Rod · Sheet · Pipe"
    }
  ];

  var SHAPES = [
    {
      name: "Round Bar",
      desc: "Rolled, bright, forged, and imported diameters ready for the lathe.",
      meta: "Ø 4–550 mm class",
      img: "assets/shape-round.webp",
      glyph: "Ø"
    },
    {
      name: "Square Bar",
      desc: "EN-8, WPS, and MS bright squares for fixtures and structural work.",
      meta: "Side 8–155 mm",
      img: null,
      glyph: "□"
    },
    {
      name: "Flat Bar",
      desc: "Thickness × width matrices in EN-8, WPS, MS bright, and heavy black.",
      meta: "6×25 → 105×410",
      img: "assets/shape-flat.webp",
      glyph: "▭"
    },
    {
      name: "Hex Bar",
      desc: "MS bright hex for fasteners, fittings, and CNC stock.",
      meta: "A/F 12–75 mm",
      img: null,
      glyph: "⬡"
    },
    {
      name: "Non-Ferrous",
      desc: "Brass, copper EC, aluminium HE30/6082, and full SS rod series.",
      meta: "SS 304–440C · 17-4PH",
      img: null,
      glyph: "Cu"
    },
    {
      name: "Forged / Bright",
      desc: "Forging rods to 450 mm and centerless ground bright for precision fits.",
      meta: "Up to Ø 450 mm",
      img: null,
      glyph: "◎"
    }
  ];

  var CHEM_ORDER = ["C", "Mn", "Si", "Cr", "Ni", "Mo"];

  function chemFor(key) {
    var db = (window.JKData && window.JKData.CHEM_COMP) || {};
    return db[key] || null;
  }

  function renderChem(key) {
    var c = chemFor(key);
    if (!c) return "";
    var html = '<div class="chem">';
    for (var i = 0; i < CHEM_ORDER.length; i++) {
      var el = CHEM_ORDER[i];
      if (c[el] == null) continue;
      html +=
        '<div class="chem-item"><div class="el"><span>' +
        el +
        '</span></div><div class="val">' +
        c[el] +
        "%</div></div>";
    }
    html += "</div>";
    return html;
  }

  function renderGrades() {
    var root = document.getElementById("gradeGrid");
    if (!root) return;
    var html = "";
    for (var i = 0; i < GRADES.length; i++) {
      var g = GRADES[i];
      html +=
        '<article class="grade-card reveal">' +
        '<div class="grade-top"><h3 class="grade-name">' +
        g.name +
        '</h3><span class="grade-tag">' +
        g.tag +
        "</span></div>" +
        '<p class="grade-desc">' +
        g.desc +
        "</p>" +
        renderChem(g.chemKey) +
        '<a class="grade-link" href="stock.html?grade=' +
        encodeURIComponent(g.chemKey || g.id) +
        '">Check stock →</a>' +
        "</article>";
    }
    root.innerHTML = html;
  }

  function renderShapes() {
    var root = document.getElementById("shapeGrid");
    if (!root) return;
    var html = "";
    for (var i = 0; i < SHAPES.length; i++) {
      var s = SHAPES[i];
      var visual = s.img
        ? '<img src="' + s.img + '" alt="" width="200" height="140">'
        : '<div class="glyph">' + s.glyph + "</div>";
      html +=
        '<article class="shape-card reveal">' +
        '<div class="shape-visual">' +
        visual +
        "</div>" +
        '<div class="shape-body"><h3>' +
        s.name +
        "</h3><p>" +
        s.desc +
        '</p><div class="shape-meta">' +
        s.meta +
        '</div><a class="grade-link" href="stock.html?shape=' +
        encodeURIComponent(s.name) +
        '">Browse sizes →</a></div></article>';
    }
    root.innerHTML = html;
  }

  function setupTabs() {
    var tabs = document.querySelectorAll(".tab");
    var grades = document.getElementById("panel-grades");
    var shapes = document.getElementById("panel-shapes");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("on");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("on");
        tab.setAttribute("aria-selected", "true");
        var which = tab.getAttribute("data-panel");
        if (which === "shapes") {
          grades.classList.remove("on");
          grades.hidden = true;
          shapes.hidden = false;
          shapes.classList.add("on");
        } else {
          shapes.classList.remove("on");
          shapes.hidden = true;
          grades.hidden = false;
          grades.classList.add("on");
        }
      });
    });
  }

  function setupReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function setupNav() {
    var btn = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!btn || !links) return;
    btn.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  function setupQuoteForm() {
    var form = document.getElementById("quoteForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var grade = document.getElementById("qGrade").value;
      var shape = document.getElementById("qShape").value;
      var size = document.getElementById("qSize").value;
      var qty = document.getElementById("qQty").value;
      var contact = document.getElementById("qContact").value;
      var notes = document.getElementById("qNotes").value;
      var subject = encodeURIComponent("Stock enquiry — " + grade + " " + shape);
      var body = encodeURIComponent(
        "Grade: " +
          grade +
          "\nShape: " +
          shape +
          "\nSize: " +
          size +
          "\nQty: " +
          qty +
          "\nContact: " +
          contact +
          "\nNotes: " +
          notes
      );
      window.location.href = "mailto:Kamlesh@jkmetal.in?subject=" + subject + "&body=" + body;
    });
  }

  function applyDeepLinks() {
    // stock.html handles query params; marketing only needs hash tabs
    if (location.hash === "#shop") {
      /* noop */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrades();
    renderShapes();
    setupTabs();
    setupNav();
    setupQuoteForm();
    setupReveal();
    applyDeepLinks();
  });
})();
