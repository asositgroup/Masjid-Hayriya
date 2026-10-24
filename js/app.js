// Resolve from this shared script so /, /a/ and /b/ use the same thank-you page.
const registrationThankYouUrl = new URL("../thankYou.html", document.currentScript.src).href;

document.addEventListener("DOMContentLoaded", function () {
  const e = document.querySelectorAll(".registerBtn"),
    t = document.getElementById("registrationModal"),
    n = document.getElementById("closeModalBtn"),
    o = document.querySelector(".homeModalOverlay"),
    d = document.getElementById("registrationForm"),
    l = document.getElementById("name"),
    a = document.getElementById("nameError"),
    c = document.getElementById("phone"),
    i = document.getElementById("phoneError"),
    u = document.getElementById("surname"),
    w = document.getElementById("surnameError"),
    r = document.getElementById("submitBtn");

  const E = window.phoneFormatter;

  let p = !1,
    g = 0,
    lastOpener = null;
  const main = document.querySelector("main");
  const storageError = document.getElementById("storageError");

  function f(event) {
    lastOpener = event.currentTarget;
    t &&
      ((p = !0),
      (g = window.scrollY),
      (t.style.display = "block"),
      (document.body.style.overflow = "hidden"),
      (a.style.display = "none"),
      w && (w.style.display = "none"),
      (i.style.display = "none"),
      (storageError.style.display = "none"));
    if (main) main.inert = true;
    l.focus();
  }

  function v() {
    t &&
      p &&
      ((p = !1),
      (t.style.display = "none"),
      (document.body.style.overflow = ""),
      (document.body.style.position = ""),
      (document.body.style.top = ""),
      window.scrollTo(0, g));
    if (main) main.inert = false;
    lastOpener?.focus({ preventScroll: true });
  }

  e.forEach((e) => e.addEventListener("click", f));
  n && n.addEventListener("click", v);
  o && o.addEventListener("click", v);
  document.addEventListener("keydown", function (event) {
    if (!p) return;
    if (event.key === "Escape") {
      event.preventDefault();
      document.getElementById("countryDropdown").style.display = "none";
      document.getElementById("selectedCountry").setAttribute("aria-expanded", "false");
      v();
    }
    if (event.key === "Tab") {
      const controls = Array.from(t.querySelectorAll("button, input")).filter(
        (control) => !control.disabled && control.getClientRects().length
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("pageshow", function () {
    r.textContent = "DAVOM ETISH";
    r.disabled = false;
  });

  d.addEventListener("submit", function (e) {
    e.preventDefault();
    if (r.disabled) return;
    storageError.style.display = "none";

    if (!E) {
      console.error("phoneFormatter is not initialized. Check formatter.js load order and p/g variables.");
      i.style.display = "block";
      return;
    }

    const t = l.value.trim(),
      n = c.value.trim(),
      b = u ? u.value.trim() : "";

    let o = !1;

    if (t) a.style.display = "none";
    else (a.style.display = "block"), (o = !0);

    // Familiya maydoni har dizaynda chizilmagan. Bor bo'lsa majburiy, yo'q
    // bo'lsa o'tkazib yuboriladi — aks holda usiz sahifalarda forma umuman
    // yuborilmay qolardi, xatosiz. Bu #timer bilan bir xil qoida.
    if (u) {
      if (b) w.style.display = "none";
      else (w.style.display = "block"), (o = !0);
    }

    if (E.validate(n)) i.style.display = "none";
    else (i.style.display = "block"), (o = !0);

    l.setAttribute("aria-invalid", String(!t));
    c.setAttribute("aria-invalid", String(!E.validate(n)));
    if (o) {
      (!t ? l : c).focus();
      return;
    }

    r.textContent = "YUBORILMOQDA...";
    r.disabled = !0;

    // Sana ataylab yuborilmaydi — uni relay Toshkent vaqtida o'zi qo'yadi.
    // Tashrifchining qurilma soati noto'g'ri yoki boshqa mintaqada bo'lishi
    // mumkin, va o'sha vaqt jadvalga o'sha holicha tushardi.
    const payload = {
      Ism: t,
      TelefonRaqam: E.getCurrentCode() + " " + n,
    };

    try {
      localStorage.setItem("masjidHayriyaLead", JSON.stringify(payload));
      window.location.href = registrationThankYouUrl;
    } catch (error) {
      storageError.style.display = "block";
      r.textContent = "DAVOM ETISH";
      r.disabled = false;
    }
  });
});
