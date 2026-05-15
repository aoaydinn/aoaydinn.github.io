document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1400);
    });
    // Fallback: gizle
    setTimeout(() => preloader && preloader.classList.add('hidden'), 3000);


    // ==========================================
    // 2. CUSTOM CURSOR
    // ==========================================
    const cursorDot  = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
        let ringX = 0, ringY = 0;
        let dotX  = 0, dotY  = 0;
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top  = mouseY + 'px';
        });

        // Ring follows with lag
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .filter-btn, .project-card, .tag, .cyber-radio, .social-links a, .lang-btn, #back-to-top'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovered');
                cursorRing.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovered');
                cursorRing.classList.remove('hovered');
            });
        });

        document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
        document.addEventListener('mouseup',   () => cursorDot.classList.remove('clicking'));
    }


    // ==========================================
    // 3. SCROLL PROGRESS BAR
    // ==========================================
    const scrollBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollBar) scrollBar.style.width = progress + '%';
    }, { passive: true });


    // ==========================================
    // 4. PARTICLE NETWORK BACKGROUND
    // ==========================================
    const canvas = document.getElementById('matrixCanvas');
    const ctx    = canvas.getContext('2d');
    let particles = [];
    let particleCount = window.innerWidth < 768 ? 25 : 60;

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            particleCount = window.innerWidth < 768 ? 25 : 60;
            initParticles();
        }, 150);
    });

    class Particle {
        constructor() {
            this.x      = Math.random() * canvas.width;
            this.y      = Math.random() * canvas.height;
            this.vx     = (Math.random() - 0.5) * 0.5;
            this.vy     = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height)  this.vy = -this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx     = particles[i].x - particles[j].x;
                const dy     = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 14400) {
                    const dist = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 - dist / 1000})`;
                    ctx.lineWidth   = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // ==========================================
    // 5. DYNAMIC AGE & YEAR
    // ==========================================
    const currentYear = new Date().getFullYear();
    const yearSpan    = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = currentYear;

    const ageSpan = document.getElementById('age-val');
    if (ageSpan) ageSpan.textContent = currentYear - 1994;


    // ==========================================
    // 6. GLASS CARD SPOTLIGHT EFFECT
    // ==========================================
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x    = ((e.clientX - rect.left) / rect.width)  * 100;
            const y    = ((e.clientY - rect.top)  / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });


    // ==========================================
    // 7. 3D TILT EFFECT (PROJECT CARDS)
    // ==========================================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const rotateX = -dy * 6;
            const rotateY =  dx * 6;
            card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition   = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform 0.5s ease, opacity 0.3s ease, border-color 0.4s ease';
        });
    });


    // ==========================================
    // 8. SCROLL FADE-IN ANIMATIONS
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in-up, .glass-card, .section-title');
    fadeElements.forEach(el => {
        if (!el.classList.contains('fade-in-up')) el.classList.add('fade-in-up');
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.progress-line span')
                    .forEach(bar => bar.classList.add('animate'));
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));


    // ==========================================
    // 9. COUNT-UP ANIMATION
    // ==========================================
    function countUp(el, target, duration, suffix) {
        let start     = 0;
        const step    = Math.ceil(target / (duration / 16));
        const timer   = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = start + suffix;
        }, 16);
    }

    const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el     = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                countUp(el, target, 1200, suffix);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));


    // ==========================================
    // 10. MOBILE MENU (HAMBURGER)
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links li a').forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });


    // ==========================================
    // 11. TYPEWRITER EFFECT
    // ==========================================
    const typedTextSpan = document.getElementById('typed-text');
    const isEN = document.documentElement.lang === 'en';
    const textArray = isEN
        ? ['Cybersecurity Expert', 'Software Developer', 'System Engineer', 'AI Enthusiast']
        : ['Siber Güvenlik Uzmanı', 'Yazılım Geliştirici', 'Sistem Mühendisi', 'AI Tutkunu'];

    let textIndex = 0, charIndex = 0;

    function type() {
        if (charIndex < textArray[textIndex].length) {
            typedTextSpan.textContent += textArray[textIndex].charAt(charIndex++);
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textIndex].substring(0, --charIndex);
            setTimeout(erase, 50);
        } else {
            textIndex = (textIndex + 1) % textArray.length;
            setTimeout(type, 600);
        }
    }

    setTimeout(type, 2250);


    // ==========================================
    // 12. SCROLL & ACTIVE NAV
    // ==========================================
    const sections  = document.querySelectorAll('section');
    const navItems  = document.querySelectorAll('.nav-links li a');
    const navbar    = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Active nav item
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - section.clientHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href').includes(current));
        });

        // Sticky navbar
        navbar.style.background  = scrollY > 50 ? 'rgba(3, 7, 18, 0.92)' : 'rgba(3, 7, 18, 0.7)';
        navbar.style.boxShadow   = scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.15)' : 'none';

        // Back to top visibility
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }
    }, { passive: true });

    // Back to top click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ==========================================
    // 13. PROJECT CATEGORY FILTER
    // ==========================================
    const filterBtns    = document.querySelectorAll('.filter-btn');
    const projectCards  = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const cats = card.dataset.category || '';
                if (filter === 'all' || cats.includes(filter)) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });


    // ==========================================
    // 14. TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(message, type = 'success', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    }


    // ==========================================
    // 15. MAGNETIC BUTTON EFFECT
    // ==========================================
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
            const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
            btn.style.transform    = `translate(${dx}px, ${dy}px)`;
            btn.style.transition   = 'transform 0.15s ease';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });


    // ==========================================
    // 16. INTERMITTENT GLITCH EFFECT
    // ==========================================
    const glitchEl = document.querySelector('.glitch');
    if (glitchEl) {
        function triggerGlitch() {
            glitchEl.classList.add('glitching');
            setTimeout(() => glitchEl.classList.remove('glitching'), 400);
            // Next trigger: random between 3s and 7s
            setTimeout(triggerGlitch, 3000 + Math.random() * 4000);
        }
        setTimeout(triggerGlitch, 2500);
    }


    // ==========================================
    // 17. GOOGLE DORKS SEARCH TOOL
    // ==========================================
    const searchBtn        = document.getElementById('searchBtn');
    const searchQueryInput = document.getElementById('searchQuery');

    function performSearch() {
        const query       = searchQueryInput.value.trim();
        const fileType    = document.querySelector('input[name="fileType"]:checked')?.value    || '';
        const searchPoint = document.querySelector('input[name="searchPoint"]:checked')?.value || '';

        if (!query) {
            showToast('Arama yapmak için lütfen bir terim girin.', 'error');
            return;
        }

        let dork = `"${query}"`;
        if (fileType)    dork += ` filetype:${fileType}`;
        if (searchPoint) dork += ` site:${searchPoint}`;

        window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`, '_blank');
    }

    if (searchBtn)        searchBtn.addEventListener('click', performSearch);
    if (searchQueryInput) searchQueryInput.addEventListener('keyup', e => e.key === 'Enter' && performSearch());


    // ==========================================
    // 18. CONTACT FORM (TOAST REPLACE ALERT)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Mesajınız iletildi. En kısa sürede dönüş yapılacaktır.', 'success');
            contactForm.reset();
        });
    }

});
