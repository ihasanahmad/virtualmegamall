// Theme Switcher for Virtual Mega Mall
// Supports: Dark, Light, and Auto (device preference) modes

const THEME_KEY = 'vmm-theme-preference';
const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
    AUTO: 'auto'
};

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || THEMES.AUTO;
    applyTheme(savedTheme);
    updateThemeToggle(savedTheme);
}

// Apply theme to document
function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === THEMES.AUTO) {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? THEMES.DARK : THEMES.LIGHT);
    } else {
        root.setAttribute('data-theme', theme);
    }

    // Store preference
    localStorage.setItem(THEME_KEY, theme);
}

// Update theme toggle button UI
function updateThemeToggle(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icons = {
        [THEMES.DARK]: '<i class="fa-solid fa-moon"></i>',
        [THEMES.LIGHT]: '<i class="fa-solid fa-sun"></i>',
        [THEMES.AUTO]: '<i class="fa-solid fa-circle-half-stroke"></i>'
    };

    toggleBtn.innerHTML = icons[theme] || icons[THEMES.AUTO];
    toggleBtn.setAttribute('title', `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
}

// Cycle through themes: dark -> light -> auto -> dark
function cycleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || THEMES.AUTO;
    let nextTheme;

    switch (currentTheme) {
        case THEMES.DARK:
            nextTheme = THEMES.LIGHT;
            break;
        case THEMES.LIGHT:
            nextTheme = THEMES.AUTO;
            break;
        case THEMES.AUTO:
            nextTheme = THEMES.DARK;
            break;
        default:
            nextTheme = THEMES.AUTO;
    }

    applyTheme(nextTheme);
    updateThemeToggle(nextTheme);

    // Show toast notification
    showThemeToast(nextTheme);
}

// Show theme change notification
function showThemeToast(theme) {
    const messages = {
        [THEMES.DARK]: '🌙 Dark Mode',
        [THEMES.LIGHT]: '☀️ Light Mode',
        [THEMES.AUTO]: '🔄 Auto (Device Preference)'
    };

    // Create or use existing toast
    let toast = document.getElementById('theme-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'theme-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(30, 30, 30, 0.95);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: 500;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = messages[theme];

    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Hide after 2 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.opacity = '0';
    }, 2000);
}

// Listen for system theme changes when in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem(THEME_KEY);
    if (currentTheme === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
    }
});

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
