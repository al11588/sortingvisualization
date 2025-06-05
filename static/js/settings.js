// Let's handle theme preferences!
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeSelect').value = savedTheme;
}

// Time to switch up the look!
function toggleTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Let's check if users want to see our celebrations
function initCongrats() {
    const savedCongrats = localStorage.getItem('showCongrats');
    const showCongrats = savedCongrats === null ? true : savedCongrats === 'true';
    document.getElementById('congratsToggle').checked = showCongrats;
}

// Remember their celebration preferences
function toggleCongrats(show) {
    localStorage.setItem('showCongrats', show);
}

// Time to set everything up when the page loads!
document.addEventListener('DOMContentLoaded', () => {
    // Get our theme and congratulations settings ready
    initTheme();
    initCongrats();

    // Watch for theme changes
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        toggleTheme(e.target.value);
    });

    // Keep an eye on those congratulations preferences
    document.getElementById('congratsToggle').addEventListener('change', (e) => {
        toggleCongrats(e.target.checked);
    });

    // Reset to default settings handler
    document.getElementById('resetDefaultBtn').addEventListener('click', () => {
        // Set default theme
        const defaultTheme = 'light';
        document.getElementById('themeSelect').value = defaultTheme;
        toggleTheme(defaultTheme);

        // Set default congratulations setting
        const defaultCongrats = true;
        document.getElementById('congratsToggle').checked = defaultCongrats;
        toggleCongrats(defaultCongrats);
    });
}); 