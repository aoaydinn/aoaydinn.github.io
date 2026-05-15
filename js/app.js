document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SOPHISTICATED PARTICLE NETWORK BACKGROUND
    // ==========================================
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = window.innerWidth < 768 ? 25 : 60; // Düşürüldü (Performans)

    function resizeCanvas() {
        canvas.width = window.innerWidth;
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
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
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
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < 14400) { // 120 * 120 (Performans için karekök öncesi eleme)
                    const distance = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 - distance / 1000})`;
                    ctx.lineWidth = 0.5;
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
    // 1.5 DİNAMİK YAŞ VE YIL HESAPLAMA
    // ==========================================
    const currentYear = new Date().getFullYear();
    
    // Otomatik Yıl (Footer)
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // Otomatik Yaş (Hakkımda - Doğum Yılı: 1994)
    const ageSpan = document.getElementById('age-val');
    if (ageSpan) {
        // Eğer tam doğum tarihi biliniyorsa daha hassas hesaplanabilir,
        // şu anki mevcut yıla göre basit hesaplama:
        ageSpan.textContent = currentYear - 1994;
    }

    // ==========================================
    // 2. FADE-IN ANIMATIONS ON SCROLL
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in-up, .glass-card, .section-title');
    
    // Add default fade class to cards and titles if not present
    fadeElements.forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill bar animations if in view
                const skillBars = entry.target.querySelectorAll('.progress-line span');
                if(skillBars.length > 0) {
                    skillBars.forEach(bar => bar.classList.add('animate'));
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // ==========================================
    // 3. MOBİL MENÜ (HAMBURGER)
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // ==========================================
    // 4. YAZMA EFEKTİ (TYPEWRITER)
    // ==========================================
    const typedTextSpan = document.getElementById("typed-text");
    const textArray = [
        "Siber Güvenlik Uzmanı", 
        "Yazılım Geliştirici", 
        "Sistem Mühendisi", 
        "AI Tutkunu"
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // ==========================================
    // 5. SCROLL VE AKTİF MENÜ İŞLEMLERİ
    // ==========================================
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
        
        // Sticky Navbar effect enhancement
        const navbar = document.querySelector('.navbar');
        if(window.scrollY > 50) {
            navbar.style.background = 'rgba(3, 7, 18, 0.9)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(3, 7, 18, 0.7)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ==========================================
    // 6. GOOGLE DORKS ARAMA ARACI
    // ==========================================
    const searchBtn = document.getElementById('searchBtn');
    const searchQueryInput = document.getElementById('searchQuery');

    function performSearch() {
        let query = searchQueryInput.value.trim();
        let fileType = document.querySelector('input[name="fileType"]:checked')?.value || "";
        let searchPoint = document.querySelector('input[name="searchPoint"]:checked')?.value || "";

        if (!query) {
            alert("Arama yapmak için lütfen bir terim girin.");
            return;
        }

        let dork = `"${query}"`;
        if (fileType) {
            dork += ` filetype:${fileType}`;
        }
        if (searchPoint) {
            dork += ` site:${searchPoint}`;
        }

        window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`, '_blank');
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchQueryInput) {
        searchQueryInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // ==========================================
    // 7. İLETİŞİM FORMU SUBMIT
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Mesajınız güvenli kanallardan iletildi. En kısa sürede dönüş yapılacaktır.");
            contactForm.reset();
        });
    }

});
