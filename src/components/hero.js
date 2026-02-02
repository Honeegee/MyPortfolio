// Simple hero content animations using CSS transitions

// Initialize hero content with staggered fade-in
function initializeHeroContent() {
    const heroElements = document.querySelectorAll('.hero-element');

    heroElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        // Stagger the animations
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });

    // Profile image animation
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
        profileImage.style.opacity = '0';
        profileImage.style.transform = 'scale(0.9)';
        profileImage.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        setTimeout(() => {
            profileImage.style.opacity = '1';
            profileImage.style.transform = 'scale(1)';
        }, 100);
    }
}

// Main initialization function
export function initHeroAnimations() {
    try {
        console.log('Initializing hero animations...');
        initializeHeroContent();
        console.log('Hero animations initialized successfully');
    } catch (error) {
        console.error('Error initializing hero animations:', error);
    }
}
