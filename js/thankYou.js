// This project uses the Apps Script deployment supplied by the site owner.
(() => {
  "use strict";

  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbygXy_z4adeOjdre4JszU7aLdhgG1Kp3pfvG_mjOmmyAZscdMlKm4tZSlX2SZ3ehLA/exec";
  const STORAGE_KEY = "masjidHayriyaLead";
  const telegramButton = document.querySelector(".thankYouBtn");
  const status = document.getElementById("submissionStatus");
  const errorMessage = document.getElementById("errorMessage");
  const retryButton = document.getElementById("retryBtn");
  let inFlight = false;

  function allowTelegram(allowed) {
    telegramButton.setAttribute("aria-disabled", String(!allowed));
    if (allowed) {
      telegramButton.href = telegramButton.dataset.telegramUrl;
      telegramButton.removeAttribute("tabindex");
    } else {
      telegramButton.removeAttribute("href");
      telegramButton.setAttribute("tabindex", "-1");
    }
  }

  telegramButton.addEventListener("click", (event) => {
    if (telegramButton.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
    }
  });

  async function sendFormData() {
    if (inFlight) return;
    inFlight = true;
    allowTelegram(false);
    errorMessage.hidden = true;
    retryButton.hidden = true;
    retryButton.disabled = true;
    status.textContent = "Maʼlumot yuborilmoqda…";
    let timeout;

    try {
      const rawLead = localStorage.getItem(STORAGE_KEY);
      if (!rawLead) {
        status.textContent = "Telegram kanalga oʻtishingiz mumkin.";
        allowTelegram(true);
        return;
      }

      const lead = JSON.parse(rawLead);
      if (!lead || typeof lead.Ism !== "string" || !lead.Ism.trim() ||
          typeof lead.TelefonRaqam !== "string" || !lead.TelefonRaqam.trim()) {
        throw new Error("INVALID_LOCAL_LEAD");
      }

      const controller = new AbortController();
      timeout = window.setTimeout(() => controller.abort(), 20000);
      const response = await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body: new URLSearchParams({
          sheetName: "Lead",
          Ism: lead.Ism.trim(),
          "Telefon raqam": lead.TelefonRaqam.trim(),
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const result = await response.json();
      if (result.ok !== true) throw new Error(result.code || "LEAD_REJECTED");

      // Do not remove a different lead written by another tab while this POST ran.
      if (localStorage.getItem(STORAGE_KEY) === rawLead) {
        localStorage.removeItem(STORAGE_KEY);
      }
      status.textContent = "Maʼlumot qabul qilindi. Telegram kanalga oʻting.";
      allowTelegram(true);
    } catch (error) {
      status.textContent = "Maʼlumot yuborilmadi.";
      errorMessage.textContent = error.name === "AbortError"
        ? "Javob kutilganidan uzoqroq vaqt oldi. Internetni tekshirib, qayta yuboring."
        : "Maʼlumotni yuborib boʻlmadi. Internetni tekshirib, «Qayta yuborish» tugmasini bosing.";
      errorMessage.hidden = false;
      retryButton.hidden = false;
    } finally {
      window.clearTimeout(timeout);
      inFlight = false;
      retryButton.disabled = false;
    }
  }

  retryButton.addEventListener("click", sendFormData);
  sendFormData();
})();
