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
});
