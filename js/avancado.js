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
    const progressBarInline = document.getElementById('adv-progress-bar-inline');
    const progressPctInline = document.getElementById('adv-progress-pct-inline');
    const progressMsgInline = document.getElementById('adv-progress-msg-inline');
    const progressBarDocked = document.getElementById('adv-progress-bar-docked');
    const progressPctDocked = document.getElementById('adv-progress-pct-docked');
    const progressMsgDocked = document.getElementById('adv-progress-msg-docked');
    const moduleBtns  = document.querySelectorAll('.module-complete-btn');
    const progressWorkspace = document.getElementById('advanced-workspace');
    const progressTrigger = document.getElementById('advanced-progress-trigger');
    const progressInlineShell = document.getElementById('advanced-progress-inline-shell');
    const progressInlineCard = document.getElementById('advanced-progress-inline-card');
    const progressDockedCard = document.getElementById('advanced-progress-docked-card');
    const desktopDockMedia = window.matchMedia('(min-width: 1440px)');

    let isDocked = false;
    let dockCheckRaf = null;

    function getStickyTopOffset() {
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.getBoundingClientRect().height : 64;
        return Math.round(navHeight + 24);
    }

    function syncStickyOffset() {
        if (!progressWorkspace) return;
        progressWorkspace.style.setProperty('--adv-progress-top', `${getStickyTopOffset()}px`);
    }

    function setDockState(nextDocked, { immediate = false } = {}) {
        if (!progressWorkspace || !progressInlineCard || !progressDockedCard || !progressInlineShell) return;
        if (!desktopDockMedia.matches) {
            progressWorkspace.classList.remove('is-enhanced', 'is-docked');
            isDocked = false;
            return;
        }

        progressWorkspace.classList.add('is-enhanced');
        syncStickyOffset();
        if (nextDocked === isDocked) return;

        if (immediate) {
            progressWorkspace.classList.toggle('is-docked', nextDocked);
            isDocked = nextDocked;
            return;
        }

        progressWorkspace.classList.toggle('is-docked', nextDocked);
        isDocked = nextDocked;
    }

    function evaluateDocking() {
        if (!progressWorkspace || !progressTrigger) return;
        if (!desktopDockMedia.matches) {
            setDockState(false, { immediate: true });
            return;
        }

        const triggerRect = progressTrigger.getBoundingClientRect();
        const stickyTop = getStickyTopOffset();
        const shouldDock = triggerRect.top <= stickyTop;

        setDockState(shouldDock);
    }

    function scheduleDockCheck() {
        if (dockCheckRaf) return;
        dockCheckRaf = requestAnimationFrame(() => {
            dockCheckRaf = null;
            evaluateDocking();
        });
    }

    function handleDockMediaChange(event) {
        if (event.matches) {
            progressWorkspace?.classList.add('is-enhanced');
            scheduleDockCheck();
            return;
        }

        setDockState(false, { immediate: true });
    }

    // ── Progress update ──────────────────────────────────────────
    function updateProgress() {
        const done = state.modules.filter(Boolean).length;
        const pct  = Math.round((done / TOTAL_MODULES) * 100);

        if (progressBarInline) progressBarInline.style.width = pct + '%';
        if (progressPctInline) progressPctInline.textContent = pct + '%';
        if (progressBarDocked) progressBarDocked.style.height = pct + '%';
        if (progressPctDocked) progressPctDocked.textContent = pct + '%';

        // Shimmer effect
        if (progressBarInline) {
            progressBarInline.classList.remove('shimmer');
            void progressBarInline.offsetWidth;
            progressBarInline.classList.add('shimmer');
            progressBarInline.addEventListener('animationend', () => progressBarInline.classList.remove('shimmer'), { once: true });
        }

        let nextMessage = 'Complete os módulos abaixo para avançar.';
        let nextDockedMessage = 'Siga pelos módulos para avançar.';
        if (pct === 0) {
            nextMessage = 'Complete os módulos abaixo para avançar.';
            nextDockedMessage = 'Siga pelos módulos para avançar.';
        } else if (pct < 100) {
            nextMessage = `${done} de ${TOTAL_MODULES} módulos completos — continue!`;
            nextDockedMessage = `${done}/${TOTAL_MODULES} módulos concluídos.`;
        } else {
            nextMessage = 'Todos os módulos concluídos. Nível avançado completo.';
            nextDockedMessage = 'Nível avançado concluído.';
        }

        if (progressMsgInline) {
            progressMsgInline.textContent = nextMessage;
            progressMsgInline.style.color = pct === 100 ? 'var(--color-error)' : '';
        }
        if (progressMsgDocked) {
            progressMsgDocked.textContent = nextDockedMessage;
            progressMsgDocked.style.color = pct === 100 ? 'var(--color-error)' : '';
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

    if (progressWorkspace && progressInlineCard && progressDockedCard && progressTrigger) {
        syncStickyOffset();
        progressWorkspace.classList.toggle('is-enhanced', desktopDockMedia.matches);
        evaluateDocking();

        window.addEventListener('scroll', scheduleDockCheck, { passive: true });
        window.addEventListener('resize', scheduleDockCheck);
        desktopDockMedia.addEventListener('change', handleDockMediaChange);
    }
});
