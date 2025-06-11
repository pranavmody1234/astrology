console.log('UNIQUE LOG: script.js from static-version loaded');

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('About to call generateCaptcha');
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Mobile navigation toggle
    const createMobileNav = () => {
        const nav = document.querySelector('.main-nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '☰';
        
        // Add click event to toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        // Add mobile menu button to nav
        nav.insertBefore(mobileMenuBtn, navLinks);
    };

    // Initialize mobile navigation if screen width is small
    if (window.innerWidth <= 768) {
        createMobileNav();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (window.innerWidth <= 768 && !mobileMenuBtn) {
            createMobileNav();
        } else if (window.innerWidth > 768 && mobileMenuBtn) {
            mobileMenuBtn.remove();
            document.querySelector('.nav-links').classList.remove('show');
        }
    });

    // Carousel functionality
    const carouselItems = document.querySelectorAll('.carousel-item');
    const paginationContainer = document.querySelector('.carousel-pagination');
    let currentSlide = 0;

    // Create pagination dots
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        paginationContainer.appendChild(dot);
    });

    function goToSlide(index) {
        carouselItems[currentSlide].classList.remove('active');
        document.querySelectorAll('.pagination-dot')[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        carouselItems[currentSlide].classList.add('active');
        document.querySelectorAll('.pagination-dot')[currentSlide].classList.add('active');
    }

    // Auto-advance carousel
    setInterval(() => {
        const nextSlide = (currentSlide + 1) % carouselItems.length;
        goToSlide(nextSlide);
    }, 5000);

    // Captcha logic
    let captcha = { num1: 0, num2: 0 };
    function generateCaptcha(retry = 0) {
        try {
            console.log('generateCaptcha called, retry:', retry);
            captcha.num1 = Math.floor(Math.random() * 10);
            captcha.num2 = Math.floor(Math.random() * 10);
            console.log('Captcha numbers:', captcha.num1, captcha.num2);
            const captchaQ = document.getElementById('captchaQuestion');
            console.log('captchaQ:', captchaQ);
            if (captchaQ) {
                captchaQ.textContent = `${captcha.num1} + ${captcha.num2} = ?`;
                console.log('Captcha set:', captchaQ.textContent);
            } else {
                console.warn('Captcha element not found! Retry:', retry);
                if (retry < 5) {
                    setTimeout(() => generateCaptcha(retry + 1), 200);
                }
            }
        } catch (err) {
            console.error('Error in generateCaptcha:', err);
        }
    }
    generateCaptcha(); // Ensure captcha is shown on page load

    // Thank you modal functionality
    const thankYouModal = document.getElementById('thankYouModal');
    function closeThankYouModal() {
        if (thankYouModal) thankYouModal.style.display = 'none';
    }
    if (thankYouModal) {
        const thankYouClose = thankYouModal.querySelector('.close-modal');
        const thankYouButton = thankYouModal.querySelector('.modal-button');
        if (thankYouClose) thankYouClose.addEventListener('click', closeThankYouModal);
        if (thankYouButton) thankYouButton.addEventListener('click', closeThankYouModal);
        window.addEventListener('click', (e) => {
            if (e.target === thankYouModal) closeThankYouModal();
        });
    }

    // Use only the correct form selector
    const astroForm = document.querySelector('form.astro-form');
    if (astroForm) {
        astroForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            let valid = true;
            // Clear previous errors
            astroForm.querySelectorAll('.error-message').forEach(el => el.textContent = '');

            // Full Name validation
            if (!astroForm.fullName.value.trim()) {
                astroForm.fullName.nextElementSibling.textContent = 'Full name is required.';
                valid = false;
            }

            // Date of Birth validation (not in future)
            const dobValue = astroForm.dob.value;
            if (!dobValue) {
                astroForm.dob.nextElementSibling.textContent = 'Date of birth is required.';
                valid = false;
            } else {
                const dobDate = new Date(dobValue);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (dobDate > today) {
                    astroForm.dob.nextElementSibling.textContent = 'Date of birth cannot be in the future.';
                    valid = false;
                }
            }

            // Time of Birth validation
            if (!astroForm.timeOfBirth.value) {
                astroForm.timeOfBirth.nextElementSibling.textContent = 'Time of birth is required.';
                valid = false;
            }

            // Place of Birth validation
            if (!astroForm.placeOfBirth.value.trim()) {
                astroForm.placeOfBirth.nextElementSibling.textContent = 'Place of birth is required.';
                valid = false;
            }

            // Email validation
            const emailValue = astroForm.email.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue) {
                astroForm.email.nextElementSibling.textContent = 'Email is required.';
                valid = false;
            } else if (!emailPattern.test(emailValue)) {
                astroForm.email.nextElementSibling.textContent = 'Enter a valid email address.';
                valid = false;
            }

            // Country code validation
            const countryCodeValue = astroForm.countryCode.value;
            if (!countryCodeValue) {
                astroForm.countryCode.nextElementSibling.textContent = 'Country code is required.';
                valid = false;
            }

            // Phone validation (7-15 digits, no country code)
            const phoneValue = astroForm.phone.value.trim();
            const phonePattern = /^\d{7,15}$/;
            if (!phoneValue) {
                astroForm.phone.nextElementSibling.textContent = 'Phone number is required.';
                valid = false;
            } else if (!phonePattern.test(phoneValue)) {
                astroForm.phone.nextElementSibling.textContent = 'Enter a valid phone number (7-15 digits).';
                valid = false;
            }

            // Captcha validation (handled below)

            if (!valid) return;

            // Validate captcha before sending
            const captchaAnswer = document.getElementById('captchaAnswer').value;
            const errorElement = document.getElementById('captchaAnswer').nextElementSibling;
            if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
                if (errorElement) errorElement.textContent = 'Incorrect captcha answer';
                generateCaptcha();
                return;
            } else {
                if (errorElement) errorElement.textContent = '';
            }
            // Gather form data as JSON
            function formatDateMMDDYYYY(dateStr) {
                // If already in MM-DD-YYYY, return as is
                if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
                // If it's a number (Excel/Sheets serial), convert
                if (/^\d+$/.test(dateStr)) {
                    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                    const days = parseInt(dateStr, 10);
                    const d = new Date(excelEpoch.getTime() + days * 86400000);
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    const yyyy = d.getFullYear();
                    return `${mm}-${dd}-${yyyy}`;
                }
                // Otherwise, parse as date string
                const d = new Date(dateStr);
                if (isNaN(d)) return dateStr;
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const yyyy = d.getFullYear();
                return `${mm}-${dd}-${yyyy}`;
            }
            const data = {
                fullName: astroForm.fullName.value,
                dob: formatDateMMDDYYYY(astroForm.dob.value),
                timeOfBirth: astroForm.timeOfBirth.value,
                placeOfBirth: astroForm.placeOfBirth.value,
                email: astroForm.email.value,
                countryCode: astroForm.countryCode.value,
                phone: astroForm.phone.value,
                captchaAnswer: astroForm.captchaAnswer.value,
                timestamp: new Date().toLocaleString('en-US', { hour12: false })
            };
            try {
                const response = await fetch('https://sheetdb.io/api/v1/kfy8lb06ra0cb', {
                    method: 'POST',
                    body: JSON.stringify({ data }), // SheetDB expects { data: { ... } }
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    astroForm.reset();
                    generateCaptcha();
                    if (thankYouModal) thankYouModal.style.display = 'block';
                } else {
                    const errorText = await response.text();
                    alert('Submission failed! ' + errorText);
                }
            } catch (err) {
                alert('Oops! Something went wrong. Please try again.');
            }
        });
    }
});