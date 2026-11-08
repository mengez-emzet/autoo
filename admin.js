/* AutoHub admin dashboard. Plain JavaScript (ES module) with Firebase Auth and Firestore.
   Security: sign in is handled by Firebase Auth. Only users listed in the "admins" collection
   can write products, and that is enforced by firestore.rules on the server, not by this page. */
   (function () {
    "use strict";
  
    var cfg = window.AUTOHUB_FIREBASE;
    var V = "10.12.2";
    var base = "https://www.gstatic.com/firebasejs/" + V + "/";
    var IDLE_MS = 20 * 60 * 1000;
  
    function $(s, c) { return (c || document).querySelector(s); }
    function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function show(el, on) { el.hidden = !on; }
  
    var toastTimer;
    function toast(msg) {
      var t = $("#toast");
      t.textContent = msg; t.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
    }
  
    /* theme toggle */
    var root = document.documentElement;
    $("#themeToggle").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("autohubTheme", next); } catch (e) {}
    });
  
    var configured = cfg && cfg.apiKey && !/YOUR_/.test(cfg.apiKey) && !/YOUR_/.test(cfg.projectId);
    if (!configured) { show($("#loading"), false); show($("#setup"), true); return; }
  
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")])
      .then(function (m) { start(m[0], m[1], m[2]); })
      .catch(function () {
        $("#loading").textContent = "Could not load the sign in service. Check your internet connection and refresh the page.";
      });
  
    function start(appM, authM, fs) {
      var app = appM.initializeApp(cfg);
      var auth = authM.getAuth(app);
      var db = fs.getFirestore(app);
      var products = [];
      var editing = null;       /* the product being edited, or null for a new one */
      var imageData = "";       /* resized picture as a data URL */
      var idleTimer;
  
      /* ---------- sign in ---------- */
      function loginError(msg) { var e = $("#loginError"); e.textContent = msg; show(e, !!msg); }
  
      /* show / hide password */
      var passInput = $("#lPass");
      var passToggle = $("#passToggle");
      passToggle.addEventListener("click", function () {
        var reveal = passInput.type === "password";
        passInput.type = reveal ? "text" : "password";
        passToggle.setAttribute("aria-pressed", String(reveal));
        passToggle.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
        passToggle.classList.toggle("on", reveal);
        passInput.parentNode.classList.toggle("revealed", reveal);
        passInput.focus();
        var len = passInput.value.length;
        try { passInput.setSelectionRange(len, len); } catch (e) {}
      });
  
      $("#loginForm").addEventListener("submit", function (ev) {
        ev.preventDefault();
        var email = $("#lEmail").value.trim(), pass = $("#lPass").value;
        if (!email || !pass) { loginError("Enter your email and password."); return; }
        
        loginError("");
        $("#loginBtn").disabled = true;
        
        authM.signInWithEmailAndPassword(auth, email, pass).then(function () {
          // SUCCESS: Show green message and clear the password field
          var errEl = $("#loginError");
          errEl.textContent = "Login successful! Loading dashboard...";
          errEl.classList.add("success");
          show(errEl, true);
          
          // Reset the password field
          $("#loginBtn").disabled = false;
          $("#lPass").value = "";
          $("#lPass").type = "password";
          $("#lPass").parentNode.classList.remove("revealed");
          $("#passToggle").classList.remove("on");
          $("#passToggle").setAttribute("aria-pressed", "false");
          $("#passToggle").setAttribute("aria-label", "Show password");
          
        }).catch(function (err) {
          // FAILURE: Show red message, but KEEP the password in the field
          var code = err && err.code || "";
          var errEl = $("#loginError");
          errEl.classList.remove("success");
          errEl.textContent = /too-many/.test(code) ? "Too many attempts. Wait a few minutes and try again." : "That email or password is not correct.";
          show(errEl, true);
          
          // Re-enable the button, but leave the password alone
          $("#loginBtn").disabled = false;
        });
      });
  
      $("#forgot").addEventListener("click", function () {
        var email = $("#lEmail").value.trim();
        if (!email) { loginError("Type your email above first, then press Forgot password."); return; }
        authM.sendPasswordResetEmail(auth, email).then(function () {
          loginError(""); toast("If that email is an admin account, a reset link has been sent.");
        }, function () { toast("If that email is an admin account, a reset link has been sent."); });
      });
  
      $("#signOut").addEventListener("click", function () { authM.signOut(auth); });
  
      function bumpIdle() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () { toast("Signed out after 20 minutes of inactivity."); authM.signOut(auth); }, IDLE_MS);
      }
      ["click", "keydown", "mousemove", "touchstart"].forEach(function (ev) {
        document.addEventListener(ev, function () { if (auth.currentUser) bumpIdle(); }, { passive: true });
      });
  
      authM.onAuthStateChanged(auth, function (user) {
        show($("#loading"), false);
        if (!user) {
          clearTimeout(idleTimer);
          show($("#dash"), false); show($("#login"), true);
          show($("#signOut"), false); show($("#adminUser"), false);
          
          // ADD THESE TWO LINES:
          $("#loginError").classList.remove("success");
          show($("#loginError"), false);
          
          return;
        }
        /* confirm this account is an admin before showing anything */
        fs.getDoc(fs.doc(db, "admins", user.uid)).then(function (snap) {
          if (!snap.exists()) {
            authM.signOut(auth).then(function () { loginError("This account is not allowed to use the dashboard."); });
            return;
          }
          loginError("");
          show($("#login"), false); show($("#dash"), true);
          $("#adminUser").textContent = user.email || ""; show($("#adminUser"), true);
          show($("#signOut"), true);
          bumpIdle();
          loadProducts();
        }).catch(function () {
          authM.signOut(auth).then(function () { loginError("Could not check your admin access. Try again."); });
        });
      });
  
      /* ---------- products list ---------- */
      function loadProducts() {
        fs.getDocs(fs.query(fs.collection(db, "products"), fs.orderBy("createdAt", "desc"))).then(function (snap) {
          products = [];
          snap.forEach(function (d) { var x = d.data(); x.id = d.id; products.push(x); });
          renderList(); fillCategories();
        }).catch(function () { toast("Could not load the products."); });
      }
      function renderList() {
        $("#countPill").textContent = products.length;
        var ul = $("#adminList");
        if (!products.length) { ul.innerHTML = '<li class="empty">No products added yet.</li>'; return; }
        ul.innerHTML = products.map(function (p) {
          return '<li><img src="' + esc(p.img) + '" alt=""><div><b>' + esc(p.name) + '</b><span>' + (p.group === "care" ? "Car care" : "Body kits and parts") + ' / ' + esc(p.cat || "") + '</span></div>' +
            '<div class="btns"><button type="button" data-edit="' + esc(p.id) + '">Edit</button><button type="button" data-del="' + esc(p.id) + '">Delete</button></div></li>';
        }).join("");
      }
      function fillCategories() {
        var set = { "Bumpers": 1, "Complete kits": 1, "Lips and splitters": 1, "Rear and trim": 1, "Protection and shine": 1, "Washing and prep": 1, "Interior care": 1, "Towels and tools": 1 };
        products.forEach(function (p) { if (p.cat) set[p.cat] = 1; });
        $("#catList").innerHTML = Object.keys(set).map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
      }
      $("#adminList").addEventListener("click", function (e) {
        var ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
        if (ed) { beginEdit(ed.getAttribute("data-edit")); }
        if (del) {
          var id = del.getAttribute("data-del");
          var p = products.filter(function (x) { return x.id === id; })[0];
          if (p && window.confirm('Delete "' + p.name + '"? This cannot be undone.')) {
            fs.deleteDoc(fs.doc(db, "products", id)).then(function () {
              toast("Product deleted"); if (editing && editing.id === id) resetForm(); loadProducts();
            }, function () { toast("Could not delete. Check you are signed in as an admin."); });
          }
        }
      });
  
      /* ---------- form ---------- */
      var form = $("#pForm");
      function group() { return form.elements.group.value; }
      function syncGroup() {
        var care = group() === "care";
        show($("#sizeBox"), care); show($("#tagBox"), care); show($("#matBox"), !care);
        drawPreview();
      }
      $all("input[name='group']", form).forEach(function (r) { r.addEventListener("change", syncGroup); });
  
      function featRow(t, s) {
        var d = document.createElement("div");
        d.className = "featrow";
        d.innerHTML = '<input maxlength="80" placeholder="Title" aria-label="Feature title"><input maxlength="120" placeholder="Short note (optional)" aria-label="Feature note"><button type="button" aria-label="Remove feature">&times;</button>';
        d.children[0].value = t || ""; d.children[1].value = s || "";
        d.children[2].addEventListener("click", function () { d.remove(); drawPreview(); });
        $("#featRows").appendChild(d);
      }
      $("#addFeat").addEventListener("click", function () {
        if ($all(".featrow").length >= 8) { toast("Up to 8 features"); return; }
        featRow("", ""); drawPreview();
      });
  
      function read() {
        var mats = $all("input[name='mat']:checked", form).map(function (c) { return c.value; });
        var feats = $all(".featrow").map(function (r) { return { t: r.children[0].value.trim(), s: r.children[1].value.trim() }; }).filter(function (x) { return x.t; });
        var tags = $("#fTags").value.split(",").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 12);
        var care = group() === "care";
        return {
          group: group(), name: $("#fName").value.trim(), cat: $("#fCat").value.trim(), badge: $("#fBadge").value.trim(),
          tagline: care ? $("#fTagline").value.trim() : "", size: care ? $("#fSize").value.trim() : "",
          desc: $("#fDesc").value.trim(), mats: care ? [] : mats, feats: feats, tags: tags,
          featured: $("#fFeatured").checked
        };
      }
  
      function drawPreview() {
        var d = read(), care = d.group === "care";
        var chips = care ? (d.size ? "<span>" + esc(d.size) + "</span>" : "") : (d.mats.length ? d.mats : ["PP", "ABS", "FRP", "Carbon Fiber"]).slice(0, 4).map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
        var img = imageData || (editing && editing.img) || "";
        $("#preview").innerHTML = '<article class="pcard"><div class="pimg ' + (care ? "tall" : "wide") + '">' +
          (img ? '<img src="' + esc(img) + '" alt="">' : '<div class="noimg">No picture yet</div>') +
          (d.badge ? '<span class="pbadge">' + esc(d.badge) + '</span>' : "") + '</div>' +
          '<div class="pbody"><p class="pcat">' + esc(d.cat || "Category") + '</p><h3>' + esc(d.name || "Product name") + '</h3>' +
          (d.tagline ? '<p class="ptag">' + esc(d.tagline) + '</p>' : "") + '<div class="mats">' + chips + '</div>' +
          '<div class="pfoot"><span class="btn btnred qbtn">Get a Quote</span><span class="padd">Add to list</span></div></div></article>';
      }
      form.addEventListener("input", drawPreview);
  
      function formError(msg) { var e = $("#formError"); e.textContent = msg; show(e, !!msg); if (msg) e.scrollIntoView({ block: "nearest" }); }
  
      function resetForm() {
        editing = null; imageData = "";
        form.reset();
        $("#featRows").innerHTML = "";
        [["OEM standard", "Designed according to original vehicle data"], ["Easy installation", "Fits without cutting or reworking the part"]].forEach(function (f) { featRow(f[0], f[1]); });
        $("#formTitle").textContent = "Add a product";
        show($("#cancelBtn"), false); $("#saveBtn").textContent = "Save product";
        $("#imgHint").textContent = "Use a clear picture. Body kit parts look best wide (landscape). Car care products look best tall (portrait). It is resized automatically.";
        formError(""); syncGroup();
      }
      $("#newBtn").addEventListener("click", function () { resetForm(); form.scrollIntoView({ behavior: "smooth", block: "start" }); $("#fName").focus(); });
      $("#cancelBtn").addEventListener("click", resetForm);
  
      function beginEdit(id) {
        var p = products.filter(function (x) { return x.id === id; })[0];
        if (!p) return;
        resetForm();
        editing = p;
        form.elements.group.value = p.group === "care" ? "care" : "kits";
        $("#fName").value = p.name || ""; $("#fCat").value = p.cat || ""; $("#fBadge").value = p.badge || "";
        $("#fSize").value = p.size || ""; $("#fTagline").value = p.tagline || ""; $("#fDesc").value = p.desc || "";
        $("#fTags").value = (p.tags || []).join(", "); $("#fFeatured").checked = !!p.featured;
        $all("input[name='mat']", form).forEach(function (c) { c.checked = !(p.mats && p.mats.length) || p.mats.indexOf(c.value) >= 0; });
        $("#featRows").innerHTML = "";
        (p.feats || []).forEach(function (f) { featRow(f.t, f.s); });
        $("#formTitle").textContent = "Edit product";
        $("#saveBtn").textContent = "Save changes"; show($("#cancelBtn"), true);
        $("#imgHint").textContent = "Leave the picture empty to keep the current one.";
        syncGroup();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
  
      /* ---------- picture: resized in the browser and stored with the product ---------- */
      function loadBitmap(file) {
        return new Promise(function (resolve, reject) {
          var url = URL.createObjectURL(file), img = new Image();
          img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
          img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("bad image")); };
          img.src = url;
        });
      }
      function shrink(img, max, q) {
        var s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.naturalWidth * s)); c.height = Math.max(1, Math.round(img.naturalHeight * s));
        var x = c.getContext("2d");
        x.fillStyle = "#ffffff"; x.fillRect(0, 0, c.width, c.height);
        x.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL("image/jpeg", q);
      }
      $("#fImg").addEventListener("change", function () {
        var file = this.files && this.files[0];
        imageData = "";
        if (!file) { drawPreview(); return; }
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { formError("Choose a JPG, PNG or WebP picture."); this.value = ""; return; }
        if (file.size > 15 * 1024 * 1024) { formError("That picture is too large. Choose one under 15 MB."); this.value = ""; return; }
        formError("");
        loadBitmap(file).then(function (img) {
          var max = 1000, q = 0.85, out = shrink(img, max, q);
          while (out.length > 700000 && (q > 0.45 || max > 500)) {
            if (q > 0.45) q -= 0.1; else max -= 150;
            out = shrink(img, max, q);
          }
          if (out.length > 800000) { formError("That picture is too detailed to store. Try a smaller one."); return; }
          imageData = out; drawPreview();
        }).catch(function () { formError("That picture could not be read. Try another one."); });
      });
  
      /* ---------- save ---------- */
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var d = read();
        if (!d.name) { formError("Enter the product name."); $("#fName").focus(); return; }
        if (!d.cat) { formError("Enter a category."); $("#fCat").focus(); return; }
        if (!d.desc) { formError("Enter a short description."); $("#fDesc").focus(); return; }
        if (d.group === "kits" && !d.mats.length) { formError("Choose at least one material."); return; }
        var img = imageData || (editing && editing.img) || "";
        if (!img) { formError("Add a product picture."); return; }
        d.img = img;
        formError("");
        $("#saveBtn").disabled = true;
        var now = fs.serverTimestamp(), op;
        if (editing) {
          d.updatedAt = now; d.createdAt = editing.createdAt || now;
          op = fs.setDoc(fs.doc(db, "products", editing.id), d);
        } else {
          d.createdAt = now; d.updatedAt = now; d.createdBy = auth.currentUser ? auth.currentUser.uid : "";
          op = fs.addDoc(fs.collection(db, "products"), d);
        }
        op.then(function () {
          toast(editing ? "Changes saved" : "Product added. It is now on the Products page.");
          resetForm(); loadProducts();
        }, function () { formError("Could not save. Check you are signed in as an admin and that firestore.rules are published."); })
          .then(function () { $("#saveBtn").disabled = false; });
      });
  
      resetForm();
    }
  })();