// Theme management module
const themeManager = {
    // Initialize theme from localStorage or default to light
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(savedTheme);
        
        // If we're on the settings page, update the theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
            themeSelect.addEventListener('change', (e) => this.toggleTheme(e.target.value));
        }
    },

    // Apply theme to document and save to localStorage
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },

    // Toggle between themes
    toggleTheme(theme) {
        this.applyTheme(theme);
    }
};

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
}); 