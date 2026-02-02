// Import navigation animation
import { initNavAnimation } from '../components/navigation/navAnimation.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavAnimation();

    // Initialize scroll animations using IntersectionObserver
    initScrollAnimations();

    // Initialize smooth scroll
    initializeSmoothScroll();

    // Initialize card hover effects
    initCardHoverEffects();
});

// Scroll-triggered animations using IntersectionObserver
// Use a global observer so dynamically loaded elements can be added
let scrollObserver = null;

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe existing elements
    observeElements();

    // Watch for dynamically loaded content
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    // Check if the node itself needs observing
                    if (node.classList?.contains('fade-in-view')) {
                        setupAndObserve(node);
                    }
                    // Check children
                    node.querySelectorAll?.('.fade-in-view')?.forEach(el => {
                        setupAndObserve(el);
                    });
                }
            });
        });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function setupAndObserve(element) {
    if (!element.dataset.observed) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        element.dataset.observed = 'true';
        scrollObserver?.observe(element);
    }
}

function observeElements() {
    const fadeInElements = document.querySelectorAll('.fade-in-view, .stagger-animation, [data-animate]');
    fadeInElements.forEach(element => setupAndObserve(element));
}

// Native smooth scroll functionality
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effect for cards (CSS-based, but with JS fallback)
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .tech-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
}
