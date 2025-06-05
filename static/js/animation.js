// Initialize elements before animation
document.querySelectorAll('.box').forEach(box => {
    box.style.transform = 'scaleX(0)';
});
document.querySelectorAll('.letter-box span').forEach(span => {
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
});

// Animation timeline
const timeline = anime.timeline({
    easing: 'easeOutExpo'
});

// Add animations to timeline
timeline
    .add({
        targets: '.box',
        scaleX: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeInOutQuad'
    })
    .add({
        targets: '.letter-box span',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: anime.stagger(100),
    }, '-=600')
    .add({
        targets: '.box',
        scaleX: [1, 0],
        translateX: ['0%', '100%'],
        duration: 600,
        delay: anime.stagger(100),
    }, '-=400');

// Replay animation on click
document.querySelector('.letters-container').addEventListener('click', () => {
    // Reset elements before replaying
    document.querySelectorAll('.box').forEach(box => {
        box.style.transform = 'scaleX(0) translateX(0)';
    });
    document.querySelectorAll('.letter-box span').forEach(span => {
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
    });
    
    // Restart animation
    timeline.restart();
}); 