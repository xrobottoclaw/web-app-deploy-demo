// Main JavaScript for FlaskApp
// Client-side form validation and UX enhancements

(function() {
    'use strict';

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initContactForm();
        initNavbar();
        initSmoothScroll();
        initTooltips();
    });

    /**
     * Contact form validation and UX
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear error on input
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            let isValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                e.stopPropagation();

                // Focus first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            } else if (submitBtn && btnText && btnLoading) {
                // Show loading state
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
                submitBtn.disabled = true;
            }

            form.classList.add('was-validated');
        });
    }

    /**
     * Validate a single field
     */
    function validateField(field) {
        const isValid = field.checkValidity();

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    /**
     * Navbar active state and mobile menu handling
     */
    function initNavbar() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Close mobile menu on link click
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.getComputedStyle(navbarCollapse).display !== 'none') {
                        bsCollapse.hide();
                    }
                });
            });
        }
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Update URL without page reload
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Initialize Bootstrap tooltips
     */
    function initTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    /**
     * Auto-dismiss flash messages after 5 seconds
     */
    function initFlashMessages() {
        const flashMessages = document.querySelectorAll('.flash-messages .alert');
        flashMessages.forEach(alert => {
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                if (bsAlert) {
                    bsAlert.close();
                }
            }, 5000);
        });
    }

    // Initialize flash messages if present
    initFlashMessages();

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Utility: Format date for display
     */
    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // Export utilities for potential use in other scripts
    window.FlaskApp = {
        debounce,
        formatDate,
        validateField
    };
})();