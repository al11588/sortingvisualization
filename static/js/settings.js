// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').value = savedTheme;
}

function toggleTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Remember if users want to see congratulations
function initCongrats() {
    const savedCongrats = localStorage.getItem('showCongrats');
    const showCongrats = savedCongrats === null ? true : savedCongrats === 'true';
    document.getElementById('congratsToggle').checked = showCongrats;
}

// Save their preference about seeing congratulations
function toggleCongrats(show) {
    localStorage.setItem('showCongrats', show);
}

// Initialize settings
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme and congratulations
    initTheme();
    initCongrats();

    // Theme toggle handler
    document.getElementById('themeToggle').addEventListener('change', (e) => {
        toggleTheme(e.target.value);
    });

    // Congratulations toggle handler
    document.getElementById('congratsToggle').addEventListener('change', (e) => {
        toggleCongrats(e.target.checked);
    });
}); 