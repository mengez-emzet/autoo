/* AutoHub behaviour. Plain JavaScript, no dependencies. Shared by every page. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* Toast message */
  var toastEl = $("#toast");
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* Theme toggle */
  var themeBtn = $("#themeToggle");
  function syncThemeButton() {
    var isDark = root.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeBtn.setAttribute("aria-pressed", String(!isDark));
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#0a0a0a" : "#f6f6f6");
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    var apply = function () {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("autohubTheme", next); } catch (e) {}
      syncThemeButton();
    };
    if (document.startViewTransition && !reduceMotion) {
      var r = themeBtn.getBoundingClientRect();
      root.style.setProperty("--tx", (r.left + r.width / 2) + "px");
      root.style.setProperty("--ty", (r.top + r.height / 2) + "px");
      document.startViewTransition(apply);
    } else { apply(); }
    toast(next === "dark" ? "Dark mode on" : "Light mode on");
  });
  syncThemeButton();

  /* Mobile menu */
  var burger = $("#burger");
  var nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });

  /* Mark the current page in the navigation */
  var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  $all(".navlink", nav).forEach(function (a) {
    var match = a.getAttribute("href").toLowerCase() === file;
    a.classList.toggle("active", match);
    if (match) a.setAttribute("aria-current", "page");
  });

  /* Page transition: the red cover slides over the page before navigating */
  var wipe = $("#wipe");
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^[a-z]+:/i.test(href) || !/\.html(\?|#|$)/i.test(href)) return;
    var target = href.split(/[?#]/)[0].toLowerCase();
    if (target === file || reduceMotion || !wipe) return;
    e.preventDefault();
    setMenu(false);
    wipe.classList.add("in");
    setTimeout(function () { window.location.href = href; }, 480);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted && wipe) wipe.classList.remove("in"); });

  /* Scroll progress, header shadow, back to top */
  var progress = $("#progress");
  var header = $("#header");
  var toTop = $("#toTop");
  var ticking = false;
  var pageHero = $(".pagehero");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
    if (!reduceMotion) {
      root.style.setProperty("--spin", (y * 0.35).toFixed(1) + "deg");
      if (pageHero) pageHero.style.setProperty("--sy", Math.min(y, 700));
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  /* Reveal on scroll */
  var reveals = $all(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = el.parentElement ? $all(".reveal", el.parentElement) : [];
          var idx = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = Math.min(idx, 5) * 70 + "ms";
          el.classList.add("in");
          io.unobserve(el);
          /* clear the stagger delay so hover effects respond instantly */
          setTimeout(function () { el.style.transitionDelay = ""; }, 1300);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Animated counters */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = $all("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* Cursor ring, 3D tilt, magnetic buttons and click ripple (mouse devices) */
  if (finePointer && !reduceMotion) {
    var cur = $("#cursor");
    var cx = 0, cy = 0, tx = 0, ty = 0, started = false;
    var hotSel = "a, button, input, select, textarea, label, summary, .card, .pcard, .pimg";
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!started) { cx = tx; cy = ty; started = true; }
      cur.classList.add("show");
    });
    document.addEventListener("mouseleave", function () { cur.classList.remove("show"); });
    document.addEventListener("mouseover", function (e) { cur.classList.toggle("hot", !!(e.target.closest && e.target.closest(hotSel))); });
    document.addEventListener("mousedown", function () { cur.classList.add("down"); });
    document.addEventListener("mouseup", function () { cur.classList.remove("down"); });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(loop);
    })();

    $all(".card, .pack, .stat, .steps li").forEach(function (el) {
      el.classList.add("tilt");
      el.addEventListener("mouseenter", function () { el.classList.add("tilting"); });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", (-py * 9).toFixed(2) + "deg");
        el.style.setProperty("--ry", (px * 11).toFixed(2) + "deg");
      });
      el.addEventListener("mouseleave", function () {
        el.classList.remove("tilting");
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
      });
    });

    $all(".btn, .iconbtn").forEach(function (el) {
      el.classList.add("magnet");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        el.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  }
  $all(".btn").forEach(function (btn) {
    btn.addEventListener("pointerdown", function (e) {
      if (reduceMotion) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height) * 2;
      var dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = size + "px";
      dot.style.left = (e.clientX - r.left - size / 2) + "px";
      dot.style.top = (e.clientY - r.top - size / 2) + "px";
      btn.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 700);
    });
  });

  /* Home page: photo slideshow, mouse parallax and typed words */
  var hero = $(".hero");
  if (hero) {
    var slides = $all(".slide", hero);
    var dots = $all(".hdot", hero);
    var current = 0, slideTimer;
    var showSlide = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("on", n === current); });
      dots.forEach(function (d, n) { d.classList.toggle("on", n === current); });
    };
    var restart = function () {
      clearInterval(slideTimer);
      if (slides.length > 1) slideTimer = setInterval(function () { showSlide(current + 1); }, 5000);
    };
    dots.forEach(function (d, n) { d.addEventListener("click", function () { showSlide(n); restart(); }); });
    restart();

    if (finePointer && !reduceMotion) {
      var pending = false, mx = 0, my = 0;
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!pending) {
          pending = true;
          window.requestAnimationFrame(function () {
            hero.style.setProperty("--px", mx.toFixed(3));
            hero.style.setProperty("--py", my.toFixed(3));
            pending = false;
          });
        }
      });
      hero.addEventListener("mouseleave", function () { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
    }

    var typed = $("#typed");
    if (typed) {
      var words = ["body kits", "paint and respray", "car wraps", "mag wheels", "detailing", "interior refresh", "bucket seats", "engine upgrades", "car security", "dash cameras"];
      var w = 0, ch = 0, del = false;
      {
        (function tick() {
          var word = words[w];
          ch += del ? -1 : 1;
          typed.textContent = word.slice(0, ch);
          var wait = del ? 35 : 75;
          if (!del && ch === word.length) { del = true; wait = 1500; }
          else if (del && ch === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
          setTimeout(tick, wait);
        })();
      }
    }
  }

  /* Services: filters and details panel */
  var chips = $all(".chip");
  var cards = $all("#cards .card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); });
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hide", !show);
        if (show) { card.classList.add("in"); }
      });
    });
  });

  /* Service details. Each entry: tag line, pictures, sections and an optional extra link.
     Section kinds: "c" chips, "g" short checklist, "l" list with a second line [title, note]. */
  var BRANDS = ["BMW", "Mercedes Benz", "Audi", "Toyota", "Lexus", "Volkswagen", "Nissan", "Honda", "Ford"];
  var details = {
    "Car Body Kits and Pimping": {
      tag: "Custom looks, premium quality, perfect fitment",
      imgs: ["images/services/body-kits.jpg"],
      link: ["bodykits.html", "Materials and fitment"],
      secs: [
        ["Why choose our kits", "g", ["Premium quality", "Professional fitment", "Wide range of styles", "For all vehicle brands", "Durable and long lasting"]],
        ["Kit styles", "c", ["Front bumpers", "Rear bumpers", "Side skirts", "Spoilers and wings", "Fender kits", "Diffusers", "Grilles", "Full body kits"]],
        ["Materials", "c", ["PP", "ABS", "FRP", "Carbon Fiber"]],
        ["Installation services", "g", ["Professional fitment", "Precise alignment", "Clean finishing", "Custom modifications", "Painting available"]],
        ["Kits for", "c", ["BMW", "Mercedes Benz", "Toyota", "Lexus", "Honda"]],
        ["Also available", "g", ["Supply and fitment available", "Custom designs on request", "Quality products and professional service"]]
      ]
    },
    "Detailing": {
      tag: "Clean, protect, restore, enhance",
      imgs: ["images/services/detailing.jpg"],
      link: ["products.html?group=care", "Shop car care products"],
      secs: [
        ["Why choose AutoHub", "g", ["Premium products", "Professional techniques", "Longer protection", "Showroom finish", "Suitable for all vehicles"]],
        ["Exterior wash and detail", "g", ["Snow foam wash", "Hand wash", "Wheel and tyre cleaning", "Tar and bug removal", "Drying and finishing"]],
        ["Paint correction", "g", ["Swirl and scratch removal", "Machine polishing", "Paint restoration", "Enhanced gloss", "Showroom finish"]],
        ["Ceramic coating and paint protection", "g", ["Long lasting protection", "UV and chemical resistance", "Hydrophobic effect", "Enhanced shine", "Easier maintenance"]],
        ["Interior detailing", "g", ["Deep vacuuming", "Leather cleaning and conditioning", "Dashboard and trim care", "Carpet and seat shampoo", "Odour removal"]],
        ["Engine bay detailing", "g", ["Degreasing and cleaning", "Steam cleaning", "Plastic and rubber care", "Protection and finishing", "Showroom look"]],
        ["What you get", "g", ["Protects your investment", "Restores original look", "Enhances resale value", "Long lasting results"]]
      ]
    },
    "Panel Beating and Respray": {
      tag: "Accident damage? We bring your car back to life",
      imgs: ["images/services/panel-beating.jpg"],
      secs: [
        ["Repairs we handle", "c", ["Accident repairs", "Dent removal", "Spray painting", "Frame straightening", "Bumper repairs"]],
        ["Our panel beating services", "g", ["Accident damage repairs", "Dent removal (minor and major)", "Panel beating and reshaping", "Spray painting (factory finish)", "Bumper repairs and replacement", "Scratch repairs", "Frame straightening", "Chassis repairs", "Rust removal and restoration", "Full body respray", "Insurance assessments", "Custom body work and modifications"]],
        ["Before and after work", "g", ["Accident damage repair", "Dent removal and panel repair", "Scratch and dent repairs", "Bumper repairs and replacements"]],
        ["Paint booth", "l", [["Factory quality finish", "Repainting done in a dedicated paint booth"]]],
        ["Our process", "l", [["Assessment", "Free inspection and quote"], ["Panel repair", "Professional technicians"], ["Painting", "Factory finish"], ["Quality check", "Perfect results"], ["Delivery", "Back on the road"]]],
        ["Work with all vehicle brands", "c", BRANDS]
      ]
    },
    "Car Wrapping": {
      tag: "Transform, protect, personalise",
      imgs: ["images/services/wrapping.jpg"],
      secs: [
        ["Why wrap with AutoHub", "g", ["Premium vinyl materials", "Wide range of colours", "Professional installation", "Paint protection", "Custom designs", "Residue free removal"]],
        ["Finishes", "c", ["Matte", "Gloss", "Satin", "Chrome", "Textured"]],
        ["Colour examples", "c", ["Matte black", "Gloss black", "Satin grey", "Pearl white", "Gloss red", "Metallic blue", "Chrome gold", "Carbon fibre"]],
        ["Wrap styles", "l", [["Full wrap", "Colour change"], ["Custom wrap designs", "Branding and styling"], ["Premium finishes", "Matte, satin and chrome"]]],
        ["Additional wrap services", "g", ["Roof wraps (gloss or matte)", "Mirror caps wrap", "Chrome delete", "Racing stripes and graphics", "Headlight and taillight tint", "Paint protection film (PPF)", "Commercial branding", "Full and partial wraps"]],
        ["Installation", "l", [["Professional installation", "Flawless finish"], ["Attention to detail", "Premium results"], ["High quality vinyl", "Durable and long lasting"]]]
      ]
    },
    "Interior Rejuvenation": {
      tag: "A fresher look and feel inside",
      imgs: [],
      link: ["products.html?group=care", "Shop car care products"],
      secs: [
        ["What to expect", "g", ["Refresh for cabin surfaces and trim", "Improves the look and feel of the interior", "Careful attention to the finish"]],
        ["Interior upgrades", "c", ["Bucket seats", "Steering wheels", "Interior detailing"]]
      ]
    },
    "Mag Wheels": {
      tag: "Style, performance, perfect fitment",
      imgs: ["images/services/alloy-wheels.jpg"],
      secs: [
        ["Why choose our wheels", "g", ["Premium quality", "Wide variety", "Perfect fitment", "Suitable for multiple brands"]],
        ["Alloy wheel styles", "l", [["BMW Style 1", "Black machine finish"], ["BMW Style 2", "Gloss black"], ["BMW Style 3", "Silver and white finish"], ["Style 4", "Silver finish"], ["Style 5", "Gloss black"], ["Style 6", "Gold and pearl finish"]]],
        ["Compatible with multiple brands", "c", ["BMW", "Mercedes Benz", "Toyota", "Volkswagen", "Toyota Gazoo Racing"]],
        ["Also available", "g", ["Supply and fitment available"]]
      ]
    },
    "Bucket Seats": {
      tag: "Style, comfort, performance",
      imgs: ["images/services/bucket-seats.jpg"],
      secs: [
        ["Why choose our seats", "g", ["Premium quality", "Sporty designs", "Durable materials", "Perfect fitment", "Suitable for various vehicle models"]],
        ["Sport series", "l", [["Sport Series 1", "Black and red"], ["Sport Series 2", "Black and grey"], ["Sport Series 3", "Red and black"], ["Sport Series 4", "All black"], ["Sport Series 5", "Black and blue"], ["Sport Series 6", "Black and white"], ["Sport Series 7", "Black Alcantara and red"], ["Sport Series 8", "Black and yellow"]]],
        ["Suitable for multiple brands and models", "c", ["BMW", "Mercedes Benz", "Toyota", "Volkswagen", "Toyota Gazoo Racing"]],
        ["Also available", "g", ["Supply and fitment available", "Custom designs on request", "Professional installation"]]
      ]
    },
    "Steering Wheels": {
      tag: "Transform your drive: luxury, sport, performance",
      imgs: ["images/services/steering-wheels.jpg"],
      secs: [
        ["Why choose our steering wheels", "g", ["Premium quality", "Custom designs", "Perfect fitment", "Enhanced driving experience"]],
        ["Styles shown", "c", ["Volkswagen", "Mercedes Benz AMG", "BMW M", "Toyota GR", "BMW M Performance"]],
        ["What is on offer", "l", [["Premium materials", "Alcantara, leather and carbon fibre"], ["Custom styles", "Various designs and colours"], ["Professional installation", "Perfect fitment guaranteed"], ["Compatible with multiple brands", "VW, Mercedes Benz, BMW, Toyota and more"]]]
      ]
    },
    "Engine Enhancement": {
      tag: "More power, better efficiency, smoother drive",
      imgs: ["images/services/engine.jpg"],
      secs: [
        ["What we improve", "c", ["Performance upgrade", "Fuel efficiency improvement", "Turbo upgrades", "ECU remapping", "Engine tuning", "Engine rebuilds", "Cooling system upgrades"]],
        ["Our engine enhancement services", "l", [["Turbo kits", "Install and upgrade"], ["ECU remapping", "More power and economy"], ["Air intake systems", "Better airflow"], ["Exhaust systems", "Enhanced sound and performance"], ["Engine rebuilds", "Restore peak performance"], ["Intercoolers", "Lower temps, higher power"], ["Cooling system upgrades", "Better reliability"], ["Performance servicing", "Keep your engine in top shape"]]],
        ["Benefits", "g", ["Increased horsepower and torque", "Better fuel efficiency", "Smoother acceleration", "Improved engine reliability", "Custom solutions for your vehicle", "Suitable for daily drive and performance builds"]],
        ["Compatible with multiple brands", "c", ["BMW", "Mercedes Benz", "Audi", "Toyota", "Volkswagen", "Lexus", "Nissan", "Honda"]]
      ]
    },
    "Car Security Systems": {
      tag: "Advanced protection for your vehicle, 24/7",
      imgs: ["images/services/security.jpg"],
      secs: [
        ["Protection you get", "c", ["Theft protection", "Real time monitoring", "GPS tracking", "Remote control", "Alarm systems", "Mobile app access"]],
        ["What we supply and fit", "l", [["Alarm systems", "Anti theft alarms with shock, motion and door sensors"], ["GPS trackers", "Track your vehicle in real time with live location, history and geo fencing"], ["Immobilisers", "Prevent unauthorised starting of your vehicle"], ["Central locking systems", "Remote control locking and unlocking for added convenience and security"], ["Reverse cameras", "Drive and park with confidence"], ["Dash cameras", "Record your journeys for safety and evidence"], ["Parking sensors", "Detect obstacles and prevent collisions"], ["Car key programming", "Spare keys, remote programming and key replacements"]]],
        ["Control it from your phone", "g", ["Lock and unlock from your phone", "Live GPS tracking", "Geo fence alerts", "Alarm notifications", "Engine immobilisation", "Track vehicle history"]],
        ["Why choose AutoHub", "g", ["Premium products", "Professional installation", "Suitable for all vehicle types", "Modern and reliable technology", "Expert technicians", "After sales support"]],
        ["Compatible with all vehicle brands", "c", BRANDS]
      ]
    },
    "Dash Cameras and Fleet Tracking": {
      tag: "Smart fleet, safer driving",
      imgs: ["images/services/dash-camera.jpg", "images/services/remote-4g.jpg"],
      secs: [
        ["4G dash camera features", "g", ["4G WiFi GPS optional", "1080P Full HD", "Built in 2CH, front and cabin", "TF storage, max 1TB", "App and web remote view", "Fleet management"]],
        ["Remote monitoring, anytime, anywhere", "l", [["4G remote transmission", "Monitor your fleet remotely through a PC or mobile phone"]]],
        ["Ideal for various vehicles", "c", ["Taxi", "Van", "Bus"]],
        ["Monitoring tools", "g", ["Remote monitor", "GPS tracking", "Real time alerts", "Playback", "Data security"]]
      ]
    }
  };
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function buildBody(secs) {
    return secs.map(function (sec) {
      var head = '<p class="small pmlabel">' + esc(sec[0]) + '</p>';
      if (sec[1] === "c") return head + '<div class="mats svcchips">' + sec[2].map(function (i) { return "<span>" + esc(i) + "</span>"; }).join("") + "</div>";
      if (sec[1] === "g") return head + '<ul class="pmfeat cols">' + sec[2].map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
      return head + '<ul class="pmfeat">' + sec[2].map(function (i) { return "<li><b>" + esc(i[0]) + "</b>" + (i[1] ? "<span>" + esc(i[1]) + "</span>" : "") + "</li>"; }).join("") + "</ul>";
    }).join("");
  }
  if (cards.length) {
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = '<div class="modalbg" data-close="1"></div>' +
      '<div class="modalbox svcbox" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
      '<button type="button" class="modalclose" data-close="1" aria-label="Close details">&times;</button>' +
      '<div class="svcfig" id="svcFig" hidden><div class="svcpic"><img id="svcImg" alt=""></div><div class="svcthumbs" id="svcThumbs"></div></div>' +
      '<div class="svcinfo"><h3 id="modalTitle"></h3><p class="pmtag" id="modalTag"></p><p class="modallead" id="modalLead"></p>' +
      '<div id="modalBody"></div>' +
      '<p class="small">Scope, materials, timelines and pricing are confirmed during consultation.</p>' +
      '<div class="modalbtns"><a class="btn btnred" id="modalGo" href="contact.html">Request this service</a>' +
      '<a class="btn btnghost" id="modalShop" href="products.html?group=care" hidden>Shop car care products</a>' +
      '<button type="button" class="btn btnghost" data-close="1">Close</button></div></div></div>';
    document.body.appendChild(modal);
    var lastFocus = null;
    var svcImg = $("#svcImg"), svcFig = $("#svcFig"), svcThumbs = $("#svcThumbs");
    var showPic = function (src, alt) { svcImg.src = src; svcImg.alt = alt; $(".svcpic", modal).scrollTop = 0; };
    var closeModal = function () {
      modal.classList.remove("open");
      document.body.classList.remove("locked");
      if (lastFocus) lastFocus.focus();
    };
    var openModal = function (card) {
      var title = $("h3", card).textContent.trim();
      var d = details[title] || { tag: "", imgs: [], secs: [] };
      $("#modalTitle").textContent = title;
      var tag = $("#modalTag"); tag.textContent = d.tag || ""; tag.hidden = !d.tag;
      $("#modalLead").textContent = $("p", card).textContent.trim();
      $("#modalBody").innerHTML = buildBody(d.secs || []);
      $("#modalGo").setAttribute("href", "contact.html?service=" + encodeURIComponent(title));
      var shop = $("#modalShop");
      shop.hidden = !d.link;
      if (d.link) { shop.setAttribute("href", d.link[0]); shop.textContent = d.link[1]; }
      var imgs = d.imgs || [];
      svcFig.hidden = !imgs.length;
      modal.querySelector(".svcbox").classList.toggle("noimg", !imgs.length);
      if (imgs.length) {
        showPic(imgs[0], title + " flyer");
        svcThumbs.hidden = imgs.length < 2;
        svcThumbs.innerHTML = imgs.map(function (src, n) {
          return '<button type="button" class="svcthumb' + (n === 0 ? " on" : "") + '" data-src="' + esc(src) + '" aria-label="Show picture ' + (n + 1) + '"><img src="' + esc(src) + '" alt=""></button>';
        }).join("");
      }
      lastFocus = document.activeElement;
      modal.classList.add("open");
      document.body.classList.add("locked");
      $(".modalbox", modal).scrollTop = 0;
      setTimeout(function () { $(".modalclose", modal).focus(); }, 60);
    };
    cards.forEach(function (card) {
      var more = document.createElement("span");
      more.className = "cardmore";
      more.textContent = "View details";
      card.appendChild(more);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", function () { openModal(card); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target.getAttribute && e.target.getAttribute("data-close")) { closeModal(); return; }
      var th = e.target.closest ? e.target.closest(".svcthumb") : null;
      if (th) {
        $all(".svcthumb", modal).forEach(function (b) { b.classList.toggle("on", b === th); });
        showPic(th.getAttribute("data-src"), $("#modalTitle").textContent + " flyer");
      }
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $all("button, a[href]", modal).filter(function (x) { return !x.hidden && x.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Body kits: material picker */
  var matPanel = $("#matPanel");
  if (matPanel) {
    var materials = {
      pp: { name: "PP (Polypropylene)", text: "Flexible, with strong impact resistance and easy to paint.", alt: "PP polypropylene pellets", flex: 90, rigid: 55, light: 75 },
      abs: { name: "ABS (Acrylonitrile Butadiene Styrene)", text: "High rigidity, a smooth surface and excellent toughness.", alt: "ABS pellets", flex: 60, rigid: 90, light: 70 },
      frp: { name: "FRP (Fiberglass)", text: "Lightweight and strong, and suitable for customized parts.", alt: "Fiberglass strands", flex: 40, rigid: 80, light: 80 },
      carbon: { name: "Carbon Fiber", text: "Lightweight with high strength and a premium appearance.", alt: "Carbon fiber weave", flex: 30, rigid: 95, light: 98 }
    };
    var tabs = $all(".tab");
    var showMaterial = function (key) {
      var m = materials[key];
      if (!m) return;
      $("#matName").textContent = m.name;
      $("#matText").textContent = m.text;
      var img = $("#matImg");
      img.src = "images/mat-" + key + ".jpg";
      img.alt = m.alt;
      $("#mFlex").style.width = m.flex + "%";
      $("#mRigid").style.width = m.rigid + "%";
      $("#mLight").style.width = m.light + "%";
      matPanel.classList.remove("swap");
      void matPanel.offsetWidth;
      matPanel.classList.add("swap");
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (o) {
          var on = o === t;
          o.classList.toggle("active", on);
          o.setAttribute("aria-selected", String(on));
        });
        showMaterial(t.getAttribute("data-mat"));
      });
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) { if (e.isIntersecting) { showMaterial("pp"); obs.disconnect(); } });
      }, { threshold: 0.3 }).observe(matPanel);
    } else { showMaterial("pp"); }
  }

  /* Body kits: before and after slider */
  var cmp = $("#cmpRange");
  if (cmp) {
    var wrap = cmp.parentElement;
    var setPos = function () { wrap.style.setProperty("--pos", cmp.value + "%"); };
    cmp.addEventListener("input", setPos);
    setPos();
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          obs.disconnect();
          var t0 = null;
          (function demo(ts) {
            if (t0 === null) t0 = ts;
            var p = (ts - t0) / 1600;
            if (p >= 1 || document.activeElement === cmp) { cmp.value = 50; setPos(); return; }
            cmp.value = 50 + Math.sin(p * Math.PI * 2) * 38;
            setPos();
            window.requestAnimationFrame(demo);
          })(performance.now());
        });
      }, { threshold: 0.6 }).observe(wrap);
    }
  }

  /* Body kits: panel gap demo */
  var range = $("#gapRange");
  if (range) {
    var stage = $("#fitStage");
    var gapValue = $("#gapValue");
    var verdict = $("#fitVerdict");
    var updateGap = function () {
      var v = parseInt(range.value, 10);
      stage.style.setProperty("--gap", v);
      gapValue.textContent = v + " mm";
      var bad = v > 4;
      stage.setAttribute("data-state", bad ? "bad" : "good");
      verdict.innerHTML = bad
        ? "<b>Poor fitment:</b> a large gap, easy to shake and it affects appearance."
        : "<b>Precise mold:</b> perfect fitment and seamless integration.";
    };
    range.addEventListener("input", updateGap);
    updateGap();
  }

  /* Shipping: mode picker */
  var route = $(".route");
  if (route) {
    var rtabs = $all(".rtab");
    var vehicle = $("#vehicle");
    var routeText = $("#routeText");
    var icons = {
      sea: '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 36h44l-6 10H12z"/><path d="M14 36V24h24v12M22 24v-8h10v8"/></svg>',
      air: '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 30l16-3 14-16h6l-8 17 12 2 4-4h4l-3 7 3 7h-4l-4-4-12 2 8 17h-6L20 33 4 30z"/></svg>',
      express: '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16h30v22H4zM34 24h10l8 8v6H34z"/><circle cx="14" cy="42" r="5"/><circle cx="42" cy="42" r="5"/></svg>'
    };
    var modes = {
      sea: { dur: "5s", text: "Sea freight suits larger kits and bulk orders. Timelines and costs are confirmed when you enquire." },
      air: { dur: "2.4s", text: "Air freight is a quicker option for parts you need sooner. Timelines and costs are confirmed when you enquire." },
      express: { dur: "3.4s", text: "Express delivery moves smaller parcels door to door. Timelines and costs are confirmed when you enquire." }
    };
    var setMode = function (key) {
      var m = modes[key];
      vehicle.innerHTML = icons[key];
      routeText.textContent = m.text;
      route.style.setProperty("--dur", m.dur);
      route.classList.remove("go");
      void route.offsetWidth;
      route.classList.add("go");
    };
    rtabs.forEach(function (t) {
      t.addEventListener("click", function () {
        rtabs.forEach(function (o) {
          var on = o === t;
          o.classList.toggle("active", on);
          o.setAttribute("aria-selected", String(on));
        });
        setMode(t.getAttribute("data-mode"));
      });
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) { if (e.isIntersecting) { setMode("sea"); obs.disconnect(); } });
      }, { threshold: 0.4 }).observe(route);
    } else { setMode("sea"); }
  }

  /* Contact: copy numbers, service chips, live message preview, WhatsApp send */
  $all(".contactlist a[href^='tel:']").forEach(function (a) {
    var val = document.createElement("div");
    val.className = "val";
    a.parentNode.insertBefore(val, a);
    val.appendChild(a);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copybtn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy " + a.textContent);
    btn.addEventListener("click", function () {
      var number = a.textContent.trim();
      var done = function () { toast("Copied " + number); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(number).then(done, done);
      else done();
    });
    val.appendChild(btn);
  });

  var form = $("#quoteForm");
  if (form) {
    var formError = $("#formError");
    var previewText = $("#previewText");
    var picks = $all("input[name='service']", form);
    var buildMessage = function () {
      var name = form.elements.name.value.trim();
      var vehicleName = form.elements.vehicle.value.trim();
      var message = form.elements.message.value.trim();
      var services = picks.filter(function (p) { return p.checked; }).map(function (p) { return p.value; });
      return {
        ok: !!(name && vehicleName && message),
        text: "Hello AutoHub, my name is " + (name || "...") + ".\n" +
          "Vehicle: " + (vehicleName || "...") + "\n" +
          "Services: " + (services.length ? services.join(", ") : "General enquiry") + "\n" +
          "Request: " + (message || "...")
      };
    };
    var refresh = function () { previewText.textContent = buildMessage().text; };
    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);

    var query = new URLSearchParams(window.location.search);
    var wanted = query.get("service");
    if (wanted) {
      picks.forEach(function (p) { if (p.value === wanted) p.checked = true; });
      toast("Selected: " + wanted);
    }
    var product = (query.get("product") || "").slice(0, 120);
    if (product) {
      form.elements.message.value = "I would like a quote for: " + product + ".";
      toast("Quote request for " + product);
    }
    refresh();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var m = buildMessage();
      if (!m.ok) { formError.hidden = false; return; }
      formError.hidden = true;
      window.open("https://wa.me/263773963182?text=" + encodeURIComponent(m.text), "_blank", "noopener");
      toast("Opening WhatsApp");
    });
  }

  /* Letter by letter page titles */
  $all(".pagehero h1").forEach(function (h1) {
    var text = h1.textContent;
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    text.split("").forEach(function (chr, i) {
      var s = document.createElement("span");
      s.setAttribute("aria-hidden", "true");
      s.className = chr === " " ? "chsp" : "ch";
      s.style.setProperty("--i", i);
      s.textContent = chr === " " ? "\u00a0" : chr;
      h1.appendChild(s);
    });
  });

  /* Reveal from the sides */
  $all(".split > .reveal:first-child, .contactgrid > .reveal:first-child, .fitleft > .reveal").forEach(function (el) { el.classList.add("from-left"); });
  $all(".split > .reveal:last-child, .contactgrid > .reveal:last-child, .checks.reveal").forEach(function (el) { el.classList.add("from-right"); });

  /* Home page: find your service */
  var opts = $all(".opt");
  var result = $("#finderResult");
  opts.forEach(function (o) {
    o.addEventListener("click", function () {
      opts.forEach(function (x) { x.classList.toggle("on", x === o); });
      var svc = o.getAttribute("data-svc");
      result.innerHTML = '<h3></h3><p></p><a class="btn btnred" href="contact.html">Request this service</a>';
      $("h3", result).textContent = svc;
      $("p", result).textContent = o.getAttribute("data-why");
      $("a", result).setAttribute("href", "contact.html?service=" + encodeURIComponent(svc));
      result.classList.remove("pop");
      void result.offsetWidth;
      result.classList.add("pop");
    });
  });

  /* Footer year */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
