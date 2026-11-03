/* Loads the products the admin added (Firebase Firestore) and hands them to products.js.
   If Firebase is not set up, or the visitor is offline, the built in products still show. */
   (function () {
    "use strict";
    var cfg = window.AUTOHUB_FIREBASE;
    if (!cfg || !cfg.apiKey || /YOUR_/.test(cfg.apiKey) || /YOUR_/.test(cfg.projectId)) return;
    var V = "10.12.2";
    var base = "https://www.gstatic.com/firebasejs/" + V + "/";
    Promise.all([import(base + "firebase-app.js"), import(base + "firebase-firestore.js")]).then(function (m) {
      var app = m[0].initializeApp(cfg);
      var fs = m[1];
      var db = fs.getFirestore(app);
      /* No orderBy: a single document missing createdAt would otherwise fail the whole query. */
      return fs.getDocs(fs.collection(db, "products"));
    }).then(function (snap) {
      var items = [];
      snap.forEach(function (d) { var x = d.data(); x.id = d.id; items.push(x); });
      /* Newest first, sorted in the browser so the query itself stays simple. */
      items.sort(function (a, b) {
        var ta = a.createdAt && typeof a.createdAt.seconds === "number" ? a.createdAt.seconds : 0;
        var tb = b.createdAt && typeof b.createdAt.seconds === "number" ? b.createdAt.seconds : 0;
        return tb - ta;
      });
      window.AutoHubStore = { items: items };
      window.dispatchEvent(new CustomEvent("autohubstore", { detail: items }));
    }).catch(function (err) {
      /* Keep the built in products, but leave a clue in the console so the cause is visible. */
      console.warn("AutoHub store: could not load dashboard products.", err && err.code ? err.code : "", err && err.message ? err.message : "");
    });
  })();