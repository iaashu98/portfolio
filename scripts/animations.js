// Scroll-triggered animations using Intersection Observer

// Create intersection observer for reveal animations
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after revealing
                // revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
);

// Observe all elements with reveal class
function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
}

// Animate skill progress bars when they come into view
function setupSkillAnimations() {
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');

                    setTimeout(() => {
                        progressBar.style.width = `${progress}%`;
                    }, 200);

                    skillObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    const progressBars = document.querySelectorAll('.skill-progress-bar');
    progressBars.forEach((bar) => {
        bar.style.width = '0%';
        skillObserver.observe(bar);
    });
}

// Parallax effect for hero background
function setupParallax() {
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Stagger animation for grid items
function setupStaggerAnimation() {
    const grids = document.querySelectorAll('.grid');

    grids.forEach((grid) => {
        const items = grid.querySelectorAll('.reveal');

        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Initialize animations
function initAnimations() {
    setupRevealAnimations();
    setupSkillAnimations();
    setupParallax();
    setupStaggerAnimation();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

export { setupRevealAnimations, setupSkillAnimations };
