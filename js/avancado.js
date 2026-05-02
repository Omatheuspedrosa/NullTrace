/* ═══════════════════════════════════════════════════════════════
   NullTrace — Avançado Page Logic
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Lenis Smooth Scroll ───────────────────────────────────────
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
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

        // Parallax effect for blurred background shapes
        const bgShape = document.querySelector('.parallax-shape');
        if (bgShape) {
            lenis.on('scroll', (e) => {
                bgShape.style.transform = `translate(-50%, ${e.scroll * 0.3}px)`;
            });
        }

        // Handle smooth click without parallax fade effect
        const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (!targetId || !targetId.startsWith('#')) return;

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    lenis.scrollTo(targetSection, {
                        duration: 1.6,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });
    }

    // ── State ─────────────────────────────────────────────────────
    const STORAGE_KEY = 'nulltrace_avancado';
    const TOTAL_MODULES = 3;
    let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { modules: [false, false, false] };

    // ── DOM refs ──────────────────────────────────────────────────
    const progressBar = document.getElementById('adv-progress-bar');
    const progressPct = document.getElementById('adv-progress-pct');
    const progressMsg = document.getElementById('adv-progress-msg');
    const moduleBtns  = document.querySelectorAll('.module-complete-btn');

    // ── Progress update ──────────────────────────────────────────
    function updateProgress() {
        const done = state.modules.filter(Boolean).length;
        const pct  = Math.round((done / TOTAL_MODULES) * 100);

        progressBar.style.width = pct + '%';
        progressPct.textContent = pct + '%';

        // Shimmer effect
        progressBar.classList.remove('shimmer');
        void progressBar.offsetWidth;
        progressBar.classList.add('shimmer');
        progressBar.addEventListener('animationend', () => progressBar.classList.remove('shimmer'), { once: true });

        if (pct === 0) {
            progressMsg.textContent = 'Complete os módulos abaixo para avançar.';
        } else if (pct < 100) {
            progressMsg.textContent = `${done} de ${TOTAL_MODULES} módulos completos — continue!`;
        } else {
            progressMsg.textContent = '🎉 Todos os módulos concluídos! Você atingiu o nível máximo de proteção.';
            progressMsg.style.color = 'var(--color-error)';
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // ── Sync buttons with saved state ────────────────────────────
    function syncButtons() {
        moduleBtns.forEach(btn => {
            const idx = parseInt(btn.dataset.module);
            const textEl = btn.querySelector('.btn-text');
            if (state.modules[idx]) {
                btn.classList.add('completed');
                textEl.textContent = 'Concluído ✓';
            } else {
                btn.classList.remove('completed');
                textEl.textContent = 'Marcar módulo concluído';
            }
        });
    }

    // ── Toggle module completion ─────────────────────────────────
    window.toggleModule = function(index) {
        state.modules[index] = !state.modules[index];
        const btn = moduleBtns[index];

        if (state.modules[index]) {
            btn.classList.add('just-completed');
            btn.addEventListener('animationend', () => btn.classList.remove('just-completed'), { once: true });
        }

        syncButtons();
        updateProgress();
    };

    // ── Scroll to module ─────────────────────────────────────────
    window.scrollToModule = function(id) {
        const el = document.getElementById(id);
        if (el) {
            if (lenis) {
                lenis.scrollTo(el, {
                    duration: 1.6,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // ── Scroll Reveal (Intersection Observer) ────────────────────
    const revealElements = document.querySelectorAll('.roadmap-node, .info-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ── Init ─────────────────────────────────────────────────────
    syncButtons();
    updateProgress();
});
