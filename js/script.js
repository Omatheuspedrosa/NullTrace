document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for global smooth scrolling
    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Existing Intersection Observer for Nav Highlighting
    const elementsToAnimate = document.querySelectorAll('section, header'); 
    const sectionsToObserve = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-500', 'font-semibold', 'border-blue-600');
                    link.classList.add('text-slate-400', 'hover:text-white', 'border-transparent');
                });

                const activeId = entry.target.getAttribute('id');
                if (activeId) {
                    const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
                    if (activeLink) {
                        activeLink.classList.remove('text-slate-400', 'hover:text-white', 'border-transparent');
                        activeLink.classList.add('text-blue-500', 'font-semibold', 'border-blue-600');
                    }
                }
            }
        });
    }, observerOptions);

    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });


    // Handle smooth nav click with lightweight parallax
    const smoothScrollLinks = document.querySelectorAll('.nav-link, .smooth-scroll');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            let targetSection;
            if (targetId === '#') {
                targetSection = document.body;
            } else {
                targetSection = document.querySelector(targetId);
            }

            if (targetSection) {
                // Scroll via Lenis
                lenis.scrollTo(targetSection, {
                    duration: 1.6,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // Typing Effect Logic for Hero Title
    const heroTitle = document.getElementById('hero-title');
    const heroCursor = document.querySelector('.typing-cursor');
    
    if (heroTitle) {
        const segments = [
            { text: "Seus dados são seu ", class: "text-white" },
            { text: "patrimônio", class: "text-secondary" },
            { text: ". ", class: "text-white" },
            { text: "<br>Proteja-os.", class: "text-white" }
        ];

        // Prepare title area - preserve cursor
        heroTitle.innerHTML = "";
        const cursor = document.createElement('span');
        cursor.className = "typing-cursor";
        heroTitle.appendChild(cursor);
        
        heroTitle.style.opacity = "1";
        
        let segmentIndex = 0;
        let charIndex = 0;

        function typeChar() {
            if (segmentIndex < segments.length) {
                const currentSegment = segments[segmentIndex];
                
                // Find or create the span for this segment
                let segmentSpan = heroTitle.querySelector(`span[data-seg="${segmentIndex}"]`);
                if (!segmentSpan) {
                    segmentSpan = document.createElement('span');
                    if (currentSegment.class) segmentSpan.className = currentSegment.class;
                    segmentSpan.setAttribute('data-seg', segmentIndex);
                    // Insert segment before the cursor
                    heroTitle.insertBefore(segmentSpan, cursor);
                }

                // Handle text or special markup like <br>
                const textToType = currentSegment.text;
                if (charIndex < textToType.length) {
                    if (textToType.substring(charIndex, charIndex + 4) === "<br>") {
                        segmentSpan.innerHTML += "<br>";
                        charIndex += 4;
                    } else {
                        segmentSpan.innerHTML += textToType[charIndex];
                        charIndex++;
                    }
                    
                    // Human-like varied typing speed
                    const nextSpeed = 50 + Math.random() * 60;
                    setTimeout(typeChar, nextSpeed);
                } else {
                    // Move to next segment
                    segmentIndex++;
                    charIndex = 0;
                    setTimeout(typeChar, 120);
                }
            } else {
                // Done typing
                cursor.style.opacity = "1"; 
            }
        }

        // Start typing after short initial delay
        setTimeout(typeChar, 800);
    }

    // Number Counter Animation for Statistics
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const prefix = el.dataset.prefix || "";
                const suffix = el.dataset.suffix || "";
                const decimals = parseInt(el.dataset.decimals) || 0;
                const duration = 2000; // 2 seconds animation
                
                let startTime = null;

                function animate(currentTime) {
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    // Easing: easeOutExpo
                    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    const currentVal = target * easedProgress;
                    const formatted = currentVal.toLocaleString('pt-BR', {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    });
                    
                    el.innerText = `${prefix}${formatted}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-counter').forEach(stat => statsObserver.observe(stat));
});
