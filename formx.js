function prioritizeCountries() {
  const $select = $('[aria-label="Country"]');
  const priorityCountries = ['Australia', 'Canada', 'New Zealand', 'United Kingdom', 'United States'];
  
  // Store all options and remove them from the select
  const $options = $select.find('option').remove();
  
  // Add the "Select..." option back
  const $selectOption = $options.filter('[value=""]');
  $select.append($selectOption);
  
  // Add priority countries
  priorityCountries.forEach(country => {
    const $option = $options.filter(function() {
      return $(this).text() === country;
    });
    if ($option.length) {
      $select.append($option);
    }
  });
  
  // Add divider
  $select.append($('<option disabled>──────────</option>'));
  
  // Add remaining countries
  $options.each(function() {
    const $option = $(this);
    if ($option.val() && !priorityCountries.includes($option.text()) && $option.text() !== 'Select...') {
      $select.append($option);
    }
  });
}

// Usage
$(document).ready(function() {
  prioritizeCountries();
});
