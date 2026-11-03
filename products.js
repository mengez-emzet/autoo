/* AutoHub products. Plain JavaScript, no dependencies.

   HOW TO EDIT THE PRODUCTS
   Body kit parts use kit(...) and car care products use care(...) in the list below.
   Each product has a name, category and picture. Pictures live in images/products
   and are named after the product id, for example images/products/carnauba-wax.jpg.
   The size, tagline, key features and "works on" tags come from the product pictures
   and appear in the details window when a visitor clicks a product.
   No prices are shown. Every product has a "Get a Quote" button that opens the contact page.
   New products are added from the admin dashboard (admin.html) and merged in here by store.js. */
(function () {
  "use strict";

  var WHATSAPP = "263773963182";
  var ALL_MATERIALS = ["PP", "ABS", "FRP", "Carbon Fiber"];

  var GROUPS = [
    { id: "kits", label: "Body kits and parts", chip: "Body kits" },
    { id: "care", label: "Car care products", chip: "Car care" }
  ];

  function f(title, sub) { return { t: title, s: sub || "" }; }

  var KIT_FEATS = [
    f("OEM standard", "Designed according to original vehicle data"),
    f("Precise hole position", "Mounting points line up where they should"),
    f("Easy installation", "Fits without cutting or reworking the part"),
    f("Safe packaging", "Thickened carton and pearl cotton protection")
  ];

  function kit(id, name, cat, badge, desc) {
    return { id: id, group: "kits", name: name, cat: cat, img: "images/products/" + id + ".jpg", badge: badge, desc: desc,
      shape: "wide", mats: ALL_MATERIALS, size: "", tagline: "", feats: KIT_FEATS, tags: [] };
  }
  function care(id, name, cat, size, badge, tagline, desc, feats, tags) {
    return { id: id, group: "care", name: name, cat: cat, img: "images/products/" + id + ".jpg", badge: badge, desc: desc,
      shape: "tall", mats: [], size: size, tagline: tagline, feats: feats, tags: tags || [] };
  }

  var PRODUCTS = [
    kit("honeycomb-bumper", "Honeycomb Grille Front Bumper", "Bumpers", "Popular",
      "A front bumper with honeycomb mesh grilles, built from carefully selected materials for durability and performance."),
    kit("front-styling-kit", "Gloss Black Front Styling Kit", "Complete kits", "New",
      "A front end styling set with a lip spoiler and bumper accents, designed according to original vehicle data for a sharper, lower look."),
    kit("bumper-kit-packed", "Front Bumper Kit, Packed", "Complete kits", "",
      "A front bumper kit supplied wrapped in protective film, with foam blocks and a thickened carton so it arrives safely."),
    kit("lower-bumper", "Lower Front Bumper Section", "Bumpers", "",
      "A lower front section with precise hole positions, made to fit with no modification."),
    kit("front-lip", "Front Lip Spoiler", "Lips and splitters", "Popular",
      "A front lip spoiler with side winglets that sharpens the front profile of the vehicle."),
    kit("under-splitter", "Underbody Splitter Panel", "Lips and splitters", "",
      "A ribbed splitter panel that is impact resistant, lightweight and built for a long service life."),
    kit("diffuser", "Rear Style Diffuser Insert", "Rear and trim", "",
      "A diffuser insert that adds a sporty finish to the lower edge of the vehicle."),
    kit("corner-trims", "Corner and Trim Set", "Rear and trim", "",
      "Small corner and trim pieces that finish the kit neatly."),
    kit("full-kit-set", "Complete Body Kit Parts Set", "Complete kits", "Full set",
      "The full set of kit parts together: front bumper, lower sections, lip, side pieces and trims."),

    care("carnauba-wax", "Carnauba Wax", "Protection and shine", "250g", "Popular",
      "Premium protection and deep gloss",
      "Premium carnauba car wax that gives a deep, rich shine and protects the paint.",
      [f("Deep rich shine", "Enhances colour"), f("Long lasting protection", "Against UV and contaminants"), f("Easy application", "Smooth and streak free finish")]),
    care("tyre-shine", "Tyre Shine", "Protection and shine", "750ml", "",
      "Long lasting formula",
      "Professional tyre care in a 750ml trigger spray for a deep black, wet look finish.",
      [f("Deep rich black finish"), f("Protects", "Against UV rays"), f("Prevents", "Cracking and drying"), f("Wet look", "Long lasting shine")]),
    care("car-shampoo", "Car Shampoo", "Washing and prep", "5L", "",
      "High foam formula",
      "Professional car care shampoo in a 5 litre container, made to clean deeply and leave a brilliant shine.",
      [f("Deep cleaning power"), f("pH neutral", "Safe on all finishes"), f("Removes dirt and grime"), f("Leaves a brilliant shine")]),
    care("wheel-cleaner", "Wheel Cleaner", "Washing and prep", "750ml", "New",
      "Powerful and safe formula",
      "Professional wheel care in a 750ml trigger spray that cleans brake dust and grime off wheels.",
      [f("Removes brake dust"), f("Dissolves dirt and grime"), f("Safe on all wheel types"), f("Restores original shine")]),
    care("clay-bar", "Clay Bar", "Washing and prep", "100g", "",
      "Paint decontamination bar",
      "A premium grade clay bar that lifts contamination off paint and leaves it smooth.",
      [f("Removes contaminants", "Tar, sap, bugs and brake dust"), f("Restores smoothness", "To paint"), f("Safe", "On all paint surfaces"), f("Prepares", "For wax, sealant or ceramic coating")]),
    care("interior-detailer", "Interior Detailer", "Interior care", "750ml", "",
      "Clean, protect, freshen",
      "Professional interior care in a 750ml trigger spray for dashboards, plastics, leather and trim.",
      [f("Cleans", "Dashboards, plastics, leather and trim"), f("Protects", "UV protection, prevents fading"), f("Fresh scent", "Leaves a clean, long lasting fragrance"), f("Non greasy", "Natural matt finish")]),
    care("air-freshener", "Car Air Freshener, Black Ice", "Interior care", "100ml", "New",
      "Long lasting freshness",
      "A hanging car air freshener in the Black Ice fragrance, supplied in its own box.",
      [f("Eliminates odours"), f("Long lasting fragrance"), f("Fresh and clean drive"), f("Premium quality")]),
    care("microfiber-towels", "Microfiber Towels, 6 Pack", "Towels and tools", "6 pack", "",
      "Premium detailing towels",
      "Six premium detailing towels in red and black, supplied in a clear zip bag.",
      [f("Ultra soft", "Safe on all surfaces"), f("High absorbency", "Dries faster"), f("Lint free", "Streak free finish"), f("Durable and reusable", "Long lasting quality")]),
    care("detailing-brushes", "Detailing Brush Set", "Towels and tools", "Brush set", "",
      "Premium car care tools",
      "A boxed set of detailing brushes in different sizes, from soft brushes for delicate areas to firm brushes for wheels.",
      [f("Premium quality", "Durable and long lasting"), f("Multi surface", "Safe on all surfaces"), f("Deep cleaning", "Reaches tight areas"), f("Professional result", "Perfect for detailing")],
      ["Interior", "Exterior", "Wheels", "Air vents", "Badges", "Trim", "Engine bay"])
  ];

  var FEATURED_IDS = ["honeycomb-bumper", "carnauba-wax", "front-styling-kit", "wheel-cleaner", "car-shampoo", "front-lip", "microfiber-towels", "detailing-brushes"];

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function quoteLink(p) {
    var u = "contact.html?product=" + encodeURIComponent(p.name);
    if (p.group === "kits") u += "&service=" + encodeURIComponent("Car Body Kits and Pimping");
    return u;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function waLink(text) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text); }
  /* the choice shown next to a product: its material for kit parts, its size for care products */
  function variantOf(p, it) { return p.mats.length ? ((it && it.mat) || p.mats[0]) : p.size; }

  /* ---------- Enquiry list (saved in the browser) ---------- */
  var list = [];
  try { list = JSON.parse(localStorage.getItem("autohubEnquiry") || "[]"); } catch (e) { list = []; }
  list = list.filter(function (it) { return it && typeof it.id === "string"; });
  function liveList() { return list.filter(function (it) { return byId[it.id]; }); }
  function saveList() { try { localStorage.setItem("autohubEnquiry", JSON.stringify(list)); } catch (e) {} }
  function findItem(id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function toggleItem(id, mat) {
    var it = findItem(id);
    if (it) {
      list = list.filter(function (x) { return x.id !== id; });
      toast("Removed from your list");
    } else {
      list.push({ id: id, mat: byId[id].mats.length ? (mat || byId[id].mats[0]) : "" });
      toast("Added to your enquiry list");
    }
    saveList();
    syncList();
  }
  function listMessage() {
    var lines = liveList().map(function (it, i) {
      var p = byId[it.id];
      var v = variantOf(p, it);
      return (i + 1) + ". " + p.name + (v ? " (" + v + ")" : "");
    });
    return "Hello AutoHub, I would like to enquire about these products:\n" + lines.join("\n") + "\nPlease send me a quote and confirm availability and delivery.";
  }

  /* ---------- Enquiry button and drawer ---------- */
  var enqBtn = document.createElement("button");
  enqBtn.type = "button";
  enqBtn.className = "enqbtn";
  enqBtn.setAttribute("aria-label", "Open your enquiry list");
  enqBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l2 5v13H4V8z"/><path d="M4 8h16M9 12h6"/></svg><span class="enqlabel">Enquiry list</span><b class="enqcount" id="enqCount">0</b>';
  document.body.appendChild(enqBtn);

  var drawer = document.createElement("div");
  drawer.className = "drawerwrap";
  drawer.innerHTML = '<div class="drawerbg" data-dclose="1"></div>' +
    '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">' +
    '<div class="drawerhead"><h3 id="drawerTitle">Your enquiry list</h3><button type="button" class="modalclose" data-dclose="1" aria-label="Close list">&times;</button></div>' +
    '<ul class="drawerlist" id="drawerList"></ul>' +
    '<div class="drawerfoot"><p class="small" id="drawerNote"></p>' +
    '<a class="btn btnred full" id="drawerSend" target="_blank" rel="noopener" href="#">Send on WhatsApp</a>' +
    '<button type="button" class="linkbtn" id="drawerClear">Clear list</button></div></aside>';
  document.body.appendChild(drawer);

  var lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    document.body.classList.add("locked");
    setTimeout(function () { $(".drawer .modalclose").focus(); }, 80);
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    if (!modal.classList.contains("open")) document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus();
  }
  enqBtn.addEventListener("click", openDrawer);
  drawer.addEventListener("click", function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute("data-dclose")) closeDrawer();
    var rm = t.closest ? t.closest("[data-remove]") : null;
    if (rm) { toggleItem(rm.getAttribute("data-remove")); }
  });
  $("#drawerClear").addEventListener("click", function () {
    list = [];
    saveList();
    syncList();
  });

  function renderDrawer() {
    var ul = $("#drawerList");
    var live = liveList();
    if (!live.length) {
      ul.innerHTML = '<li class="drawerempty">Your list is empty. Add products with the "Add to list" button.</li>';
      $("#drawerNote").textContent = "";
      $("#drawerSend").classList.add("disabled");
      $("#drawerSend").setAttribute("href", "#");
      $("#drawerClear").hidden = true;
      return;
    }
    ul.innerHTML = live.map(function (it) {
      var p = byId[it.id];
      return '<li class="eitem"><img src="' + esc(p.img) + '" alt="" loading="lazy"><div><b>' + esc(p.name) + '</b><span>' + esc(variantOf(p, it)) + '</span></div>' +
        '<button type="button" class="eremove" data-remove="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">&times;</button></li>';
    }).join("");
    $("#drawerNote").textContent = live.length + (live.length === 1 ? " item" : " items") + ". We reply with a quote and confirm availability on WhatsApp.";
    $("#drawerSend").classList.remove("disabled");
    $("#drawerSend").setAttribute("href", waLink(listMessage()));
    $("#drawerClear").hidden = false;
  }

  function syncList() {
    var count = $("#enqCount");
    count.textContent = liveList().length;
    var showBtn = !!grid || liveList().length > 0;
    enqBtn.hidden = !showBtn;
    document.body.classList.toggle("hasenq", showBtn);
    enqBtn.classList.toggle("has", liveList().length > 0);
    enqBtn.classList.remove("bump");
    void enqBtn.offsetWidth;
    enqBtn.classList.add("bump");
    $all("[data-add]").forEach(function (b) {
      var on = !!findItem(b.getAttribute("data-add"));
      b.classList.toggle("on", on);
      if (b.id !== "pmAdd") b.textContent = on ? "Added" : "Add to list";
    });
    if (modal && modal.classList.contains("open")) syncModalAdd();
    renderDrawer();
  }

  /* ---------- Product cards ---------- */
  function cardHtml(p, i) {
    var chips = p.mats.length
      ? p.mats.slice(0, 4).map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("")
      : (p.size ? "<span>" + esc(p.size) + "</span>" : "");
    return '<article class="pcard" style="--i:' + i + '" data-id="' + esc(p.id) + '">' +
      '<div class="pimg ' + esc(p.shape) + '" data-open="' + esc(p.id) + '" tabindex="0" role="button" aria-label="View details of ' + esc(p.name) + '">' +
      '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      (p.badge ? '<span class="pbadge">' + esc(p.badge) + '</span>' : "") +
      '<span class="qv">View details</span></div>' +
      '<div class="pbody"><p class="pcat">' + esc(p.cat) + '</p>' +
      '<h3><button type="button" class="plink" data-open="' + esc(p.id) + '">' + esc(p.name) + '</button></h3>' +
      (p.tagline ? '<p class="ptag">' + esc(p.tagline) + '</p>' : "") +
      '<div class="mats">' + chips + '</div>' +
      '<div class="pfoot"><a class="btn btnred qbtn" href="' + esc(quoteLink(p)) + '">Get a Quote</a>' +
      '<button type="button" class="padd" data-add="' + esc(p.id) + '">Add to list</button></div></div></article>';
  }

  /* ---------- Products page ---------- */
  var grid = $("#pGrid");
  var state = { group: "All", q: "", sort: "featured" };
  var renderGrid;
  if (grid) {
    var catBox = $("#pCats");
    var chipDefs = [{ id: "All", label: "All products" }].concat(GROUPS.map(function (g) { return { id: g.id, label: g.chip }; }));
    var wantedGroup = new URLSearchParams(window.location.search).get("group");
    if (wantedGroup && chipDefs.some(function (c) { return c.id === wantedGroup; })) state.group = wantedGroup;
    catBox.innerHTML = chipDefs.map(function (c) {
      return '<button type="button" class="chip' + (c.id === state.group ? " active" : "") + '" data-group="' + esc(c.id) + '">' + esc(c.label) + '</button>';
    }).join("");
    catBox.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-group]") : null;
      if (!b) return;
      state.group = b.getAttribute("data-group");
      $all(".chip", catBox).forEach(function (c) { c.classList.toggle("active", c === b); });
      renderGrid();
    });
    $("#pSearch").addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); renderGrid(); });
    $("#pSort").addEventListener("change", function (e) { state.sort = e.target.value; renderGrid(); });

    renderGrid = function () {
      var total = 0;
      var html = GROUPS.map(function (g) {
        if (state.group !== "All" && state.group !== g.id) return "";
        var items = PRODUCTS.filter(function (p) {
          if (p.group !== g.id) return false;
          var hay = (p.name + " " + p.cat + " " + p.tagline + " " + p.size + " " + p.mats.join(" ") + " " + p.tags.join(" ")).toLowerCase();
          return !state.q || hay.indexOf(state.q) >= 0;
        });
        if (!items.length) return "";
        if (state.sort === "name") items.sort(function (a, b) { return a.name.localeCompare(b.name); });
        total += items.length;
        return '<section class="pgroup" aria-label="' + esc(g.label) + '"><div class="pgrouphead"><h3>' + esc(g.label) + '</h3><span>' +
          items.length + (items.length === 1 ? " product" : " products") + '</span></div>' +
          '<div class="pgrid ' + g.id + '">' + items.map(cardHtml).join("") + '</div></section>';
      }).join("");
      grid.innerHTML = html;
      $("#pEmpty").hidden = total > 0;
      $("#pCount").textContent = total + (total === 1 ? " product" : " products");
      syncList();
    };

    grid.addEventListener("click", function (e) {
      var add = e.target.closest ? e.target.closest("[data-add]") : null;
      if (add) { toggleItem(add.getAttribute("data-add")); return; }
      var open = e.target.closest ? e.target.closest("[data-open]") : null;
      if (open) openModal(open.getAttribute("data-open"));
    });
    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var open = e.target.closest ? e.target.closest(".pimg[data-open]") : null;
      if (open) { e.preventDefault(); openModal(open.getAttribute("data-open")); }
    });
  }

  /* ---------- Home page product rail ---------- */
  var rail = $("#featuredGrid");
  var railRefresh = null;
  if (rail) {
    var railShown = false;
    var renderRail = function () {
      rail.innerHTML = FEATURED_IDS.filter(function (id) { return byId[id]; }).map(function (id, i) {
        var p = byId[id];
        return '<a class="pcard fcard pin' + (railShown ? " in" : "") + '" style="--i:' + i + '" draggable="false" href="products.html?open=' + encodeURIComponent(p.id) + '">' +
          '<div class="pimg ' + esc(p.shape) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" draggable="false">' +
          (p.badge ? '<span class="pbadge">' + esc(p.badge) + '</span>' : "") + '</div>' +
          '<div class="pbody"><p class="pcat">' + esc(p.cat) + '</p><h3>' + esc(p.name) + '</h3>' +
          '<div class="pfoot"><span class="more">View details</span></div></div></a>';
      }).join("");
    };
    renderRail();
    railRefresh = renderRail;

    var reveal = function () { railShown = true; $all(".pin", rail).forEach(function (el) { el.classList.add("in"); }); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { reveal(); obs.disconnect(); } });
      }, { threshold: 0.12 }).observe(rail);
    } else { reveal(); }

    var btns = $all(".railbtn");
    var syncRail = function () {
      var max = rail.scrollWidth - rail.clientWidth - 4;
      btns.forEach(function (b) {
        var dir = parseInt(b.getAttribute("data-dir"), 10);
        b.disabled = dir < 0 ? rail.scrollLeft <= 4 : rail.scrollLeft >= max;
      });
    };
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        rail.scrollBy({ left: parseInt(b.getAttribute("data-dir"), 10) * rail.clientWidth * 0.8, behavior: "smooth" });
      });
    });
    rail.addEventListener("scroll", syncRail, { passive: true });
    window.addEventListener("resize", syncRail);
    syncRail();

    /* drag to scroll with the mouse */
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; rail.classList.add("drag"); }
      if (moved) rail.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", function () { down = false; rail.classList.remove("drag"); });
    rail.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  }

  /* ---------- Details window ---------- */
  var modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = '<div class="modalbg" data-mclose="1"></div>' +
    '<div class="modalbox wide" role="dialog" aria-modal="true" aria-labelledby="pmName">' +
    '<button type="button" class="modalclose" data-mclose="1" aria-label="Close details">&times;</button>' +
    '<div class="zoom" id="pmZoom" title="Tap or hover to zoom"><img id="pmImg" alt="">' +
    '<button type="button" class="pmnav prev" id="pmPrev" aria-label="Previous product"></button>' +
    '<button type="button" class="pmnav next" id="pmNext" aria-label="Next product"></button></div>' +
    '<div class="pminfo" id="pmInfo"><p class="pcat" id="pmCat"></p><h3 id="pmName"></h3><p class="pmtag" id="pmTag"></p>' +
    '<div class="pmrow"><span class="pmsize" id="pmSize"></span></div>' +
    '<p class="pmdesc" id="pmDesc"></p>' +
    '<div id="pmMatBox"><p class="small pmlabel">Choose a material</p><div class="mopts" id="pmMats" role="group" aria-label="Material"></div></div>' +
    '<p class="small pmlabel">Key features</p><ul class="pmfeat" id="pmFeat"></ul>' +
    '<div id="pmTagsBox"><p class="small pmlabel">Works on</p><div class="mats" id="pmTags"></div></div>' +
    '<div class="modalbtns"><a class="btn btnred" id="pmQuote" href="contact.html">Get a Quote</a>' +
    '<a class="btn btnghost" id="pmWa" target="_blank" rel="noopener" href="#">Ask on WhatsApp</a>' +
    '<button type="button" class="btn btnghost" id="pmAdd" data-add="">Add to list</button></div>' +
    '<p class="small">Pricing is confirmed in your quote. Availability and delivery are confirmed when you enquire.</p></div></div>';
  document.body.appendChild(modal);

  var current = null, currentMat = "";
  var zoom = $("#pmZoom"), zimg = $("#pmImg"), info = $("#pmInfo");

  function syncModalAdd() {
    if (!current) return;
    var on = !!findItem(current.id);
    var b = $("#pmAdd");
    b.textContent = on ? "Added to list" : "Add to list";
    b.classList.toggle("on", on);
  }
  function updateWa() {
    var v = current.mats.length ? currentMat : current.size;
    var text = "Hello AutoHub, I would like to enquire about: " + current.name + (v ? " (" + v + ")" : "") + ". Is it available and what is the price?";
    $("#pmWa").setAttribute("href", waLink(text));
    $("#pmQuote").setAttribute("href", quoteLink(current));
  }
  function siblings(p) { return PRODUCTS.filter(function (x) { return x.group === p.group; }); }
  function step(dir) {
    if (!current) return;
    var s = siblings(current);
    var i = s.indexOf(current);
    openModal(s[(i + dir + s.length) % s.length].id, true);
  }
  function openModal(id, swap) {
    var p = byId[id];
    if (!p) return;
    current = p;
    currentMat = p.mats.length ? ((findItem(id) || {}).mat || p.mats[0]) : "";
    zimg.src = p.img;
    zimg.alt = p.name;
    zoom.classList.toggle("tall", p.shape === "tall");
    zoom.classList.remove("zoomed");
    $("#pmCat").textContent = p.cat;
    $("#pmName").textContent = p.name;
    $("#pmDesc").textContent = p.desc;
    var tag = $("#pmTag"); tag.textContent = p.tagline; tag.hidden = !p.tagline;
    var size = $("#pmSize"); size.textContent = p.size; size.hidden = !p.size;
    $("#pmMatBox").hidden = !p.mats.length;
    $("#pmMats").innerHTML = p.mats.map(function (m) {
      return '<button type="button" class="mopt' + (m === currentMat ? " on" : "") + '" data-mat="' + esc(m) + '" aria-pressed="' + (m === currentMat) + '">' + esc(m) + '</button>';
    }).join("");
    $("#pmFeat").innerHTML = p.feats.map(function (x) {
      return "<li><b>" + esc(x.t) + "</b>" + (x.s ? "<span>" + esc(x.s) + "</span>" : "") + "</li>";
    }).join("");
    $("#pmTagsBox").hidden = !p.tags.length;
    $("#pmTags").innerHTML = p.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    var many = siblings(p).length > 1;
    $("#pmPrev").hidden = !many;
    $("#pmNext").hidden = !many;
    updateWa();
    syncModalAdd();
    info.classList.remove("swap"); zimg.classList.remove("swap");
    void info.offsetWidth;
    info.classList.add("swap"); zimg.classList.add("swap");
    info.scrollTop = 0;
    if (swap) return;
    lastFocus = document.activeElement;
    modal.classList.add("open");
    document.body.classList.add("locked");
    setTimeout(function () { $(".modal .modalclose").focus(); }, 80);
  }
  function closeModal() {
    modal.classList.remove("open");
    if (!drawer.classList.contains("open")) document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute("data-mclose")) { closeModal(); return; }
    var m = t.closest ? t.closest(".mopt") : null;
    if (m) {
      currentMat = m.getAttribute("data-mat");
      $all(".mopt", modal).forEach(function (b) {
        var on = b === m;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      var it = findItem(current.id);
      if (it) { it.mat = currentMat; saveList(); renderDrawer(); }
      updateWa();
    }
  });
  $("#pmAdd").addEventListener("click", function () { toggleItem(current.id, currentMat); });
  $("#pmPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  $("#pmNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });

  function setOrigin(e) {
    var r = zoom.getBoundingClientRect();
    zimg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
  }
  zoom.addEventListener("click", function (e) { setOrigin(e); zoom.classList.toggle("zoomed"); });
  zoom.addEventListener("mousemove", function (e) { if (zoom.classList.contains("zoomed")) setOrigin(e); });
  zoom.addEventListener("mouseleave", function () { zoom.classList.remove("zoomed"); });

  /* swipe left or right on the picture to move between products */
  var tx0 = null;
  zoom.addEventListener("touchstart", function (e) { tx0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
  zoom.addEventListener("touchend", function (e) {
    if (tx0 === null) return;
    var dx = e.changedTouches[0].clientX - tx0;
    tx0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modal.classList.contains("open")) closeModal();
      else if (drawer.classList.contains("open")) closeDrawer();
    }
    if (modal.classList.contains("open") && (e.key === "ArrowLeft" || e.key === "ArrowRight") && !/INPUT|SELECT|TEXTAREA/.test((document.activeElement || {}).tagName || "")) {
      step(e.key === "ArrowRight" ? 1 : -1);
    }
    if (e.key === "Tab") {
      var box = modal.classList.contains("open") ? $(".modalbox", modal) : (drawer.classList.contains("open") ? $(".drawer", drawer) : null);
      if (!box) return;
      var fs = $all("button, a[href], input, select", box).filter(function (x) { return !x.hidden && x.offsetParent !== null; });
      if (!fs.length) return;
      var first = fs[0], last = fs[fs.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Products added from the admin dashboard (see store.js) ---------- */
  function str(v, max) { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
  function strList(v, maxItems, max) {
    return Array.isArray(v) ? v.slice(0, maxItems).map(function (x) { return str(x, max); }).filter(Boolean) : [];
  }
  function fromRemote(d) {
    if (!d || typeof d.id !== "string" || !str(d.name, 120)) return null;
    var img = typeof d.img === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(d.img) ? d.img : "";
    if (!img) return null;
    var g = d.group === "care" ? "care" : "kits";
    var feats = Array.isArray(d.feats) ? d.feats.slice(0, 12).map(function (x) { return f(str(x && x.t, 80), str(x && x.s, 120)); }).filter(function (x) { return x.t; }) : [];
    var mats = g === "kits" ? strList(d.mats, 6, 30) : [];
    return { id: "r" + d.id, group: g, name: str(d.name, 120), cat: str(d.cat, 60) || (g === "kits" ? "Body kit parts" : "Car care"),
      img: img, badge: str(d.badge, 20), desc: str(d.desc, 600), shape: g === "care" ? "tall" : "wide",
      mats: g === "kits" ? (mats.length ? mats : ALL_MATERIALS) : [], size: g === "care" ? str(d.size, 30) : "",
      tagline: str(d.tagline, 100), feats: feats.length ? feats : (g === "kits" ? KIT_FEATS : []), tags: strList(d.tags, 12, 30), featured: !!d.featured, remote: true };
  }
  function mergeRemote(items) {
    var fresh = [];
    (items || []).forEach(function (raw) {
      var p = fromRemote(raw);
      if (p && !byId[p.id]) fresh.push(p);
    });
    if (!fresh.length) return;
    PRODUCTS = fresh.concat(PRODUCTS);
    fresh.forEach(function (p) { byId[p.id] = p; });
    fresh.slice().reverse().forEach(function (p) { if (p.featured) FEATURED_IDS.unshift(p.id); });
    if (grid) renderGrid();
    if (railRefresh) railRefresh();
    syncList();
    var w = new URLSearchParams(window.location.search).get("open");
    if (grid && w && byId[w] && !modal.classList.contains("open") && !openedFromLink) openModal(w);
  }
  if (window.AutoHubStore && window.AutoHubStore.items) mergeRemote(window.AutoHubStore.items);
  window.addEventListener("autohubstore", function (e) { mergeRemote(e.detail); });

  /* ---------- Start ---------- */
  var openedFromLink = false;
  if (grid) renderGrid();
  syncList();
  var wanted = new URLSearchParams(window.location.search).get("open");
  if (grid && wanted && byId[wanted]) { openedFromLink = true; setTimeout(function () { openModal(wanted); }, 700); }
})();
