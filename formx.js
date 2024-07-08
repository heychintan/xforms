function prioritizeCountries() {
  const $select = $('[aria-label="Country"]');
  const $options = $select.find('option');
  
  // Determine which version of United States is present
  let usOption = 'United States';
  if ($options.filter((_, el) => el.text === 'United States of America').length > 0) {
    usOption = 'United States of America';
  }
  
  const priorityCountries = ['Australia', 'Canada', 'New Zealand', 'United Kingdom', usOption];
  
  // Remove all options from the select
  $options.remove();
  
  // Add the "Select..." option back
  const $selectOption = $options.filter('[value=""]');
  $select.append($selectOption);
  
  // Add priority countries
  priorityCountries.forEach(country => {
    const $option = $options.filter((_, el) => el.text === country);
    if ($option.length) {
      $select.append($option);
    }
  });
  
  // Add divider
  $select.append($('<option disabled>──────────</option>'));
  
  // Add remaining countries
  $options.each(function() {
    const $option = $(this);
    const optionText = $option.text();
    if ($option.val() && !priorityCountries.includes(optionText) && optionText !== 'Select...') {
      $select.append($option);
    }
  });
}

// Usage
$(document).ready(function() {
  prioritizeCountries();
});
