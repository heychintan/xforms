$(document).ready(function () {
  // ⭐ Field validations ⭐
  const $f = $("#subForm"),
    $i = $f.find("input:not([type='hidden']), select, textarea"),
    $t = $f.find("[temp-button]"),
    $s = $f.find("[sub-button]");

  // Add classes to input, select, label, and parent elements
  $i.each(function () {
    const $e = $(this),
      $l = $e.siblings("label"),
      $p = $e.parent(),
      c = $e.attr("type") === "checkbox";
    if (!c) $e.addClass("input");
    $l.addClass(c ? "checkbox-label" : "input-label");
    if (!$p.hasClass("hide") && !c) $p.addClass("input-wrap");
  });

  // Disable default form validation
  $f.attr("novalidate", "novalidate");

  // Click event for temporary button
  $t.on("click", e => {
    e.preventDefault();
    if (valAll()) $s.click();
  });

  // Real-time validation on input change
  $i.on("input change", function () { valF($(this)); });

  // Validate all fields
  function valAll() {
    let v = true,
      $f;
    $i.each(function () {
      if ($(this).prop("required") && !valF($(this))) {
        v = false;
        if (!$f) $f = $(this);
      }
    });
    if (!v && $f) $f.focus();
    return v;
  }

  // Validate individual field
  function valF($e) {
    const $m = $e.siblings(".error-message"),
      v = $e.val(),
      c = $e.attr("type") === "checkbox";

    if (c) {
      if (!$e.prop("checked")) {
        $e.addClass("error");
        $m.text("This checkbox is required.").show();
        return false;
      } else {
        $e.removeClass("error");
        $m.hide();
        return true;
      }
    }

    if (v === "" || v === null) {
      $e.addClass("error");
      $m.text("This field is required.").show();
      return false;
    } else if ($e.attr("type") === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      $e.addClass("error");
      $m.text("Enter a valid email. Ex: name@website.com").show();
      return false;
    }

    $e.removeClass("error");
    $m.hide();
    return true;
  }

  // Add error message paragraphs after required fields
  $i.filter("[required]").each(function () {
    if (!$(this).siblings(".error-message").length) {
      $(this).after(
        '<p class="error-message" style="display:none;">This field is required.</p>');
    }
  });

  // ⭐ Update country dropdown ⭐
  function recC() {
    const s = document.querySelector('[aria-label="Country"]'),
      o = Array.from(s.options);

    // Ensure "Select..." option is at the top
    let t = o.find(o => o.text === "Select...") ||
      (t = new Option("Select...", "", 1, 1), t.disabled = 1, s.insertBefore(t, s.firstChild),
        t);

    // Define and move primary countries
    const p = ["Australia", "Canada", "New Zealand", "United Kingdom"],
      u = o.find(o => ["United States of America", "United States"].includes(o.text));
    u && p.push(u.text);
    const m = p.map(c => {
      const t = o.find(o => o.text === c);
      return t && (s.removeChild(t), t.cloneNode(1));
    }).filter(Boolean);

    // Sort and reinsert remaining options
    const r = Array.from(s.options).filter(o => o !== t).sort((a, b) => a.text.localeCompare(b
      .text));
    s.options.length = 1;
    m.forEach(o => s.add(o));

    // Add disabled divider
    s.add(Object.assign(new Option("──────────", ""), { disabled: 1 }));

    // Add remaining options
    r.forEach(o => s.add(o));
  }
  recC();
});
