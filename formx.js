document.addEventListener('DOMContentLoaded', () => {
    // Country normalization function
    function normalizeCountry(country) {
        const countryMap = {
            'USA': 'United States',
            'US': 'United States',
            'United States of America': 'United States',
            // Add more mappings as needed
        };
        return countryMap[country.trim()] || country.trim();
    }

    // ⭐ Field validations ⭐
    const form = document.getElementById('subForm');
    const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const tempButton = form.querySelector('[temp-button]');
    const subButton = form.querySelector('[sub-button]');

    // Add classes to input, select, label, and parent elements
    inputs.forEach(input => {
        const label = input.parentElement.querySelector('label');
        const parent = input.parentElement;
        const isCheckbox = input.type === 'checkbox';

        if (!isCheckbox) input.classList.add('input');
        label.classList.add(isCheckbox ? 'checkbox-label' : 'input-label');
        if (!parent.classList.contains('hide') && !isCheckbox) {
            parent.classList.add('input-wrap');
        }
    });

    // Disable default form validation
    form.setAttribute('novalidate', 'novalidate');

    // Click event for temporary button
    tempButton.addEventListener('click', e => {
        e.preventDefault();
        if (validateAll()) subButton.click();
    });

    // Real-time validation on input change
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('change', () => validateField(input));
    });

    // ⭐ Input field validation ⭐
    function validateField(input) {
        const errorMessage = input.nextElementSibling;
        let value = input.value.trim();
        const isCheckbox = input.type === 'checkbox';

        if (isCheckbox) {
            if (!input.checked) {
                input.classList.add('error');
                errorMessage.textContent = 'This checkbox is required.';
                errorMessage.style.display = 'block';
                return false;
            } else {
                input.classList.remove('error');
                errorMessage.style.display = 'none';
                return true;
            }
        }

        if (input.type === 'email') {
            if (value === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                input.classList.add('error');
                errorMessage.textContent = 'Enter a valid email. Ex: name@website.com';
                errorMessage.style.display = 'block';
                return false;
            }
        } else if (input.getAttribute('aria-label') === 'Country') {
            value = normalizeCountry(value);
            input.value = value; // Update the input value with the normalized country name
        } else if (value === '') {
            input.classList.add('error');
            errorMessage.textContent = 'This field is required.';
            errorMessage.style.display = 'block';
            return false;
        }

        input.classList.remove('error');
        errorMessage.style.display = 'none';
        return true;
    }

    // Add error message paragraphs after required fields
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.nextElementSibling?.classList.contains('error-message')) {
            const errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            errorMessage.style.display = 'none';
            errorMessage.textContent = 'This field is required.';
            input.insertAdjacentElement('afterend', errorMessage);
        }
    });

    // ⭐ Country dropdown modifications ⭐
    function reorganizeCountries() {
        const select = document.querySelector('[aria-label="Country"]');
        if (!select) return;

        const options = Array.from(select.options);

        // Ensure "Select..." option is at the top
        let selectOption = options.find(o => o.text === "Select...") ||
            new Option("Select...", "", true, true);
        selectOption.disabled = true;

        // Define primary countries
        const primaryCountries = ["Australia", "Canada", "New Zealand", "United Kingdom", "United States of America"];

        // Sort options
        const primaryOptions = primaryCountries.map(country =>
            options.find(o => o.text === country)
        ).filter(Boolean);

        const remainingOptions = options
            .filter(o => o !== selectOption && !primaryOptions.includes(o))
            .sort((a, b) => a.text.localeCompare(b.text));

        // Clear and repopulate select
        select.innerHTML = '';
        select.appendChild(selectOption);
        primaryOptions.forEach(o => select.appendChild(o.cloneNode(true)));

        const divider = new Option("──────────", "");
        divider.disabled = true;
        select.appendChild(divider);

        remainingOptions.forEach(o => select.appendChild(o.cloneNode(true)));
    }

    reorganizeCountries();

    // Function to validate all fields
    function validateAll() {
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }
});
