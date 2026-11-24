const burgerMenu = document.getElementById('burger-btn');
const xBtn = document.getElementById('x-btn');
const mobileMenu = document.querySelector('.mobile-nav');

if (burgerMenu && mobileMenu) {
    burgerMenu.addEventListener('click', () => {
        mobileMenu.style.width = '100vw';
    });
}

if (xBtn && mobileMenu) {
    xBtn.addEventListener('click', () => {
        mobileMenu.style.width = '0';
    });
}

const signupTrigger = document.getElementById('signup-trigger');
const signupOverlay = document.getElementById('signup-overlay');
const signupFormPopup = document.getElementById('signup-form-popup');
const welcomePopup = document.getElementById('welcome-popup');
const signupForm = document.getElementById('signup-form');
const fullNameInput = document.getElementById('full-name');
const welcomeName = document.getElementById('welcome-name');
const popupClose = document.getElementById('popup-close');
const signupStatus = document.getElementById('signup-status');
const signupButton = signupForm?.querySelector('.popup-submit');

if (signupTrigger && signupOverlay && signupForm && signupFormPopup && welcomePopup) {
    if (window.emailjs) {
        window.emailjs.init({
            publicKey: 'xMlWvr24mBBLjgJFi',
        });
    }

    signupTrigger.addEventListener('click', (event) => {
        event.preventDefault();
        signupOverlay.classList.add('is-open');
        signupOverlay.setAttribute('aria-hidden', 'false');
        signupFormPopup.hidden = false;
        welcomePopup.hidden = true;
        if (signupStatus) signupStatus.textContent = '';
        document.body.classList.add('popup-open');
        fullNameInput?.focus();
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!signupForm.reportValidity()) return;

        const formData = new FormData(signupForm);
        const fullName = String(formData.get('fullName') || '').trim();
        const email = String(formData.get('email') || '');
        const templateParams = {
            fullName,
            to_name: fullName,
            to_email: email,
            birthMonth: String(formData.get('birthMonth') || ''),
            birthDay: String(formData.get('birthDay') || ''),
            email,
            phone: String(formData.get('phone') || ''),
        };

        if (signupButton) {
            signupButton.disabled = true;
            signupButton.textContent = 'SENDING...';
        }
        if (signupStatus) signupStatus.textContent = 'Sending your signup...';

        try {
            await window.emailjs.send('service_17js0jj', 'template_bizyqd8', templateParams);
            if (welcomeName) welcomeName.textContent = fullName.toUpperCase();
            signupFormPopup.hidden = true;
            welcomePopup.hidden = false;
            if (signupStatus) signupStatus.textContent = '';
            popupClose?.focus();
        } catch (error) {
            console.error('Email signup failed:', error);
            if (signupStatus) {
                signupStatus.textContent = 'We could not send your signup. Please check your connection and try again.';
            }
        } finally {
            if (signupButton) {
                signupButton.disabled = false;
                signupButton.textContent = 'SIGN UP';
            }
        }
    });

    const closeSignupPopup = () => {
        signupOverlay.classList.remove('is-open');
        signupOverlay.setAttribute('aria-hidden', 'true');
        signupForm.reset();
        if (signupStatus) signupStatus.textContent = '';
        document.body.classList.remove('popup-open');
        signupTrigger.focus();
    };

    popupClose?.addEventListener('click', closeSignupPopup);

    signupOverlay.addEventListener('click', (event) => {
        if (event.target === signupOverlay) closeSignupPopup();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && signupOverlay.classList.contains('is-open')) {
            closeSignupPopup();
        }
    });
}
