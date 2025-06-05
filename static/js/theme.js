// Let's make sure we remember everyone's preferred theme!
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// When the page loads, let's set up the right theme
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
}); 