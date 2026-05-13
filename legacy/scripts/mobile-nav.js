// Mobile navigation menu toggle logic for TechStore

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open', isOpen);
            navToggle.classList.toggle('active', isOpen);
        });
    }
    // Optional: close menu when clicking on a nav link (mobile UX)
    navMenu && navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            document.body.classList.remove('nav-open');
            navToggle.classList.remove('active');
        });
    });
});
