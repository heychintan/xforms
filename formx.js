function prioritizeCountries() {
  const $select = $('[aria-label="Country"]');
  const priorityCountries = ['Australia', 'Canada', 'New Zealand', 'United Kingdom', 'United States'];
  const usaOptions = ['United States of America', 'United States'];

  // Store all options and remove them from the select
  const $options = $select.find('option').remove();

  // Create an object to store options by country name
  const optionsByCountry = {};
  $options.each(function() {
    const $option = $(this);
    const countryName = $option.text();
    if ($option.val() && countryName !== 'Select...') {
      optionsByCountry[countryName] = $option;
    }
  });

  // Check which USA option is present
  const usaOption = usaOptions.find(option => optionsByCountry[option]);
  if (usaOption) {
    priorityCountries[priorityCountries.indexOf('United States')] = usaOption;
  }

  // Add the "Select..." option back
  $select.append($options.filter('[value=""]'));

  // Add priority countries
  priorityCountries.forEach(country => {
    if (optionsByCountry[country]) {
      $select.append(optionsByCountry[country]);
      delete optionsByCountry[country];
    }
  });

  // Add divider
  $select.append($('<option disabled>──────────</option>'));

  // Add remaining countries
  Object.values(optionsByCountry).forEach($option => {
    $select.append($option);
  });
}

// Usage
$(document).ready(prioritizeCountries);
