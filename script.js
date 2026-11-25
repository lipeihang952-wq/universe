/* Peihang's Little Universe — edition 03. The page reads fine without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage is optional */ } }
  };

  document.querySelectorAll("[data-this-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- The pixel character's roles ---------- */
  var roles = [
    { id: "director", name: { en: "Director", zh: "导演" }, bubble: { en: "This take is the one. Move on!", zh: "这条过了，move on！" } },
    { id: "writer", name: { en: "Writer", zh: "编剧" }, bubble: { en: "Draft twenty-nine. Getting closer.", zh: "第二十九稿了，快了。" } },
    { id: "researcher", name: { en: "Researcher", zh: "研究者" }, bubble: { en: "Whose suggestion? The one I like.", zh: "听谁的？我选我喜欢的。" } },
    { id: "guitar", name: { en: "Songwriter", zh: "写歌的人" }, bubble: { en: "I wrote a song for this film.", zh: "这首歌，是我给片子写的。" } },
    { id: "piano", name: { en: "Pianist", zh: "弹钢琴的人" }, bubble: { en: "Even ordinary days deserve a little celebration.", zh: "平常的日子，也值得有一点仪式感。" } },
    { id: "poet", name: { en: "Little poet", zh: "写小诗的人" }, bubble: { en: "A little poem, so someone can keep it.", zh: "写首小诗，让人可以留下来。" } },
    { id: "cat", name: { en: "Cat assistant", zh: "猫猫助理" }, bubble: { en: "Two supervisors. Both have paws.", zh: "两位上司，都有爪子。" } }
  ];
  var roleIndex = 0;
  var avatar = document.getElementById("avatar");
  var roleName = document.getElementById("role-name");
  var bubble = document.getElementById("role-bubble");


  /* ---------- Language ---------- */
  var lang = store.get("peihang-universe-lang") === "zh" ? "zh" : "en";
  var langBtn = document.querySelector(".lang");

  function renderRole() {
    var r = roles[roleIndex];
    avatar.dataset.role = r.id;
    roleName.textContent = r.name[lang];
    bubble.textContent = r.bubble[lang];
  }

  function setLang(next) {
    lang = next;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-en][data-zh]").forEach(function (el) {
      el.textContent = el.dataset[lang];
    });
    langBtn.textContent = lang === "zh" ? "EN" : "中文";
    langBtn.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换到中文");
    renderRole();
    store.set("peihang-universe-lang", lang);
  }
  langBtn.addEventListener("click", function () { setLang(lang === "zh" ? "en" : "zh"); });

  function cycleRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    renderRole();
    if (!reduce) {
      avatar.classList.remove("is-hop");
      void avatar.offsetWidth;
      avatar.classList.add("is-hop");
    }
  }
  avatar.addEventListener("click", cycleRole);
  document.querySelectorAll("[data-cycle-role]").forEach(function (b) { b.addEventListener("click", cycleRole); });

  /* ---------- Header and navigation ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = document.querySelector(".menu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  menuBtn.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  var navLinks = document.querySelectorAll("[data-nav]");
  if ("IntersectionObserver" in window) {
    var band = { rootMargin: "-45% 0px -50% 0px" };
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.dataset.nav === id); });
      });
    }, band);
    document.querySelectorAll("[data-section]").forEach(function (s) { secIO.observe(s); });
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) navLinks.forEach(function (a) { a.classList.remove("is-active"); });
    }, band).observe(document.querySelector(".hero"));

    if (!reduce) {
      var items = document.querySelectorAll(".sec-head, .film, .more-link, .dev__head, .dev__list li, .research__copy, .collab, .writing, .about__photo, .about__copy, .glance, .strip, .tile, .contact > *");
      items.forEach(function (el) { el.classList.add("reveal"); });
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      items.forEach(function (el) { rio.observe(el); });
    }
  }

  /* ---------- Memories strip ---------- */
  var strip = document.querySelector(".strip");
  document.querySelectorAll("[data-strip]").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = strip.querySelector(".snap");
      var step = card ? card.getBoundingClientRect().width + 20 : 280;
      strip.scrollBy({ left: Number(b.dataset.strip) * step * 2, behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Li Guagua and Biga ---------- */
  document.querySelectorAll("[data-pet]").forEach(function (btn) {
    var name = btn.dataset.pet;
    var key = "peihang-universe-pets-" + name;
    var out = document.querySelector('[data-count="' + name + '"]');
    var pets = parseInt(store.get(key) || "0", 10) || 0;
    out.textContent = String(pets);
    btn.addEventListener("click", function () {
      pets += 1;
      out.textContent = String(pets);
      store.set(key, String(pets));
      if (reduce) return;
      var r = btn.getBoundingClientRect();
      for (var i = 0; i < 4; i += 1) {
        setTimeout(function () {
          var h = document.createElement("span");
          h.className = "heart-pop";
          h.textContent = "♥";
          h.style.left = (r.left + r.width / 2 + (Math.random() - 0.5) * 60) + "px";
          h.style.top = (r.top + r.height / 3) + "px";
          document.body.appendChild(h);
          setTimeout(function () { h.remove(); }, 950);
        }, i * 70);
      }
    });
  });

  /* ---------- Copy email ---------- */
  var copyStatus = document.querySelector(".copy-status");
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.dataset.copy;
      function done() {
        copyStatus.textContent = lang === "zh" ? "邮箱已复制。" : "Email copied.";
        setTimeout(function () { copyStatus.textContent = ""; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = "mailto:" + text; });
      } else {
        window.location.href = "mailto:" + text;
      }
    });
  });

  setLang(lang);
})();
