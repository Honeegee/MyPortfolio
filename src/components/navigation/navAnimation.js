const initNavAnimation = () => {
    // Mobile menu toggle functionality
    const menuButton = document.querySelector('nav button[aria-label="Toggle menu"]');
    const mobileMenu = document.querySelector('nav .mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');

            // Add slide animation
            if (isHidden) {
                mobileMenu.classList.add('animate-slide-down');
                mobileMenu.classList.remove('animate-slide-up');
            } else {
                mobileMenu.classList.add('animate-slide-up');
                mobileMenu.classList.remove('animate-slide-down');
            }
        });
    }

    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu a');
    
    // Function to check if a link matches the current page
    const isCurrentPage = (link) => {
        const linkPath = link.getAttribute('href');
        const pageName = currentPath.split('/').pop() || 'index.html';
        return linkPath.endsWith(pageName);
    };

    // Highlight desktop navigation links
    navLinks.forEach(link => {
        if (isCurrentPage(link)) {
            link.classList.add('text-purple-400');
            link.classList.add('after:w-full');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Highlight mobile navigation links
    mobileNavLinks.forEach(link => {
        if (isCurrentPage(link)) {
            link.classList.add('text-purple-400');
            link.classList.add('bg-purple-500/10');
            link.setAttribute('aria-current', 'page');
        }
    });
};

export { initNavAnimation };
