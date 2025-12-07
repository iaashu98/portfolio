// Main JavaScript for portfolio functionality
import { setupRevealAnimations } from './animations.js';

// Projects data
let projects = [];

// Fetch projects from GitHub
async function fetchGitHubProjects() {
    const username = 'iaashu98';
    const projectsGrid = document.getElementById('projects-grid');

    // Show loading state
    if (projectsGrid) {
        projectsGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading projects...</div>';
    }

    try {
        // Fetch more repos to ensure we have enough good candidates after filtering
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();

        // Filter and sort GitHub data
        const filteredProjects = data
            .filter(repo => !repo.fork && repo.description && repo.size > 50) // Non-forks, has description, size > 50kb (filters out empty/tiny repos)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at)) // Sort by stars then recency
            .slice(0, 7) // Take top 7
            .map(repo => ({
                type: 'repo',
                title: repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: repo.description,
                tags: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language || 'Code'],
                github: repo.html_url,
                demo: repo.homepage || null,
                stars: repo.stargazers_count
            }));

        projects = filteredProjects;

        // Add "View All" card as the 8th item
        projects.push({
            type: 'view-all',
            url: `https://github.com/${username}?tab=repositories`
        });

        renderProjects();
    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
        // Fallback removed as requested logic is specific to dynamic data quality
    }
}

// Render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => {
        if (project.type === 'view-all') {
            return `
            <div class="project-card reveal view-all-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: var(--color-bg-tertiary); height: 100%;">
                <div class="project-content">
                    <h3 class="card-title" style="margin-bottom: var(--space-4);">Explore More</h3>
                    <p class="card-description" style="margin-bottom: var(--space-6); -webkit-line-clamp: unset;">Check out all my open source contributions on GitHub.</p>
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        View All Repositories <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>`;
        }

        return `
        <div class="project-card reveal">
            <div class="project-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-2);">
                    <h3 class="card-title" style="margin: 0; font-size: var(--text-lg);">${project.title}</h3>
                    ${project.stars > 0 ? `<span class="tag" style="background: transparent; padding: 0;"><i class="fas fa-star" style="color: var(--color-warning);"></i> ${project.stars}</span>` : ''}
                </div>
                
                <p class="card-description">${project.description}</p>
                
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
                </div>
                
                <div class="project-links" style="display: flex; gap: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-border); margin-top: auto;">
                    ${project.github ? `
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm); flex: 1;">
              <i class="fab fa-github"></i> Code
            </a>
          ` : ''}
                    ${project.demo ? `
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: var(--space-2) var(--space-4); font-size: var(--text-sm); flex: 1;">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>
          ` : ''}
                </div>
            </div>
        </div>`;
    }).join('');

    // Re-initialize reveal animations for new elements
    setTimeout(() => {
        setupRevealAnimations();
    }, 0);
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Contact form handling
function setupContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            // Add Netlify specific form-name
            formData.append('form-name', 'contact');

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                await fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                });

                // Success message
                alert('Thank you for your message! I will get back to you soon.');
                form.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, something went wrong. Please try again later.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Typing effect for hero subtitle
function setupTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const roles = [
        'Full Stack Developer',
        '.NET Backend Developer',
        'Microservices Developer',
        'Software Engineer',
        'Budding AI Enthusiast',
        'Loves new Technologies'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Initialize all functionality
function init() {
    // Initial render or fetch
    fetchGitHubProjects();

    setupSmoothScroll();
    setupMobileMenu();
    setupContactForm();
    setupTypingEffect();

    // Scroll event listeners
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });

    // Initial calls
    handleNavbarScroll();
    updateActiveNavLink();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { projects, renderProjects };
