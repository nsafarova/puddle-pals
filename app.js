(function () {
  "use strict";

  // Placeholder price inside the $10 to $20 range being tested. Change it here.
  var PRICE = 16;
  // Placeholder set prices (trio of any 3, and all 5). Change them here.
  var TRIO_PRICE = 42;
  var FULL_PRICE = 64;
  // Placeholder gift packaging fee, charged once per order. Change it here.
  var GIFT_FEE = 3;

  var PALS = [
    { id: "longhorn", name: "longhorn", color: "c-cobalt", story: "Stands tall in any storm and never loses its cool. Rides along from the garage to class." },
    { id: "armadillo", name: "armadillo", color: "c-orange", story: "Always rolled up and ready. Tucks into the smallest pocket or the busiest bag." },
    { id: "bluebonnet", name: "bluebonnet", color: "c-sky", story: "Blooms the minute the clouds clear. The softest pal of the bunch." },
    { id: "mockingbird", name: "mockingbird", color: "c-navy", story: "Sings through the drizzle and keeps a gray day lively." },
    { id: "crawfish", name: "crawfish", color: "c-cream", story: "Loves a puddle more than anyone. A Gulf Coast regular on every rainy day." }
  ];

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function money(n) { return "$" + n.toFixed(2).replace(/\.00$/, ""); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Show a photo when the file exists, otherwise keep the branded placeholder.
  function resolve(src) { return (window.PHOTOS && window.PHOTOS[src]) || src; }
  function loadPhoto(box, src, alt, cb) {
    var real = resolve(src);
    var probe = new Image();
    probe.onload = function () {
      var img = el("img"); img.src = real; img.alt = alt; img.loading = "lazy";
      box.insertBefore(img, box.firstChild);
      box.classList.remove("missing");
      if (cb) cb(true);
    };
    probe.onerror = function () { if (cb) cb(false); };
    probe.src = real;
  }

  // Swipeable media: slides are added only when their image exists. Dots and arrows show with 2 or more slides.
  function mediaSlider(items) {
    var wrap = el("div", "media");
    var track = el("div", "track"); track.setAttribute("tabindex", "0"); track.setAttribute("aria-label", "Swipe for more photos");
    var dots = el("div", "dots");
    var prev = el("button", "nav-a prev", "&lsaquo;"); prev.type = "button"; prev.setAttribute("aria-label", "Previous photo");
    var next = el("button", "nav-a next", "&rsaquo;"); next.type = "button"; next.setAttribute("aria-label", "Next photo");
    wrap.appendChild(track); wrap.appendChild(prev); wrap.appendChild(next); wrap.appendChild(dots);
    var slides = [];
    function refresh() {
      var vis = slides.filter(function (s) { return !s.hidden; });
      dots.innerHTML = "";
      vis.forEach(function (s, i) {
        var d = el("button", "dot"); d.type = "button"; d.setAttribute("aria-label", "Photo " + (i + 1));
        d.addEventListener("click", function () { track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" }); });
        dots.appendChild(d);
      });
      var many = vis.length > 1;
      dots.hidden = !many; prev.hidden = !many; next.hidden = !many;
      mark();
    }
    function mark() {
      var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle("on", k === i); });
      prev.disabled = i <= 0; next.disabled = i >= dots.children.length - 1;
    }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(mark); });
    prev.addEventListener("click", function () { track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: track.clientWidth, behavior: "smooth" }); });
    items.forEach(function (it, idx) {
      var slide = el("div", "shot missing slide" + (/packaging/.test(it.src) ? " contain" : ""));
      if (it.fallback) slide.innerHTML = it.fallback; else { slide.hidden = true; }
      track.appendChild(slide); slides.push(slide);
      loadPhoto(slide, it.src, it.alt, function (ok) { if (ok) { slide.hidden = false; } refresh(); });
    });
    refresh();
    return wrap;
  }

  function drop(p) {
    return '<div class="d ' + p.color + '"><div class="shape"></div><div class="nm">' + p.name + "</div></div>";
  }

  // hero rain: the five pals fall as raindrop shaped photos
  (function () {
    var host = $("rain");
    var spots = [[4, 9, -2], [24, 11, -7], [48, 8, -4], [68, 10, -9], [86, 9.5, -5]];
    PALS.forEach(function (p, i) {
      var d = el("div", "rd c-" + p.id);
      d.style.left = spots[i][0] + "%"; d.style.animationDuration = spots[i][1] + "s"; d.style.animationDelay = spots[i][2] + "s";
      var inner = el("div", "rd-in missing");
      d.appendChild(inner); host.appendChild(d);
      loadPhoto(inner, "assets/products/" + p.id + ".jpg", "");
    });
  })();

  // products
  var grid = $("products");
  PALS.forEach(function (p) {
    var card = el("article", "card");
    var shot = mediaSlider([
      { src: "assets/products/" + p.id + ".jpg", alt: "The " + p.name + " puddle pal plush charm", fallback: drop(p) },
      { src: "assets/packaging/single-" + p.id + ".jpg", alt: "The " + p.name + " puddle pal in its individual packaging" }
    ]);
    var body = el("div", "body");
    body.innerHTML =
      '<span class="label tag">Texas pal</span><h3>' + p.name + "</h3><p>" + p.story + "</p>" +
      '<div class="row"><span class="price">' + money(PRICE) + '</span></div>';
    var btn = el("button", "btn sm", "Add to cart");
    btn.type = "button";
    btn.addEventListener("click", function () { add(p.id); openCart(); });
    body.querySelector(".row").appendChild(btn);
    card.appendChild(shot); card.appendChild(body);
    grid.appendChild(card);
  });

  // gallery
  Array.prototype.forEach.call(document.querySelectorAll("[data-photo]"), function (box) {
    loadPhoto(box, box.getAttribute("data-photo"), box.getAttribute("data-alt") || "");
  });

  // sets
  var picked = [];
  var setsHost = $("sets");
  (function () {
    var trio = el("article", "card setcard");
    trio.innerHTML =
      '<div class="body"><span class="label tag">Mix and match</span><h3>the trio</h3>' +
      "<p>Choose any three pals. They arrive together in one box, each packaged individually.</p>" +
      '<div class="dpicks" id="picks" role="group" aria-label="Choose three pals"></div>' +
      '<p class="small" id="pickMsg"></p>' +
      '<div class="row"><span class="price">' + money(TRIO_PRICE) + ' <span class="small">save ' + money(3 * PRICE - TRIO_PRICE) + "</span></span></div></div>";
    var addTrio = el("button", "btn sm", "Add trio to cart"); addTrio.type = "button"; addTrio.disabled = true;
    trio.querySelector(".row").appendChild(addTrio);
    var tShot = mediaSlider([{ src: "assets/packaging/trio.jpg", alt: "The Texas Trio gift box", fallback: '<span class="ph" style="display:block">Add assets/packaging/trio.jpg</span>' }]);
    trio.insertBefore(tShot, trio.firstChild);
    setsHost.appendChild(trio);
    var picks = trio.querySelector("#picks"), msg = trio.querySelector("#pickMsg");
    function refresh() {
      msg.textContent = picked.length === 3 ? "Your trio is ready." : "Pick " + (3 - picked.length) + " more pal" + (3 - picked.length === 1 ? "" : "s") + ".";
      addTrio.disabled = picked.length !== 3;
      Array.prototype.forEach.call(picks.children, function (b) {
        var i = picked.indexOf(b.getAttribute("data-id"));
        b.setAttribute("aria-pressed", i > -1 ? "true" : "false");
        b.querySelector(".ord").textContent = i > -1 ? String(i + 1) : "";
        b.disabled = i < 0 && picked.length >= 3;
      });
    }
    PALS.forEach(function (p) {
      var b = el("button", "pk", drop(p) + '<span class="ord"></span>'); b.type = "button"; b.setAttribute("data-id", p.id); b.setAttribute("aria-pressed", "false"); b.setAttribute("aria-label", "Choose " + p.name);
      b.addEventListener("click", function () {
        var i = picked.indexOf(p.id);
        if (i > -1) picked.splice(i, 1); else if (picked.length < 3) picked.push(p.id);
        refresh();
      });
      picks.appendChild(b);
    });
    addTrio.addEventListener("click", function () {
      var order = PALS.map(function (p) { return p.id; }).filter(function (id) { return picked.indexOf(id) > -1; });
      add("trio:" + order.join("+")); picked = []; refresh(); openCart();
    });
    refresh();

    var full = el("article", "card setcard");
    full.innerHTML =
      '<div class="body"><span class="label tag">Best value</span><h3>the full set</h3>' +
      "<p>All five Texas pals in one box, each packaged individually, for less than buying them one by one.</p>" +
      '<div class="fiveDrops">' + PALS.map(drop).join("") + "</div>" +
      '<div class="row"><span class="price">' + money(FULL_PRICE) + ' <span class="small">save ' + money(5 * PRICE - FULL_PRICE) + "</span></span></div></div>";
    var addFull = el("button", "btn sm", "Add full set to cart"); addFull.type = "button";
    addFull.addEventListener("click", function () { add("full"); openCart(); });
    full.querySelector(".row").appendChild(addFull);
    var fShot = mediaSlider([{ src: "assets/packaging/full.jpg", alt: "The Full Texas Set gift box", fallback: '<span class="ph" style="display:block">Add assets/packaging/full.jpg</span>' }]);
    full.insertBefore(fShot, full.firstChild);
    setsHost.appendChild(full);
  })();

  // cart
  var cart = {};
  try { var raw = localStorage.getItem("pp-cart"); if (raw) cart = JSON.parse(raw) || {}; } catch (e) {}
  function save() { try { localStorage.setItem("pp-cart", JSON.stringify(cart)); } catch (e) {} }
  function priceOf(key) { return key === "full" ? FULL_PRICE : key.indexOf("trio:") === 0 ? TRIO_PRICE : PRICE; }
  function count() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k]; }, 0); }
  function cartTotal() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k] * priceOf(k); }, 0); }
  function palById(id) { return PALS.filter(function (p) { return p.id === id; })[0]; }
  function add(id) { cart[id] = (cart[id] || 0) + 1; save(); renderCart(); }
  function change(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; save(); renderCart(); }

  var step = "cart"; // cart | checkout | done
  var lastFocus = null;

  function renderCart() {
    $("cartCount").textContent = count();
    var lines = $("lines"), foot = $("cartFoot");
    lines.innerHTML = ""; foot.innerHTML = "";
    var total = cartTotal();

    if (step === "done") {
      lines.appendChild(el("div", "empty", "<h3>preorder saved</h3><p style='margin-top:12px'>Thank you. This is a class project preview, so nothing was charged and no order was placed.</p>"));
      var back = el("button", "btn", "Keep browsing"); back.type = "button";
      back.addEventListener("click", function () { cart = {}; save(); step = "cart"; closeCart(); renderCart(); });
      foot.appendChild(back);
      return;
    }

    if (!count()) {
      lines.appendChild(el("div", "empty", "Your cart is empty. Pick a pal to get started."));
      step = "cart";
      return;
    }

    if (step === "checkout") {
      var f = el("form", "co");
      f.innerHTML =
        '<label for="coName">Name</label><input id="coName" required autocomplete="name">' +
        '<label for="coEmail">Email</label><input id="coEmail" type="email" required autocomplete="email">' +
        '<label class="chk" for="coGift"><input id="coGift" type="checkbox"> This is a gift</label>' +
        '<div id="giftBox" hidden><label class="chk" for="coPack"><input id="coPack" type="checkbox"> Add gift packaging (+' + money(GIFT_FEE) + ')</label><label for="coNote">Gift note (optional)</label><textarea id="coNote" maxlength="200"></textarea></div>' +
        '<p class="small">Preview checkout for a class project. We do not ask for card details and nothing is charged.</p>';
      var go = el("button", "btn orange", "Place preorder for " + money(total)); go.type = "submit";
      var tot = el("div", "sub", "<span>Total</span><span id=\"coTotal\">" + money(total) + "</span>");
      function recalc() {
        var gift = f.querySelector("#coGift").checked, pack = gift && f.querySelector("#coPack").checked;
        var t = total + (pack ? GIFT_FEE : 0);
        go.textContent = "Place preorder for " + money(t);
        tot.lastChild.textContent = money(t);
      }
      f.appendChild(go);
      f.querySelector("#coGift").addEventListener("change", function (e) { f.querySelector("#giftBox").hidden = !e.target.checked; recalc(); });
      f.querySelector("#coPack").addEventListener("change", recalc);
      f.addEventListener("submit", function (e) { e.preventDefault(); step = "done"; renderCart(); });
      lines.appendChild(f);
      var back2 = el("button", "btn ghost sm", "Back to cart"); back2.type = "button";
      back2.addEventListener("click", function () { step = "cart"; renderCart(); });
      foot.appendChild(tot);
      foot.appendChild(back2);
      return;
    }

    Object.keys(cart).forEach(function (key) {
      var title, sub, thHtml;
      if (key === "full") {
        title = "The full set"; sub = "All five pals in one box, " + money(FULL_PRICE);
        thHtml = '<div class="d c-cobalt"><div class="shape"></div><div class="nm">all 5</div></div>';
      } else if (key.indexOf("trio:") === 0) {
        var ids = key.slice(5).split("+");
        title = "Trio set"; sub = ids.map(function (i) { return cap(palById(i).name); }).join(", ") + " in one box, " + money(TRIO_PRICE);
        thHtml = drop(palById(ids[0]));
      } else {
        var p = palById(key);
        title = cap(p.name); sub = money(PRICE) + " each, packaged individually";
        thHtml = drop(p);
      }
      var li = el("div", "line");
      var th = el("div", "th", thHtml);
      var mid = el("div", null, '<div class="nm2">' + title + "</div><div class='small'>" + sub + "</div>");
      var q = el("div", "qty");
      var minus = el("button", null, "&minus;"); minus.type = "button"; minus.setAttribute("aria-label", "Remove one " + title);
      var plus = el("button", null, "+"); plus.type = "button"; plus.setAttribute("aria-label", "Add one " + title);
      minus.addEventListener("click", function () { change(key, -1); });
      plus.addEventListener("click", function () { change(key, 1); });
      q.appendChild(minus); q.appendChild(el("span", null, String(cart[key]))); q.appendChild(plus);
      mid.appendChild(q);
      li.appendChild(th); li.appendChild(mid); li.appendChild(el("div", "price", money(cart[key] * priceOf(key))));
      lines.appendChild(li);
    });
    foot.appendChild(el("div", "sub", "<span>Subtotal</span><span>" + money(total) + "</span>"));
    foot.appendChild(el("p", "small", "Shipping is calculated at checkout."));
    var co = el("button", "btn orange", "Checkout"); co.type = "button";
    co.addEventListener("click", function () { step = "checkout"; renderCart(); });
    foot.appendChild(co);
  }

  function openCart() {
    lastFocus = document.activeElement;
    $("scrim").hidden = false; $("drawer").hidden = false;
    $("closeCart").focus();
    renderCart();
  }
  function closeCart() {
    $("scrim").hidden = true; $("drawer").hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("openCart").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  $("scrim").addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("drawer").hidden) closeCart(); });
  renderCart();

})();
