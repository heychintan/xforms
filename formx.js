function recCountries() {
  const sel = document.querySelector('[aria-label="Country"]');
  const opts = Array.from(sel.options);

  // Ensure "Select..." option is at the top
  let selOpt = opts.find(o => o.text === "Select...");
  if (!selOpt) {
    selOpt = new Option("Select...", "", true, true);
    selOpt.disabled = true;
    sel.insertBefore(selOpt, sel.firstChild);
  }

  // Define and move primary countries
  const primC = ["Australia", "Canada", "New Zealand", "United Kingdom"];
  const usOpt = opts.find(o => o.text === "United States of America" || o.text === "United States");
  if (usOpt) primC.push(usOpt.text);

  const primOpts = [];
  primC.forEach(c => {
    const opt = opts.find(o => o.text === c);
    if (opt) {
      primOpts.push(opt.cloneNode(true));
      sel.removeChild(opt);
    }
  });

  // Sort and reinsert remaining options
  const remC = Array.from(sel.options)
    .filter(o => o !== selOpt)
    .sort((a, b) => a.text.localeCompare(b.text));

  // Clear existing options (except "Select...")
  while (sel.options.length > 1) sel.remove(1);

  // Add primary options
  primOpts.forEach(o => sel.add(o));

  // Add disabled divider
  const div = new Option("──────────", "", false, false);
  div.disabled = true;
  sel.add(div);

  // Add remaining options
  remC.forEach(o => sel.add(o));
}

recCountries();
