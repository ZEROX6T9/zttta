// zta.js - Enhanced Custom JavaScript for ZTA Astrophotography Website
// Version: 2.0
// Date: December 13, 2025
// Author: Grok AI Assistance
// Description: This script provides premium-like features including smooth scrolling, parallax effects, 
// fade-in animations on scroll using IntersectionObserver, navbar shrinking on scroll, 
// scroll-to-top button with smooth animation, and a star particle background for an astro-themed premium feel.
// All implemented in vanilla JavaScript for lightweight performance.
// Best practices: Throttled event listeners, error handling, modular functions, and detailed comments.
// Fixed potential issues: Added checks for element existence, used requestAnimationFrame for animations, 
// improved image loading, and ensured cross-browser compatibility where possible.

// Polyfill for IntersectionObserver if not supported (for older browsers)
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported. Fade-in animations may not work.');
    // Simple fallback: make all elements visible immediately
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.blog-card').forEach(el => el.classList.add('visible'));
    });
}

// Utility function: Throttle to optimize performance on scroll/resize events
function throttle(fn, limit = 100) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn(...args);
        }
    };
}

// Utility function: Debounce for events like resize
function debounce(fn, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("ZTA website loaded – zta.js active (Enhanced Premium Version)");

    // ====================
    // 1. Read More / Read Less Functionality (for blog cards)
    // ====================
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function () {
            const blogText = this.previousElementSibling; // .blog-text
            const shortText = blogText.querySelector('.text-short');
            const fullText = blogText.querySelector('.text-full');
            if (!fullText || !shortText) {
                console.warn('Missing text elements in blog card.');
                return; // Safety check
            }
            if (fullText.style.display === "none" || fullText.style.display === "") {
                fullText.style.display = "inline";
                shortText.style.display = "none";
                this.textContent = "READ LESS ↑";
            } else {
                fullText.style.display = "none";
                shortText.style.display = "inline";
                this.textContent = "READ MORE →";
            }
        });
    });

    // ====================
    // 2. Smooth Scrolling for Internal Links
    // ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn(`Target element #${targetId} not found.`);
            }
        });
    });

    // ====================
    // 3. Navbar Active State (highlight current page)
    // ====================
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-right a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = "#fff";
            link.style.fontWeight = "600";
        }
    });

    // ====================
    // 4. Simple Preloader Fade Out (Uncommented and Enhanced)
    // ====================
    // Assuming <div class="preloader"></div> in HTML with CSS: position: fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:9999; transition: opacity 0.6s;
    window.addEventListener("load", function () {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 600);
        }
    });

    // ====================
    // 5. Image Lazy Loading Enhancement with Fade-In
    // ====================
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy'; // Native lazy loading
        img.style.opacity = "0";
        img.style.transition = "opacity 0.6s ease";
        img.addEventListener('load', function () {
            this.style.opacity = "1";
        });
        // Fallback if already loaded
        if (img.complete) {
            img.style.opacity = "1";
        }
    });

    // ====================
    // 6. Console Easter Egg (fun for visitors who open dev tools)
    // ====================
    console.log("%c🌌 Welcome to ZTA – Zero To Astro 🌌", "color: #9acd32; font-size: 18px; font-weight: bold;");
    console.log("%cThanks for exploring the universe with me!", "color: #bbb; font-size: 14px;");

    // ====================
    // 7. Fade-In Animations on Scroll using IntersectionObserver (Premium Feature)
    // ====================
    // Requires CSS: .blog-card { opacity: 0; transform: translateY(50px); transition: opacity 0.5s ease, transform 0.5s ease; }
    // .blog-card.visible { opacity: 1; transform: translateY(0); }
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    document.querySelectorAll('.blog-card').forEach(card => {
        fadeInObserver.observe(card);
    });

    // ====================
    // 8. Parallax Scrolling for Hero Section (Premium Astro Effect)
    // ====================
    // Assumes .hero has background-image set in CSS.
    // Adjusts background position on scroll for parallax.
    const hero = document.querySelector('.hero');
    if (hero) {
        const parallaxScroll = throttle(() => {
            const scrollY = window.scrollY;
            hero.style.backgroundPositionY = `${scrollY * 0.5}px`; // Adjust speed (0.5 for subtle)
        }, 16); // ~60fps

        window.addEventListener('scroll', parallaxScroll);
    } else {
        console.warn('Hero element not found for parallax.');
    }

    // ====================
    // 9. Scroll-to-Top Button with Smooth Animation (Premium UX)
    // ====================
    // Create button dynamically
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scrollToTop';
    scrollToTopBtn.textContent = '↑';
    scrollToTopBtn.style.position = 'fixed';
    scrollToTopBtn.style.bottom = '20px';
    scrollToTopBtn.style.right = '20px';
    scrollToTopBtn.style.background = '#9acd32';
    scrollToTopBtn.style.color = '#000';
    scrollToTopBtn.style.border = 'none';
    scrollToTopBtn.style.borderRadius = '50%';
    scrollToTopBtn.style.width = '50px';
    scrollToTopBtn.style.height = '50px';
    scrollToTopBtn.style.fontSize = '24px';
    scrollToTopBtn.style.cursor = 'pointer';
    scrollToTopBtn.style.opacity = '0';
    scrollToTopBtn.style.transition = 'opacity 0.3s ease';
    scrollToTopBtn.style.zIndex = '99';
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const showScrollBtn = throttle(() => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
        }
    }, 200);

    window.addEventListener('scroll', showScrollBtn);

    // ====================
    // 10. Navbar Shrink on Scroll (Premium Responsive Design)
    // ====================
    // Requires CSS: .navbar.shrunk { padding: 10px 40px; } .navbar.shrunk .nav-left { font-size: 20px; } etc.
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const shrinkNavbar = throttle(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('shrunk');
            } else {
                navbar.classList.remove('shrunk');
            }
        }, 200);

        window.addEventListener('scroll', shrinkNavbar);
    } else {
        console.warn('Navbar element not found for shrink effect.');
    }

    // ====================
    // 11. Star Particle Background (Premium Astro-Themed Animation)
    // ====================
    // Creates a canvas with moving stars for background, z-index behind content.
    // Astro theme: white dots moving slowly like stars in space.
    const particleCanvas = document.createElement('canvas');
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.zIndex = '-1';
    document.body.appendChild(particleCanvas);

    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    const numParticles = 200; // Adjustable for performance
    const maxSpeed = 0.5; // Slow for space feel

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * maxSpeed - maxSpeed / 2;
            this.speedY = Math.random() * maxSpeed - maxSpeed / 2;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.y > particleCanvas.height) this.y = 0;
            if (this.y < 0) this.y = particleCanvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        initParticles(); // Re-init on resize
    }

    window.addEventListener('resize', debounce(resizeCanvas));
    resizeCanvas();
    animateParticles();

    // Additional premium touch: Twinkle effect (random opacity change)
    setInterval(() => {
        particles.forEach(p => {
            p.opacity = Math.random() * 0.5 + 0.5;
        });
    }, 2000);

    // ====================
    // End of Script - Additional Features Can Be Added Here
    // ====================
    // To make it even more premium, consider adding: 
    // - Mouse interaction for particles (e.g., repulsion)
    // - More UI animations (e.g., hover glow on cards)
    // - Accessibility enhancements (e.g., reduced motion query)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations if user prefers reduced motion
        document.querySelectorAll('.blog-card').forEach(card => card.classList.add('visible'));
        // Stop particles or simplify
        particles = []; // Clear particles
    }
});
    // ====================
    // 12. Custom Cursor with Glow Trail (Premium Astro Feel)
    // ====================
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Add this CSS in your <style> or external CSS
    // .custom-cursor { position: fixed; width: 20px; height: 20px; background: radial-gradient(circle, #9acd32 0%, transparent 70%); pointer-events: none; border-radius: 50%; transform: translate(-50%, -50%); z-index: 9999; opacity: 0.6; mix-blend-mode: screen; transition: transform 0.1s ease; }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Glow on hover over interactive elements
    document.querySelectorAll('a, button, .blog-card, .read-more-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });

    // ====================
    // 13. 3D Tilt Effect on Blog Cards (Vanilla, No Library)
    // ====================
    document.querySelectorAll('.blog-card').forEach(card => {
        card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 15;
            const rotateX = ((centerY - y) / centerY) * 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        });
    });

    // ====================
    // 14. Dark Mode Toggle (Optional Button)
    // ====================
    // Add a toggle button in navbar: <a href="javascript:void(0)" id="themeToggle">🌙</a>
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'light') document.body.classList.add('light-mode');

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.textContent = isLight ? '☀️' : '🌙';
        });
    }

    // Optional CSS for light mode:
    // body.light-mode { background: #f0f0f0; color: #000; }
    // body.light-mode .blog-card { background: #fff; border-color: #ddd; }