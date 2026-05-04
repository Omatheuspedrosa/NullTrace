/* ═══════════════════════════════════════════════════════════════
   NullTrace — Intermediário Page Logic
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
    const STORAGE_KEY = 'nulltrace_intermediario';
    const TOTAL_MODULES = 3;
    let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { modules: [false, false, false] };

    // ── DOM refs ──────────────────────────────────────────────────
    const progressBarsInline = document.querySelectorAll('[id="int-progress-bar-inline"]');
    const progressPctsInline = document.querySelectorAll('[id="int-progress-pct-inline"]');
    const progressMsgsInline = document.querySelectorAll('[id="int-progress-msg-inline"]');
    const progressBarDocked = document.getElementById('int-progress-bar-docked');
    const progressPctDocked = document.getElementById('int-progress-pct-docked');
    const progressMsgDocked = document.getElementById('int-progress-msg-docked');
    const inlineActiveLabels = document.querySelectorAll('[id="int-inline-active-label"]');
    const inlineCompletedLabels = document.querySelectorAll('[id="int-inline-completed-label"]');
    const moduleBtns  = document.querySelectorAll('.module-complete-btn');
    const moduleSections = Array.from(document.querySelectorAll('[data-module-section]'));
    const moduleNavLinks = Array.from(document.querySelectorAll('[data-module-nav]'));
    const moduleMarkers = Array.from(document.querySelectorAll('[data-module-marker]'));
    const roadmapCards = Array.from(document.querySelectorAll('[data-roadmap-card]'));
    const roadmapDots = Array.from(document.querySelectorAll('[data-roadmap-dot]'));
    const roadmapStatusPills = Array.from(document.querySelectorAll('[id^="roadmap-status-"]'));
    const progressWorkspace = document.getElementById('intermediate-workspace');
    const progressTrigger = document.getElementById('intermediate-progress-trigger');
    const progressInlineShell = document.getElementById('intermediate-progress-inline-shell');
    const progressInlineCard = document.getElementById('intermediate-progress-inline-card');
    const progressDockedCard = document.getElementById('intermediate-progress-docked-card');
    const desktopDockMedia = window.matchMedia('(min-width: 1440px)');

    let isDocked = false;
    let dockCheckRaf = null;
    let activeModuleIndex = 0;

    function syncModuleNavigation() {
        moduleNavLinks.forEach((link, index) => {
            const step = link.querySelector('.intermediate-progress-module-step');
            const stateLabel = link.querySelector('.intermediate-progress-module-state');
            const completed = state.modules[index];
            const active = index === activeModuleIndex;

            link.classList.toggle('is-completed', completed);
            link.classList.toggle('is-active', active);
            link.setAttribute('aria-current', active ? 'step' : 'false');

            if (step) {
                step.textContent = String(index + 1).padStart(2, '0');
            }
            if (stateLabel) {
                stateLabel.textContent = completed ? '✓' : active ? 'ATUAL' : '•';
            }
        });

        moduleMarkers.forEach((marker, index) => {
            marker.classList.toggle('is-completed', !!state.modules[index]);
            marker.classList.toggle('is-active', index === activeModuleIndex && !state.modules[index]);
        });

        roadmapCards.forEach((card, index) => {
            card.classList.toggle('is-completed', !!state.modules[index]);
            card.classList.toggle('is-active', index === activeModuleIndex);
        });

        roadmapDots.forEach((dot, index) => {
            dot.classList.toggle('is-completed', !!state.modules[index]);
            dot.classList.toggle('is-active', index === activeModuleIndex);
        });

        roadmapStatusPills.forEach((pill, index) => {
            const completed = state.modules[index];
            const active = index === activeModuleIndex;
            pill.classList.toggle('is-completed', completed);
            pill.classList.toggle('is-active', active);
            pill.textContent = completed ? 'Concluído ✓' : active ? 'Módulo atual' : index < activeModuleIndex ? 'Revisar' : 'Próximo';
        });
    }

    function getStickyTopOffset() {
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.getBoundingClientRect().height : 64;
        return Math.round(navHeight + 24);
    }

    function syncStickyOffset() {
        if (!progressWorkspace) return;
        progressWorkspace.style.setProperty('--int-progress-top', `${getStickyTopOffset()}px`);
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
        const bottomTrigger = document.getElementById('intermediate-progress-trigger-bottom');
        const bottomRect = bottomTrigger ? bottomTrigger.getBoundingClientRect() : null;
        
        const stickyTop = getStickyTopOffset();
        let shouldDock = triggerRect.top <= stickyTop;

        if (bottomRect && bottomRect.top <= window.innerHeight * 0.85) {
            shouldDock = false;
        }

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

        progressBarsInline.forEach(el => el.style.width = pct + '%');
        progressPctsInline.forEach(el => el.textContent = pct + '%');
        if (progressBarDocked) progressBarDocked.style.height = pct + '%';
        if (progressPctDocked) progressPctDocked.textContent = pct + '%';
        
        inlineActiveLabels.forEach(el => {
            el.textContent = `Módulo atual: ${String(activeModuleIndex + 1).padStart(2, '0')}`;
        });
        inlineCompletedLabels.forEach(el => {
            el.textContent = `${done}/${TOTAL_MODULES} concluídos`;
        });

        // Shimmer effect
        progressBarsInline.forEach(el => {
            el.classList.remove('shimmer');
            void el.offsetWidth;
            el.classList.add('shimmer');
            el.addEventListener('animationend', () => el.classList.remove('shimmer'), { once: true });
        });

        let nextMessage = 'Complete os módulos abaixo para avançar.';
        let nextDockedMessage = `${done}/${TOTAL_MODULES} módulos concluídos`;
        if (pct === 0) {
            nextMessage = 'Complete os módulos abaixo para avançar.';
            nextDockedMessage = `0/${TOTAL_MODULES} módulos concluídos`;
        } else if (pct < 100) {
            nextMessage = `${done} de ${TOTAL_MODULES} módulos completos — continue!`;
            nextDockedMessage = `${done}/${TOTAL_MODULES} módulos concluídos`;
        } else {
            nextMessage = 'Todos os módulos concluídos. Nível intermediário completo.';
            nextDockedMessage = `${TOTAL_MODULES}/${TOTAL_MODULES} módulos concluídos`;
        }

        progressMsgsInline.forEach(el => {
            el.textContent = nextMessage;
            el.style.color = pct === 100 ? 'var(--color-secondary)' : '';
        });
        if (progressMsgDocked) {
            progressMsgDocked.textContent = nextDockedMessage;
            progressMsgDocked.style.color = pct === 100 ? 'var(--color-secondary)' : '';
        }

        syncModuleNavigation();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // ── Sync buttons with saved state ────────────────────────────
    function syncButtons() {
        moduleBtns.forEach(btn => {
            const idx = parseInt(btn.dataset.module);
            const textEl = btn.querySelector('.btn-text');
            const moduleSection = moduleSections[idx];
            if (state.modules[idx]) {
                btn.classList.add('completed');
                textEl.textContent = 'Concluído ✓';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('completed');
                textEl.textContent = 'Marcar módulo como concluído';
                btn.setAttribute('aria-pressed', 'false');
            }

            if (moduleSection) {
                moduleSection.querySelectorAll('.hardening-item').forEach(item => {
                    item.classList.toggle('done', !!state.modules[idx]);
                });
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
    const revealElements = document.querySelectorAll('.roadmap-node, .dns-card, .browser-card, .identity-card');

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

    const moduleObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length === 0) return;

        const nextIndex = parseInt(visibleEntries[0].target.dataset.moduleSection, 10);
        if (!Number.isNaN(nextIndex) && nextIndex !== activeModuleIndex) {
            activeModuleIndex = nextIndex;
            updateProgress();
        }
    }, {
        threshold: [0.2, 0.35, 0.55],
        rootMargin: '-20% 0px -45% 0px'
    });

    moduleSections.forEach(section => moduleObserver.observe(section));

    // ── Init ─────────────────────────────────────────────────────
    syncButtons();
    syncModuleNavigation();
    updateProgress();
    syncStickyOffset();

    if (progressWorkspace && progressInlineCard && progressDockedCard && progressTrigger) {
        progressWorkspace.classList.toggle('is-enhanced', desktopDockMedia.matches);
        evaluateDocking();

        window.addEventListener('scroll', scheduleDockCheck, { passive: true });
        window.addEventListener('resize', scheduleDockCheck);
        desktopDockMedia.addEventListener('change', handleDockMediaChange);

        if (lenis) {
            lenis.on('scroll', scheduleDockCheck);
        }
    }
});
