// Cookie Consent Modal - Elegant Implementation
class CookieConsent {
    constructor() {
        this.initModal();
        this.checkConsent();
    }

    initModal() {
        const modalHTML = `
            <div class="cookie-consent-overlay" id="cookieConsentOverlay">
                <div class="cookie-consent-modal">
                    <button class="cookie-consent-close" onclick="cookieConsent.continueWithoutAccepting()">
                        Continue without accepting
                    </button>
                    
                    <h1 class="cookie-consent-title">Your Cookie Preferences</h1>
                    
                    <h2 class="cookie-consent-subtitle">Welcome to VirtualMegaMall.com</h2>
                    
                    <p class="cookie-consent-text">
                        Virtual Mega Mall uses cookies, including third-party cookies, for functional reasons, for statistical analysis, to personalise your experience, offer you content that targets your particular interests and analyse the performance of our advertising campaigns.
                    </p>
                    
                    <p class="cookie-consent-text">
                        You can either accept these cookies by clicking "Accept and Continue", or click "Set cookie preferences" to set your preferences.
                    </p>
                    
                    <div class="cookie-consent-buttons">
                        <button class="cookie-btn cookie-btn-outline" onclick="cookieConsent.showPreferences()">
                            Set cookie preferences
                        </button>
                        <button class="cookie-btn cookie-btn-filled" onclick="cookieConsent.acceptAll()">
                            Accept and Continue
                        </button>
                    </div>
                    
                    <div class="cookie-consent-footer">
                        <p>
                            You can change your preferences at any time by going to the "Cookies" module or to the "Privacy Policy" sub-section of the "LEGAL & PRIVACY" section. They are accessible through links at the bottom of any virtualmegamall.com website page.
                        </p>
                        <p style="margin-top: 10px;">
                            <a class="cookie-consent-link" onclick="cookieConsent.showCookieList()">See the list of cookies used on our site</a>
                        </p>
                        <p style="margin-top: 5px;">
                            For more information on our cookie policy, please click <a href="help.html" class="cookie-consent-link">here</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    checkConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => {
                this.show();
            }, 1000);
        }
    }

    show() {
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hide() {
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    acceptAll() {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookiePreferences', JSON.stringify({
            functional: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }));
        this.hide();
        this.showToast('Cookie preferences saved');
    }

    continueWithoutAccepting() {
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookiePreferences', JSON.stringify({
            functional: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        this.hide();
    }

    showPreferences() {
        // Open preferences modal (simplified version)
        alert('Cookie Preferences:\n\nYou can customize which cookies to accept. For now, please use "Accept and Continue" or "Continue without accepting".');
    }

    showCookieList() {
        alert('Cookie List:\n\n• Functional Cookies: Essential for website operation\n• Analytics Cookies: Help us understand how you use our site\n• Marketing Cookies: Used to show you relevant ads\n\nFor detailed information, please visit our Privacy Policy.');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is ready
let cookieConsent;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cookieConsent = new CookieConsent();
    });
} else {
    cookieConsent = new CookieConsent();
}
