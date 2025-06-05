// Settings management module
const settingsManager = {
    // Initialize settings
    init() {
        this.initCongrats();
        this.bindEvents();
    },

    // Initialize congratulations setting
    initCongrats() {
        const savedCongrats = localStorage.getItem('showCongrats');
        const showCongrats = savedCongrats === null ? true : savedCongrats === 'true';
        const congratsToggle = document.getElementById('congratsToggle');
        if (congratsToggle) {
            congratsToggle.checked = showCongrats;
        }
    },

    // Bind event listeners
    bindEvents() {
        const congratsToggle = document.getElementById('congratsToggle');
        if (congratsToggle) {
            congratsToggle.addEventListener('change', (e) => {
                localStorage.setItem('showCongrats', e.target.checked);
            });
        }
    }
};

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    settingsManager.init();
}); 