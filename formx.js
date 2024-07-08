function reorganizeCountryDropdown() {
  const countrySelect = document.querySelector('[aria-label="Country"]');
  const options = Array.from(countrySelect.options);

  // Step 1: Ensure "Select..." option is at the top
  let selectOption = options.find(opt => opt.text === "Select...");
  if (!selectOption) {
    selectOption = new Option("Select...", "", true, true);
    selectOption.disabled = true;
    countrySelect.insertBefore(selectOption, countrySelect.firstChild);
  }

  // Step 2: Define and move primary countries
  const primaryCountries = ["Australia", "Canada", "New Zealand", "United Kingdom", "United States of America"];
  const primaryOptions = [];

  primaryCountries.forEach(country => {
    const option = options.find(opt => opt.text === country || (country === "United States of America" && opt.text === "United States"));
    if (option) {
      primaryOptions.push(option);
      countrySelect.removeChild(option);
    }
  });

  // Step 3: Remove primary countries from the main list to avoid duplicates
  options.forEach(option => {
    if (primaryOptions.includes(option)) {
      countrySelect.removeChild(option);
    }
  });

  // Reinsert primary countries after "Select..." option
  primaryOptions.reverse().forEach(option => {
    countrySelect.insertBefore(option, selectOption.nextSibling);
  });
}

// Call the function to reorganize the dropdown
reorganizeCountryDropdown();

// function getUSAOption() {
//   const $select = $('[aria-label="Country"]');
//   const usaOptions = ['United States of America', 'United States'];
  
//   for (const option of usaOptions) {
//     if ($select.find(`option:contains("${option}")`).length > 0) {
//       return option;
//     }
//   }
  
//   return 'United States'; // Default to 'United States' if neither option is found
// }

// function prioritizeCountries(usaOption) {
//   const $select = $('[aria-label="Country"]');
//   const priorityCountries = ['Australia', 'Canada', 'New Zealand', 'United Kingdom', usaOption];
  
//   // Store all options and remove them from the select
//   const $options = $select.find('option').remove();
  
//   // Create an object to store options by country name
//   const optionsByCountry = {};
//   $options.each(function() {
//     const $option = $(this);
//     const countryName = $option.text();
//     if ($option.val() && countryName !== 'Select...') {
//       optionsByCountry[countryName] = $option;
//     }
//   });
  
//   // Add the "Select..." option back
//   $select.append($options.filter('[value=""]'));
  
//   // Add priority countries
//   priorityCountries.forEach(country => {
//     if (optionsByCountry[country]) {
//       $select.append(optionsByCountry[country]);
//       delete optionsByCountry[country];
//     }
//   });
  
//   // Add divider
//   $select.append($('<option disabled>──────────</option>'));
  
//   // Add remaining countries
//   Object.values(optionsByCountry).forEach($option => {
//     $select.append($option);
//   });
// }

// // Usage
// $(document).ready(function() {
//   const usaOption = getUSAOption();
//   prioritizeCountries(usaOption);
// });
