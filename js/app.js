(function () {
  "use strict";

  var WA_NUMBER = "447745596993";

  var account = {
    name: "UNILINX LIMITED",
    sortCode: "23-11-85",
    accountNumber: "13337904",
    reference: "shipping"
  };

  var locations = [
    "Latrikunda Sabaji",
    "Bundung Boutique Yassin",
    "Brikama",
    "Serekunda Westfield"
  ];

  var amountInput = document.getElementById("amount");
  var errorEl = document.getElementById("error");
  var rateValEl = document.getElementById("rateVal");
  var bandValEl = document.getElementById("bandVal");
  var gmdValEl = document.getElementById("gmdVal");
  var locationsEl = document.getElementById("locations");
  var receiverNameEl = document.getElementById("receiverName");
  var receiverPhoneEl = document.getElementById("receiverPhone");
  var waBtn = document.getElementById("waBtn");
  var paidBtn = document.getElementById("paidBtn");
  var copyBtn = document.getElementById("copyBtn");
  var reqIdVal = document.getElementById("reqIdVal");
  var toastEl = document.getElementById("toast");
  var ctaHintEl = document.getElementById("ctaHint");

  var state = {
    pickup: null,
    requestId: makeRequestId()
  };

  var gbp = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
  var gmd = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

  function makeRequestId() {
    var n = Math.floor(1000 + Math.random() * 9000);
    return "BR-" + n;
  }

  function rateFor(amount) {
    if (amount <= 1000) return { rate: 94, band: "£1 – £1,000" };
    if (amount <= 5000) return { rate: 95, band: "£1,000 – £5,000" };
    if (amount <= 10000) return { rate: 96, band: "£5,000 – £10,000" };
    return { rate: 97, band: "£10,000 – £100,000" };
  }

  function renderLocations() {
    locationsEl.innerHTML = "";
    locations.forEach(function (name) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "loc-tile";
      tile.setAttribute("aria-pressed", "false");
      tile.dataset.name = name;

      var dot = document.createElement("span");
      dot.className = "dot";
      tile.appendChild(dot);

      var label = document.createElement("span");
      label.textContent = name;
      tile.appendChild(label);

      tile.addEventListener("click", function () {
        state.pickup = name;
        Array.prototype.forEach.call(
          locationsEl.querySelectorAll(".loc-tile"),
          function (t) {
            var isSelected = t === tile;
            t.classList.toggle("selected", isSelected);
            t.setAttribute("aria-pressed", isSelected ? "true" : "false");
          }
        );
        validate();
      });

      locationsEl.appendChild(tile);
    });
  }

  function updateRate() {
    var raw = parseFloat(amountInput.value);
    var valid = updateAmountValidity();

    if (!amountInput.value) {
      errorEl.textContent = "";
    } else if (!valid) {
      errorEl.textContent = "Enter an amount between £1 and £100,000.";
    } else {
      errorEl.textContent = "";
    }

    var amount = valid ? raw : 0;
    var info = rateFor(amount || 1);
    var total = Math.round(amount * info.rate);

    rateValEl.textContent = info.rate + " GMD";
    bandValEl.textContent = info.band;
    gmdValEl.textContent = "D" + gmd.format(total);

    validate();
    return valid;
  }

  function validate() {
    var amountValid = updateAmountValidity();
    var nameValid = receiverNameEl.value.trim().length > 1;
    var phoneValid = receiverPhoneEl.value.trim().length > 6;
    var pickupValid = !!state.pickup;

    var allValid = amountValid && nameValid && phoneValid && pickupValid;
    waBtn.setAttribute("aria-disabled", allValid ? "false" : "true");
    if (allValid) {
      waBtn.href = buildWhatsAppLink();
      ctaHintEl.textContent = "";
    } else {
      waBtn.removeAttribute("href");
      ctaHintEl.textContent = "Fill in " + firstMissingField(amountValid, nameValid, phoneValid, pickupValid) + " to continue";
    }
    return allValid;
  }

  function firstMissingField(amountValid, nameValid, phoneValid, pickupValid) {
    if (!amountValid) return "a valid amount";
    if (!nameValid) return "the receiver's name";
    if (!phoneValid) return "the receiver's phone number";
    if (!pickupValid) return "a pickup point";
    return "";
  }

  function updateAmountValidity() {
    var raw = parseFloat(amountInput.value);
    return !isNaN(raw) && raw >= 1 && raw <= 100000;
  }

  function buildRequestMessage() {
    var raw = parseFloat(amountInput.value) || 0;
    var info = rateFor(raw);
    var total = Math.round(raw * info.rate);
    var name = receiverNameEl.value.trim();
    var phone = receiverPhoneEl.value.trim();

    var lines = [
      "Hello Best Rate, I'd like to send a local transfer.",
      "",
      "Request ID: " + state.requestId,
      "Amount: £" + gbp.format(raw),
      "Rate: " + info.rate + " GMD per £1",
      "Receiver gets: D" + gmd.format(total),
      "",
      "Receiver name: " + name,
      "Receiver phone: " + phone,
      "Pickup point: " + state.pickup,
      "",
      "I will pay by UK bank transfer to:",
      account.name,
      "Sort code " + account.sortCode,
      "Account " + account.accountNumber,
      "Reference: " + account.reference
    ];
    return lines.join("\n");
  }

  function buildWhatsAppLink() {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildRequestMessage());
  }

  function buildPaidMessage() {
    return [
      "Hi Best Rate, I've paid — here's my receipt.",
      "",
      "Request ID: " + state.requestId,
      "Amount: £" + gbp.format(parseFloat(amountInput.value) || 0),
      "Receiver name: " + receiverNameEl.value.trim(),
      "Pickup point: " + (state.pickup || "—")
    ].join("\n");
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.width = "1px";
    area.style.height = "1px";
    area.style.padding = "0";
    area.style.border = "none";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    var succeeded = false;
    try {
      succeeded = document.execCommand("copy");
    } catch (e) {
      succeeded = false;
    }
    document.body.removeChild(area);
    return succeeded;
  }

  function copyText(text) {
    // Try the synchronous, broadly-supported method first — it works
    // reliably across mobile browsers/webviews where the async
    // Clipboard API can silently stall or be denied.
    if (legacyCopy(text)) {
      return Promise.resolve();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error("copy unsupported"));
  }

  function copyAccountDetails() {
    var text = [
      account.name,
      "Sort code " + account.sortCode,
      "Account " + account.accountNumber,
      "Reference: " + account.reference
    ].join("\n");
    copyText(text).then(
      function () {
        showToast("Account details copied");
      },
      function () {
        showToast("Could not copy");
      }
    );
  }

  function selectValueText(btn) {
    var valueEl = btn.parentElement.querySelector("b");
    if (!valueEl || !window.getSelection) return;
    var range = document.createRange();
    range.selectNodeContents(valueEl);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function flashCopied(btn) {
    var row = btn.closest(".row");
    btn.classList.add("is-copied");
    if (row) row.classList.add("row-copied");
    window.clearTimeout(btn._copiedTimer);
    btn._copiedTimer = window.setTimeout(function () {
      btn.classList.remove("is-copied");
      if (row) row.classList.remove("row-copied");
    }, 1200);
  }

  function copyField(btn) {
    var text = btn.dataset.copy;
    var label = btn.dataset.label;

    copyText(text).then(
      function () {
        flashCopied(btn);
        showToast("Copied " + label);
      },
      function () {
        selectValueText(btn);
        showToast("Could not copy");
      }
    );
  }

  amountInput.addEventListener("input", updateRate);
  receiverNameEl.addEventListener("input", validate);
  receiverPhoneEl.addEventListener("input", validate);
  copyBtn.addEventListener("click", copyAccountDetails);

  Array.prototype.forEach.call(document.querySelectorAll(".field-copy"), function (btn) {
    btn.addEventListener("click", function () {
      copyField(btn);
    });
  });

  paidBtn.addEventListener("click", function () {
    var link = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(buildPaidMessage());
    window.open(link, "_blank");
  });

  reqIdVal.textContent = state.requestId;
  renderLocations();
  updateRate();
})();
