/**
 * Birthday Gift for Aj — from Cj
 * --------------------------------
 * Easy customization:
 * 1. Photos     → index.html gallery + images/
 * 2. Song       → music section in index.html
 * 3. Text       → search CHANGE TEXT in index.html
 * 4. Colors     → CSS variables in style.css
 * 5. Password   → SECRET_PASSWORD below
 * 6. Letter     → #letter-source in index.html
 * 7. Open When  → notes in #open-when
 * 8. Bucket list→ #dates section
 */

(function () {
  "use strict";

  /* =========================================================
     CHANGE PASSWORD: the special word Aj must type to unlock
     (case-insensitive, spaces ignored at ends)
     ========================================================= */
  var SECRET_PASSWORD = "bossing";

  /* ---------- Helpers ---------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function normalizePassword(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /* ---------- Floating hearts & sparkles ---------- */
  function createParticles() {
    var container = $("#particles");
    if (!container) return;

    var hearts = ["💗", "💕", "♡", "💖"];
    var sparkles = ["✨", "✦", "⋆"];
    var count = window.innerWidth < 600 ? 14 : 22;

    for (var i = 0; i < count; i++) {
      var el = document.createElement("span");
      var isHeart = Math.random() > 0.4;
      el.className = "particle " + (isHeart ? "heart" : "sparkle");
      el.textContent = isHeart
        ? hearts[Math.floor(Math.random() * hearts.length)]
        : sparkles[Math.floor(Math.random() * sparkles.length)];
      el.style.left = Math.random() * 100 + "%";
      el.style.setProperty("--drift", Math.random() * 80 - 40 + "px");
      el.style.animationDuration = 10 + Math.random() * 14 + "s";
      el.style.animationDelay = Math.random() * 12 + "s";
      el.style.fontSize = 0.7 + Math.random() * 0.9 + "rem";
      container.appendChild(el);
    }
  }

  /* ---------- Password gate + open gift ---------- */
  function initLanding() {
    var landing = $("#landing");
    var main = $("#main-site");
    var btn = $("#open-gift-btn");
    var gate = $("#password-gate");
    var input = $("#gift-password");
    var unlockBtn = $("#unlock-btn");
    var errorEl = $("#password-error");
    if (!landing || !main || !btn) return;

    function unlock() {
      if (!gate || !input) {
        btn.hidden = false;
        return;
      }
      var ok = normalizePassword(input.value) === normalizePassword(SECRET_PASSWORD);
      if (!ok) {
        if (errorEl) errorEl.hidden = false;
        input.classList.add("is-wrong");
        input.focus();
        input.select();
        return;
      }
      if (errorEl) errorEl.hidden = true;
      gate.classList.add("is-unlocked");
      btn.hidden = false;
      btn.focus();
      spawnConfetti(document.body, 16);
    }

    if (unlockBtn) unlockBtn.addEventListener("click", unlock);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          unlock();
        }
      });
      input.addEventListener("input", function () {
        if (errorEl) errorEl.hidden = true;
      });
    }

    btn.addEventListener("click", function () {
      landing.classList.add("is-leaving");
      setTimeout(function () {
        landing.hidden = true;
        main.hidden = false;
        document.body.style.overflow = "";
        spawnConfetti(document.body, 28);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 650);
    });
  }

  /* ---------- Blow out candles ---------- */
  function initBlowCake() {
    var btn = $("#blow-cake");
    var cake = $("#birthday-cake");
    var hint = $("#blow-hint");
    var done = $("#blow-done");
    var confettiHost = $("#birthday-confetti");
    if (!btn || !cake) return;

    btn.addEventListener("click", function () {
      if (cake.classList.contains("is-blown")) return;
      cake.classList.add("is-blown");
      btn.setAttribute("aria-label", "Candles blown out");
      if (hint) hint.hidden = true;
      if (done) done.hidden = false;
      spawnConfetti(confettiHost || btn.parentElement, 36);
    });
  }

  /* ---------- Birthday wishes flip cards ---------- */
  function initWishes() {
    $$(".wish-card").forEach(function (card) {
      card.addEventListener("click", function () {
        card.classList.toggle("is-flipped");
      });
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var toggle = $("#nav-toggle");
    var menu = $("#nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    var sections = $$("main section[id]");
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            $$(".nav-menu a").forEach(function (a) {
              var href = a.getAttribute("href") || "";
              a.classList.toggle("is-active", href === "#" + id);
            });
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }
  }

  /* ---------- Love letter + typewriter ---------- */
  function initLetter() {
    var envelope = $("#open-letter-btn");
    var card = $("#letter-card");
    var paper = $("#letter-paper");
    var source = $("#letter-source");
    var skipBtn = $("#skip-typewriter");
    if (!envelope || !card || !paper || !source) return;

    var typing = false;
    var typedOnce = false;
    var cancelType = null;

    function finishLetter(full) {
      typing = false;
      if (skipBtn) skipBtn.hidden = true;
      var cursor = $(".type-cursor", paper);
      if (cursor) cursor.classList.add("is-done");
      paper.classList.remove("is-typing");
      if (full) {
        paper.innerHTML = "";
        Array.prototype.forEach.call(source.children, function (child) {
          paper.appendChild(child.cloneNode(true));
        });
      }
    }

    function typeLetter() {
      if (typedOnce) {
        finishLetter(true);
        return;
      }

      typing = true;
      typedOnce = true;
      paper.innerHTML = "";
      paper.classList.add("is-typing");
      if (skipBtn) skipBtn.hidden = false;

      var paragraphs = Array.prototype.map.call(source.children, function (el) {
        return {
          className: el.className || "",
          text: el.textContent || "",
        };
      });

      var pIndex = 0;
      var charIndex = 0;
      var currentP = null;
      var cursor = document.createElement("span");
      cursor.className = "type-cursor";
      var cancelled = false;

      cancelType = function () {
        cancelled = true;
        finishLetter(true);
      };

      function tick() {
        if (cancelled) return;

        if (pIndex >= paragraphs.length) {
          finishLetter(false);
          if (!paper.contains(cursor)) paper.appendChild(cursor);
          cursor.classList.add("is-done");
          return;
        }

        if (!currentP) {
          currentP = document.createElement("p");
          if (paragraphs[pIndex].className) {
            currentP.className = paragraphs[pIndex].className;
          }
          paper.appendChild(currentP);
          charIndex = 0;
        }

        var text = paragraphs[pIndex].text;
        if (charIndex < text.length) {
          currentP.textContent = text.slice(0, charIndex + 1);
          charIndex += 1;
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          currentP.appendChild(cursor);
          var delay = text[charIndex - 1] === " " ? 18 : 28;
          setTimeout(tick, delay);
        } else {
          pIndex += 1;
          currentP = null;
          setTimeout(tick, 220);
        }
      }

      tick();
    }

    envelope.addEventListener("click", function () {
      var isOpen = envelope.classList.contains("is-open");
      if (isOpen) {
        if (typing && cancelType) cancelType();
        envelope.classList.remove("is-open");
        envelope.setAttribute("aria-expanded", "false");
        card.hidden = true;
        return;
      }
      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      setTimeout(function () {
        card.hidden = false;
        typeLetter();
      }, 350);
    });

    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        if (cancelType) cancelType();
      });
    }
  }

  /* ---------- Gallery lightbox ---------- */
  function initGallery() {
    var lightbox = $("#lightbox");
    var lbImg = $("#lightbox-img");
    var lbCap = $("#lightbox-caption");
    var closeBtn = $("#lightbox-close");
    if (!lightbox || !lbImg) return;

    function openLightbox(src, caption, alt) {
      lbImg.src = src;
      lbImg.alt = alt || caption || "Memory photo";
      if (lbCap) lbCap.textContent = caption || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.hidden = true;
      lbImg.src = "";
      document.body.style.overflow = "";
    }

    $$(".polaroid").forEach(function (fig) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");

      function openFromFig() {
        var img = $("img", fig);
        if (!img) return;
        var caption =
          fig.getAttribute("data-caption") ||
          ($("figcaption", fig) || {}).textContent ||
          "";
        openLightbox(img.currentSrc || img.src, caption, img.alt);
      }

      fig.addEventListener("click", openFromFig);
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFromFig();
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- Open when notes ---------- */
  function initOpenWhen() {
    $$(".note-card").forEach(function (card) {
      var seal = $(".note-seal", card);
      var body = $(".note-body", card);
      if (!seal || !body) return;

      seal.addEventListener("click", function () {
        var open = card.classList.toggle("is-open");
        body.hidden = !open;
        seal.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------- Future dates bucket list ---------- */
  function initBucketList() {
    var list = $("#bucket-list");
    var countEl = $("#bucket-count");
    var totalEl = $("#bucket-total");
    if (!list) return;

    var boxes = $$('input[type="checkbox"]', list);
    if (totalEl) totalEl.textContent = String(boxes.length);

    var storageKey = "aj-cj-bucket-list";

    function updateCount() {
      var done = boxes.filter(function (b) {
        return b.checked;
      }).length;
      if (countEl) countEl.textContent = String(done);
    }

    function save() {
      var state = boxes.map(function (b) {
        return b.checked;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {
        /* ignore */
      }
    }

    function load() {
      try {
        var raw = localStorage.getItem(storageKey);
        if (!raw) return;
        var state = JSON.parse(raw);
        if (!Array.isArray(state)) return;
        boxes.forEach(function (b, i) {
          if (typeof state[i] === "boolean") b.checked = state[i];
        });
      } catch (e) {
        /* ignore */
      }
    }

    load();
    updateCount();

    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        updateCount();
        save();
      });
    });
  }

  /* ---------- Reasons I love you ---------- */
  function initReasons() {
    $$(".reason-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var reveal = $(".reason-reveal", card);
        var message = card.getAttribute("data-message") || "";
        var wasOpen = card.classList.contains("is-open");

        $$(".reason-card.is-open").forEach(function (other) {
          if (other !== card) {
            other.classList.remove("is-open");
            var r = $(".reason-reveal", other);
            if (r) r.textContent = "";
          }
        });

        if (wasOpen) {
          card.classList.remove("is-open");
          if (reveal) reveal.textContent = "";
        } else {
          card.classList.add("is-open");
          if (reveal) reveal.textContent = message;
        }
      });
    });
  }

  /* ---------- Music player ---------- */
  function initMusic() {
    var audio = $("#audio");
    var playBtn = $("#play-pause");
    var progress = $("#progress");
    var volume = $("#volume");
    var currentTimeEl = $("#current-time");
    var durationEl = $("#duration");
    var vinyl = $("#vinyl");
    var note = $(".music-note");
    if (!audio || !playBtn) return;

    var iconPlay = $(".icon-play", playBtn);
    var iconPause = $(".icon-pause", playBtn);

    function setPlaying(playing) {
      playBtn.classList.toggle("is-playing", playing);
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      if (iconPlay) iconPlay.hidden = playing;
      if (iconPause) iconPause.hidden = !playing;
      if (vinyl) vinyl.classList.toggle("is-spinning", playing);
    }

    playBtn.addEventListener("click", function () {
      if (audio.paused) {
        var playPromise = audio.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            if (note) {
              note.textContent = "Couldn’t play the song — check the file path in index.html.";
            }
          });
        }
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", function () {
      setPlaying(true);
    });
    audio.addEventListener("pause", function () {
      setPlaying(false);
    });
    audio.addEventListener("ended", function () {
      setPlaying(false);
      if (progress) progress.value = 0;
      if (currentTimeEl) currentTimeEl.textContent = "0:00";
    });
    audio.addEventListener("loadedmetadata", function () {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", function () {
      if (progress && audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
      }
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    if (progress) {
      progress.addEventListener("input", function () {
        if (!audio.duration) return;
        audio.currentTime = (progress.value / 100) * audio.duration;
      });
    }

    if (volume) {
      audio.volume = parseFloat(volume.value) || 0.8;
      volume.addEventListener("input", function () {
        audio.volume = parseFloat(volume.value);
      });
    }
  }

  /* ---------- Surprise ---------- */
  function initSurprise() {
    var btn = $("#surprise-btn");
    var message = $("#surprise-message");
    var layer = $("#surprise-confetti");
    if (!btn || !message) return;

    btn.addEventListener("click", function () {
      message.hidden = false;
      btn.disabled = true;
      btn.textContent = "For you 💗";
      spawnConfetti(layer || btn.parentElement, 40);
    });
  }

  /* ---------- Confetti / hearts burst ---------- */
  function spawnConfetti(container, amount) {
    if (!container) return;
    var colors = ["#f7a8c4", "#e88bab", "#b8d4e8", "#ffd6e5", "#fff", "#fce4ec"];
    var hearts = ["💗", "💕", "💖", "✨"];
    var parent = container === document.body ? document.body : container;

    if (container !== document.body && getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }

    for (var i = 0; i < amount; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      var useEmoji = Math.random() > 0.55;
      if (useEmoji) {
        piece.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        piece.style.background = "transparent";
        piece.style.fontSize = 12 + Math.random() * 14 + "px";
        piece.style.width = "auto";
        piece.style.height = "auto";
      } else {
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      }
      piece.style.left = Math.random() * 100 + "%";
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";

      if (container === document.body) {
        piece.style.position = "fixed";
        piece.style.zIndex = "9999";
        piece.style.top = "20%";
        piece.style.left = Math.random() * 100 + "vw";
      }

      parent.appendChild(piece);
      (function (el) {
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 3200);
      })(piece);
    }
  }

  /* ---------- Footer year ---------- */
  function initFooter() {
    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    createParticles();
    initLanding();
    initBlowCake();
    initWishes();
    initNav();
    initLetter();
    initGallery();
    initOpenWhen();
    initBucketList();
    initReasons();
    initMusic();
    initSurprise();
    initFooter();
  });
})();
