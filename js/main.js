// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        mobileMenu.classList.add('hidden');
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to elements
document.querySelectorAll('section > div').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize Particles.js with balanced effects
particlesJS('particles-js', {
    particles: {
        number: {
            value: 60,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#64748b', '#94a3b8', '#3b82f6']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 1,
                color: '#ffffff'
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.2,
                sync: false
            }
        },
        size: {
            value: 4,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#94a3b8',
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 200,
                size: 8,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 3
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Add floating shapes animation
function createFloatingShapes() {
    const heroSection = document.querySelector('#home');
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    
    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shapesContainer.appendChild(shape);
    }
    
    heroSection.appendChild(shapesContainer);
}

// Enhanced scroll animations
function addScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation to cards
                const cards = entry.target.querySelectorAll('.card-hover');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        scrollObserver.observe(section);
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    createFloatingShapes();
    addScrollAnimations();
});