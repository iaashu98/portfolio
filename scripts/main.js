// Main JavaScript for portfolio functionality

// Projects data
const projects = [
    {
        title: 'Art Gallery Database Management',
        description: 'A comprehensive database management system for art galleries with CRUD operations, search functionality, and stored procedures.',
        image: '/img/work1.png',
        tags: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
        github: 'https://github.com/i-ashu/art-gallery-database-management',
        demo: null
    },
    {
        title: 'Flask Personal Blog',
        description: 'A full-featured blogging platform built with Flask, featuring user authentication, post management, and MySQL database integration.',
        image: '/img/blog.png',
        tags: ['Flask', 'Python', 'MySQL', 'jQuery', 'Bootstrap'],
        github: 'https://github.com/i-ashu/flask-personal-blog',
        demo: null
    },
    {
        title: 'QR Code Scanner',
        description: 'A web-based QR code scanner application using HTML5 camera API for real-time QR code detection and decoding.',
        image: '/img/work2.png',
        tags: ['HTML5', 'CSS3', 'JavaScript', 'WebRTC'],
        github: 'https://github.com/i-ashu/QRScanner',
        demo: null
    },
    {
        title: 'Ferris Wheel Animation',
        description: 'An interactive 3D Ferris wheel animation created using OpenGL and C++, demonstrating computer graphics concepts.',
        image: '/img/work3.png',
        tags: ['OpenGL', 'C++', 'Computer Graphics'],
        github: 'https://github.com/i-ashu/ferris-wheel-cg-project',
        demo: null
    },
    {
        title: 'Password Generator & Keeper',
        description: 'A secure password generator and management tool built with Python, featuring encryption and password strength analysis.',
        image: '/img/work1.png', // Using work1 as placeholder content since work5.jpg is missing
        tags: ['Python3', 'Cryptography', 'Security'],
        github: 'https://github.com/i-ashu/password-generator-and-keeper',
        demo: null
    },
    {
        title: 'Crypto Connect',
        description: 'A modern cryptocurrency tracking application with real-time price updates, portfolio management, and market analytics.',
        image: '/img/work4.png',
        tags: ['React', 'GraphQL', 'TypeScript', 'TailwindCSS'],
        github: 'https://github.com/iaashu98/crypto-connect',
        demo: 'http://localhost:5173'
    }
];

// Render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
    < div class="project-card reveal" >
        <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-content">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag tag-primary">${tag}</span>`).join('')}
                </div>
                <div class="project-links" style="display: flex; gap: var(--space-4); margin-top: var(--space-4);">
                    ${project.github ? `
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              <i class="fab fa-github"></i> Code
            </a>
          ` : ''}
                    ${project.demo ? `
            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>
          ` : ''}
                </div>
            </div>
        </div>
`).join('');
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
        if (link.getAttribute('href') === `#${current} `) {
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
        '.NET Developer',
        'Web Developer',
        'Software Engineer',
        'Problem Solver'
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
    renderProjects();
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
