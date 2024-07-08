// ⭐ Field validations ⭐
$(document).ready(function() {
    var $form = $("#subForm");
    var $inputFields = $form.find("input:not([type='hidden']), select, textarea");
    var $tempButton = $form.find("[temp-button]");
    var $submitButton = $form.find("[sub-button]");

    // Add classes to input, select, label, and parent elements
    $inputFields.each(function() {
        var $field = $(this);
        if ($field.attr("type") !== "checkbox") {
            $field.addClass("input");
        }
        var $label = $field.siblings("label");
        $label.addClass(
            $field.attr("type") === "checkbox" ? "checkbox-label" : "input-label"
        );
        var $parent = $field.parent();
        // Add input-wrap class only if the parent doesn't have the hide class
        if (!$parent.hasClass("hide") && $field.attr("type") !== "checkbox") {
            $parent.addClass("input-wrap");
        }
    });

    // Disable default form validation
    $form.attr("novalidate", "novalidate");

    // Click event for temporary button
    $tempButton.on("click", function(e) {
        e.preventDefault();
        if (validateAllFields()) {
            $submitButton.click(); // Trigger the actual submit button click
        }
    });

    // Real-time validation on input change
    $inputFields.on("input change", function() {
        validateField($(this));
    });

    function validateAllFields() {
        var isValid = true;
        var $firstInvalidField = null;

        $inputFields.each(function() {
            if ($(this).prop("required") && !validateField($(this))) {
                isValid = false;
                if (!$firstInvalidField) {
                    $firstInvalidField = $(this);
                }
            }
        });

        if (!isValid && $firstInvalidField) {
            $firstInvalidField.focus();
        }

        return isValid;
    }

    function validateField($field) {
        var $errorMessage = $field.siblings(".error-message");
        var fieldValue = $field.val();

        if ($field.attr("type") === "checkbox") {
            if (!$field.prop("checked")) {
                $field.addClass("error");
                $errorMessage
                    .text("This checkbox is required.")
                    .css("display", "block");
                return false;
            } else {
                $field.removeClass("error");
                $errorMessage.css("display", "none");
                return true;
            }
        }

        // Check if the field is empty or has an empty value selected
        if (fieldValue === "" || fieldValue === null) {
            $field.addClass("error");
            $errorMessage.text("This field is required.").css("display", "block");
            return false;
        }
        // Check if the field is an email field
        else if ($field.attr("type") === "email") {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fieldValue)) {
                $field.addClass("error");
                $errorMessage
                    .text("Enter a valid email. Ex: name@website.com")
                    .css("display", "block");
                return false;
            }
        }

        $field.removeClass("error");
        $errorMessage.css("display", "none");
        return true;
    }

    // Add error message paragraphs after required fields
    $inputFields.filter("[required]").each(function() {
        var $field = $(this);
        if (!$field.siblings(".error-message").length) {
            var $errorMessage = $(
                '<p class="error-message" style="display: none;">This field is required.</p>'
            );
            $field.after($errorMessage);
        }
    });
    
    // ⭐ Update country dropdown ⭐
        var $countrySelect = $('[aria-label="Country"]');
    var primaryCountryNames = [
        "Australia",
        "Canada",
        "United Kingdom",
        "United States",
        "New Zealand"
    ];

    // Store all existing options
    var $allOptions = $countrySelect.find('option');

    // Find and separate primary country options
    var $primaryOptions = $allOptions.filter(function() {
        return primaryCountryNames.includes($(this).text());
    });

    // Remove primary options from $allOptions
    $allOptions = $allOptions.not($primaryOptions);

    // Clear the select
    $countrySelect.empty();

    // Add the "Select..." option
    $countrySelect.append('<option disabled selected value="">Select...</option>');

    // Add primary countries
    $countrySelect.append($primaryOptions);

    // Add divider
    $countrySelect.append('<option disabled>-----</option>');

    // Sort remaining options alphabetically
    var $sortedOptions = $allOptions.not(':first').sort(function(a, b) {
        return $(a).text().localeCompare($(b).text());
    });

    // Add all other countries
    $countrySelect.append($sortedOptions);
});
