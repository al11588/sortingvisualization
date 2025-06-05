// Let's set up our fancy hamburger menu!
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuItems = document.getElementById('menuItems');

    if (!hamburgerBtn || !menuItems) {
        console.error('Oops! Couldn\'t find our menu elements');
        return;
    }

    // Make the menu pop up when clicking the hamburger
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // This keeps the document click from immediately closing our menu
        hamburgerBtn.classList.toggle('active');
        menuItems.classList.toggle('active');
    });

    // Hide the menu when clicking anywhere else on the page
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !menuItems.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            menuItems.classList.remove('active');
        }
    });

    // Keep the menu open when clicking inside it
    menuItems.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Let's get our menu ready when the page loads!
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
}); 