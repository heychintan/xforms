document.addEventListener('DOMContentLoaded', () => {
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
        const value = input.value.trim();
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
            new Option("Select...", "", false, false);
        selectOption.disabled = true;

        // Define primary countries
        const primaryCountries = ["Australia", "Canada", "New Zealand", "United Kingdom", "United States"];

        // Sort options
        const primaryOptions = primaryCountries.map(country =>
            options.find(o => o.text === country || o.text === "United States of America")
        ).filter(Boolean);

        // Convert "United States of America" to "United States"
        primaryOptions.forEach(option => {
            if (option.text === "United States of America") {
                option.text = "United States";
            }
        });

        const remainingOptions = options
            .filter(o => o !== selectOption && !primaryOptions.includes(o) && o.text !== "United States of America")
            .sort((a, b) => a.text.localeCompare(b.text));

        // Clear and repopulate select
        select.innerHTML = '';
        select.appendChild(selectOption);
        primaryOptions.forEach(o => select.appendChild(o.cloneNode(true)));

        const divider = new Option("──────────", "");
        divider.disabled = true;
        select.appendChild(divider);

        remainingOptions.forEach(o => select.appendChild(o.cloneNode(true)));

        // Set United States as default
        const usOption = select.querySelector('option[value="United States"]');
        if (usOption) {
            usOption.selected = true;
        }
    }

    reorganizeCountries();
});
