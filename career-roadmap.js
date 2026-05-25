/* ─────────────────────────────────────────────
   Career Roadmap — App Logic
   ───────────────────────────────────────────── */

/* ── THEME ──────────────────────────────────── */
function setTheme(theme) {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', theme);
    localStorage.setItem('roadmapTheme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeTarget === theme);
    });
    setTimeout(() => root.classList.remove('theme-transitioning'), 300);
}

// Apply saved theme before first paint (no flash)
(function () {
    const saved = localStorage.getItem('roadmapTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
})();

/* ── STATE ───────────────────────────────────── */
const state       = JSON.parse(localStorage.getItem('roadmapState')       || '{}');
const phaseStates = JSON.parse(localStorage.getItem('roadmapPhaseStates') || '{}');

function saveState() {
    localStorage.setItem('roadmapState',       JSON.stringify(state));
    localStorage.setItem('roadmapPhaseStates', JSON.stringify(phaseStates));
}

/* ── ITEM TOGGLE ─────────────────────────────── */
function toggleItem(el) {
    const id = el.dataset.id;
    state[id] = !state[id];
    el.classList.toggle('completed', state[id]);
    saveState();
    updateAllProgress();
}

/* ── PHASE TOGGLE ────────────────────────────── */
function togglePhase(phaseId) {
    const body    = document.getElementById('body-'    + phaseId);
    const chevron = document.getElementById('chevron-' + phaseId);
    const isOpen  = body.classList.contains('open');

    body.classList.toggle('open', !isOpen);
    chevron.classList.toggle('rotated', !isOpen);
    phaseStates[phaseId] = !isOpen;
    saveState();
}

/* ── MODAL ───────────────────────────────────── */
function toggleGuide(el) {
    const item  = el.closest('.item');
    const guide = item.querySelector('.item-guide');

    // Pull data from the card
    const title = item.querySelector('.item-text')?.textContent.trim()  || '';
    const desc  = item.querySelector('.item-desc')?.textContent.trim()  || '';
    const tags  = item.querySelector('.item-tags')?.innerHTML            || '';

    // Badge: grab the phase badge emoji from the parent phase
    const phase = item.closest('.phase');
    const badgeEl = phase?.querySelector('.phase-badge');
    const badgeHTML = badgeEl ? badgeEl.innerHTML : '📖';

    // Fill modal header
    document.getElementById('modalBadge').innerHTML  = badgeHTML;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent  = desc;
    document.getElementById('modalTags').innerHTML    = tags;

    // Clone guide sections into modal body
    const bodyEl = document.getElementById('modalBody');
    bodyEl.innerHTML = guide ? guide.innerHTML : '<p style="color:var(--text-muted)">No guide available.</p>';

    openModal();
}

function openModal() {
    const backdrop = document.getElementById('guideModal');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus trap: focus the close button
    setTimeout(() => backdrop.querySelector('.modal-close')?.focus(), 50);
}

function closeModal() {
    document.getElementById('guideModal').classList.remove('open');
    document.body.style.overflow = '';
}

function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeModal();
}

/* ── PROGRESS ────────────────────────────────── */
function getPhaseItems(phaseId) {
    const phase = document.querySelector('[data-phase="' + phaseId + '"]');
    return phase ? phase.querySelectorAll('.item') : [];
}

function updatePhaseProgress(phaseId) {
    const items = getPhaseItems(phaseId);
    const total = items.length;
    let completed = 0;
    items.forEach(item => { if (state[item.dataset.id]) completed++; });

    const fraction = document.getElementById('progress-' + phaseId);
    const bar      = document.getElementById('bar-'      + phaseId);
    if (fraction) fraction.textContent = completed + ' / ' + total;
    if (bar)      bar.style.width = total > 0 ? ((completed / total) * 100) + '%' : '0%';

    return { completed, total };
}

function updateAllProgress() {
    const phases = ['immediate','phase1','phase2','phase3','core','books','avoid'];
    let totalCompleted = 0, totalItems = 0;

    phases.forEach(id => {
        const { completed, total } = updatePhaseProgress(id);
        totalCompleted += completed;
        totalItems     += total;
    });

    const pct = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    document.getElementById('overallFraction').textContent = totalCompleted + ' / ' + totalItems;
    document.getElementById('overallPercent').textContent  = pct + '%';
    document.getElementById('statTotal').textContent       = totalItems;
    document.getElementById('statCompleted').textContent   = totalCompleted;
    document.getElementById('statRemaining').textContent   = totalItems - totalCompleted;

    const ring         = document.getElementById('overallRing');
    const circumference = 2 * Math.PI * 24;
    ring.style.strokeDashoffset = circumference - (totalItems > 0 ? totalCompleted / totalItems : 0) * circumference;
}

/* ── INIT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

    // Theme buttons
    const saved = localStorage.getItem('roadmapTheme') || 'dark';
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeTarget === saved);
        btn.addEventListener('click', () => setTheme(btn.dataset.themeTarget));
    });

    // Restore item states
    document.querySelectorAll('.item').forEach(item => {
        if (state[item.dataset.id]) item.classList.add('completed');
    });

    // Restore phase open states
    Object.keys(phaseStates).forEach(phaseId => {
        if (phaseStates[phaseId]) {
            const body    = document.getElementById('body-'    + phaseId);
            const chevron = document.getElementById('chevron-' + phaseId);
            if (body && chevron) {
                body.classList.add('open');
                chevron.classList.add('rotated');
            }
        }
    });

    updateAllProgress();

    // Escape to close modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // --- SIDEBAR & LAYOUT GENERATION ---
    const container = document.querySelector('.container');
    if (container) {
        // 1. Wrap .container in .app-layout
        const layoutWrapper = document.createElement('div');
        layoutWrapper.className = 'app-layout';
        container.parentNode.insertBefore(layoutWrapper, container);

        // 2. Generate sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        
        // Move stats grid to sidebar
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.classList.add('sidebar-stats');
            sidebar.appendChild(statsGrid);
        }
        
        const sidebarTitle = document.createElement('div');
        sidebarTitle.className = 'sidebar-title';
        sidebarTitle.textContent = 'Roadmap Phases';
        sidebar.appendChild(sidebarTitle);

        const sidebarNav = document.createElement('nav');
        sidebarNav.className = 'sidebar-nav';

        const phasesElements = document.querySelectorAll('.phase');
        phasesElements.forEach((phase, index) => {
            if (!phase.id) phase.id = 'phase-' + phase.dataset.phase;
            
            const badgeHtml = phase.querySelector('.phase-badge').innerHTML;
            const titleText = phase.querySelector('.phase-title').textContent.split('—')[0].trim();
            
            const link = document.createElement('a');
            link.href = '#' + phase.id;
            link.className = 'sidebar-link';
            
            link.innerHTML = `<div class="badge">${badgeHtml}</div><span>${titleText}</span>`;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Hide all phases
                document.querySelectorAll('.phase').forEach(p => {
                    p.style.display = 'none';
                });
                
                // Remove active class from all links
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                
                // Show target phase
                const target = document.getElementById(phase.id);
                if (target) {
                    target.style.display = 'block';
                    
                    // Re-trigger animation for premium feel
                    target.style.animation = 'none';
                    target.offsetHeight; // trigger reflow
                    target.style.animation = 'fadeUp 0.4s ease forwards';
                    
                    // Auto-open the phase body since it's the only thing on screen
                    const body = target.querySelector('.phase-body');
                    const chevron = target.querySelector('.chevron');
                    if (body && !body.classList.contains('open')) {
                        body.classList.add('open');
                        if (chevron) chevron.classList.add('rotated');
                    }
                    
                    // Scroll to top of the content
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                link.classList.add('active');
            });
            
            sidebarNav.appendChild(link);
            
            // Set initial state
            if (index === 0) {
                link.classList.add('active');
                phase.style.display = 'block';
                // Auto-open first phase
                const body = phase.querySelector('.phase-body');
                const chevron = phase.querySelector('.chevron');
                if (body && !body.classList.contains('open')) {
                    body.classList.add('open');
                    if (chevron) chevron.classList.add('rotated');
                }
            } else {
                phase.style.display = 'none';
            }
        });

        sidebar.appendChild(sidebarNav);
        layoutWrapper.appendChild(sidebar);
        layoutWrapper.appendChild(container); // Move container inside layoutWrapper
    }

    // --- BACK TO TOP BUTTON ---
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

});
