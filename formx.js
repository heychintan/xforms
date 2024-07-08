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
    let $option = $options.filter(function() {
      return $(this).text() === country;
    });
    
    // Special case for United States
    if (country === 'United States' && $option.length === 0) {
      $option = $options.filter(function() {
        return $(this).text() === 'United States of America';
      });
    }
    
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
    if ($option.val() && !priorityCountries.includes(optionText) && 
        optionText !== 'United States of America' && optionText !== 'Select...') {
      $select.append($option);
    }
  });
}

// Usage
$(document).ready(function() {
  prioritizeCountries();
});
