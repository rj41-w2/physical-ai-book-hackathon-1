function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,ur',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// Global reference
window.googleTranslateElementInit = googleTranslateElementInit;

// Helper to force translation if cookie exists
(function() {
    const checkAndTranslate = () => {
        if (window.google && google.translate && google.translate.TranslateElement) {
            const match = document.cookie.match(/googtrans=\/en\/ur/);
            if (match) {
                // If cookie is ur, but page is not translated, we might need a nudge
                // Google usually handles this via cookie, but SPAs are tricky
            }
        } else {
            setTimeout(checkAndTranslate, 500);
        }
    };
    checkAndTranslate();
})();
