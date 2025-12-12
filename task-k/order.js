/*
author: Eetu Liukkonen
date: 2025-12-12
*/

// Scroll progress indicator
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// Set minimum dates
const today = new Date().toISOString().split('T')[0];
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

startDateInput.setAttribute('min', today);
endDateInput.setAttribute('min', today);

// Update end date minimum when start date changes
startDateInput.addEventListener('change', () => {
    endDateInput.setAttribute('min', startDateInput.value);
    
    // If end date is before start date, reset it
    if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = '';
    }
});

// Form validation enhancements
const form = document.querySelector('.order-form');

form.addEventListener('submit', (e) => {
    const termsCheckbox = document.getElementById('terms');
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Check terms
    if (!termsCheckbox.checked) {
        e.preventDefault();
        alert('Sinun täytyy hyväksyä vuokrausehdot jatkaaksesi.');
        termsCheckbox.focus();
        return;
    }
    
    // Check date order
    if (startDate && endDate && endDate < startDate) {
        e.preventDefault();
        alert('Lopetuspäivä ei voi olla ennen aloituspäivää.');
        endDateInput.focus();
        return;
    }
});

// Visual feedback for valid inputs
const inputs = form.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.validity.valid && input.value) {
            input.style.borderColor = 'rgba(80, 150, 80, 0.6)';
        } else if (!input.validity.valid && input.value) {
            input.style.borderColor = 'rgba(180, 50, 50, 0.6)';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = 'rgba(139, 90, 43, 0.8)';
    });
});

// Smooth reveal animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe form elements for animation
document.querySelectorAll('fieldset').forEach((fieldset, index) => {
    fieldset.style.opacity = '0';
    fieldset.style.transform = 'translateY(20px)';
    fieldset.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(fieldset);
});