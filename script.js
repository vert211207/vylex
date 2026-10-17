/**
 * VYLEX - Engineering Learning Platform
 * Application Logic & State Management
 * Vanilla ES6+
 */

'use strict';

/* ==========================================================================
   1. Data Models
   ========================================================================== */
const DB = {
    subjects: [
        { id: 'cpp', name: 'C/C++ Fundamentals', icon: 'C++', color: 'cyan', links: ['ds', 'algo', 'verilog'] },
        { id: 'verilog', name: 'Digital Logic & Verilog', icon: 'V', color: 'purple', links: ['cpp', 'dl'] },
        { id: 'dl', name: 'Digital Logic', icon: 'DL', color: 'blue', links: ['verilog'] },
        { id: 'git', name: 'Git & Version Control', icon: 'G', color: 'orange', links: ['cpp'] },
        { id: 'ds', name: 'Data Structures', icon: 'DS', color: 'cyan', links: ['algo', 'cpp'] },
        { id: 'algo', name: 'Algorithms', icon: 'AL', color: 'pink', links: ['ds'] }
    ],
    
    vivaQuestions: [
        {
            id: 'q1',
            subject: 'cpp',
            question: 'Explain the difference between a struct and a class in C++?',
            options: [
                'Structs are value types, classes are reference types.',
                'Struct members are public by default, class members are private by default.',
                'Structs cannot have methods, classes can.',
                'There is no functional difference.'
            ],
            correctIndex: 1,
            explanation: 'In C++, struct members are public by default, while class members are private by default. Otherwise, they are functionally identical.'
        },
        {
            id: 'q2',
            subject: 'ds',
            question: 'What is the time complexity of accessing an element in an array by index?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
            correctIndex: 2,
            explanation: 'Arrays provide O(1) constant time access because elements are stored in contiguous memory locations, and the index allows direct calculation of the memory address.'
        },
        {
            id: 'q3',
            subject: 'dl',
            question: 'Which logic gate outputs true ONLY when both inputs are true?',
            options: ['OR', 'XOR', 'AND', 'NAND'],
            correctIndex: 2,
            explanation: 'The AND gate performs logical conjunction. It outputs 1 (true) only if both input A and input B are 1.'
        }
    ],

    revisionNotes: [
        {
            id: 'pointers',
            title: 'Pointers',
            category: 'Memory',
            description: 'Pointers are raw objects in computing locate memories and contain font. Supportive intensity mathematical to common documents.',
            totalSteps: 30,
            notes: 'A pointer is a variable that stores the memory address of another variable. In C++, they are declared using the * operator.',
            mistakes: 'Dereferencing uninitialized pointers (wild pointers) leads to undefined behavior. Always initialize pointers to nullptr or a valid address.'
        },
        {
            id: 'memory-management',
            title: 'Memory Management',
            category: 'Memory',
            description: 'Memory Management is a core aspect of software development, involving allocation, usage, and release of memory resources.',
            totalSteps: 30,
            notes: 'In C++, memory is allocated on the heap using `new` and deallocated using `delete`. Modern C++ uses smart pointers (unique_ptr, shared_ptr) to manage this automatically.',
            mistakes: 'Memory leaks occur when dynamically allocated memory is not deallocated. Double-freeing memory causes crashes.'
        },
        {
            id: 'karnaugh-maps',
            title: 'Karnaugh Maps',
            category: 'Digital Logic',
            description: 'Karnaugh Maps are visual tools used to simplify boolean algebra expressions, crucial for digital logic design.',
            totalSteps: 30,
            notes: 'A K-map is a diagrammatic technique for simplifying Boolean expressions by grouping adjacent cells with 1s.',
            mistakes: 'Failing to group the largest possible power-of-2 blocks, or forgetting to wrap around the edges of the map.'
        }
    ],

    codePrograms: [
        {
            id: 'hello-world',
            title: 'Hello World (C++)',
            language: 'cpp',
            code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, VYLEX!" << std::endl;\n    return 0;\n}`,
            output: 'Hello, VYLEX!',
            explanation: 'This basic program includes the standard input/output library and prints a string to the console.'
        },
        {
            id: 'ptr-arithmetic',
            title: 'Pointer Arithmetic',
            language: 'cpp',
            code: `#include <iostream>\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int* ptr = arr;\n    \n    std::cout << *ptr << "\\n";   // 10\n    ptr++;\n    std::cout << *ptr << "\\n";   // 20\n    return 0;\n}`,
            output: '10\n20',
            explanation: 'Incrementing a pointer moves it to the next memory address based on the size of the data type it points to (e.g., 4 bytes for an int).'
        },
        {
            id: 'verilog-and',
            title: 'Verilog AND Gate',
            language: 'verilog',
            code: `module and_gate (\n    input wire a,\n    input wire b,\n    output wire y\n);\n    assign y = a & b;\nendmodule`,
            output: 'Simulation: When a=1, b=1, y=1. Otherwise, y=0.',
            explanation: 'Basic hardware description of a 2-input AND gate using continuous assignment.'
        }
    ]
};

/* ==========================================================================
   2. State Management & Storage
   ========================================================================== */
const STORAGE_KEY = 'vylex_user_state_v1';

const defaultState = {
    currentView: 'view-home',
    viva: {
        currentQuestionIndex: 0,
        score: 0,
        completed: false,
        answeredQuestions: []
    },
    revision: {
        bookmarks: ['pointers'],
        progress: {
            'pointers': 10,
            'memory-management': 30,
            'karnaugh-maps': 10
        }
    },
    codeStudio: {
        activeProgramId: 'hello-world'
    }
};

let AppState = { ...defaultState };

function loadState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Basic validation and merge to prevent corrupted state crashes
            AppState = {
                ...defaultState,
                ...parsed,
                viva: { ...defaultState.viva, ...(parsed.viva || {}) },
                revision: { ...defaultState.revision, ...(parsed.revision || {}) },
                codeStudio: { ...defaultState.codeStudio, ...(parsed.codeStudio || {}) }
            };
        }
    } catch (e) {
        console.warn('Failed to load state from localStorage. Using defaults.', e);
        AppState = { ...defaultState };
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
    } catch (e) {
        console.warn('Failed to save state to localStorage.', e);
    }
}

/* ==========================================================================
   3. Utility Functions
   ========================================================================== */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

// Toast Notification System
function showToast(message, type = 'info') {
    let container = $('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        // Basic inline styles for the container, the rest is handled via classes
        container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    // Inline style for toast to match dark theme if not in CSS
    toast.style.cssText = `
        background: rgba(12, 14, 23, 0.95);
        border: 1px solid ${type === 'error' ? 'var(--accent-pink)' : 'var(--border-highlight)'};
        border-left: 4px solid ${type === 'error' ? 'var(--accent-pink)' : 'var(--accent-cyan)'};
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        font-family: var(--font-family);
        font-size: 0.9rem;
        animation: slideIn 0.3s ease forwards;
    `;
    
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Simple syntax highlighting for code
function highlightCode(code, lang) {
    // Escape HTML
    let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (lang === 'cpp') {
        html = html.replace(/(#include <.*?>)/g, '<span style="color:#569CD6;">$1</span>');
        html = html.replace(/\b(int|return|void|std|cout|endl|const|class|struct|public|private|new|delete)\b/g, '<span style="color:#C586C0;">$1</span>');
        html = html.replace(/(\d+)/g, '<span style="color:#B5CEA8;">$1</span>');
        html = html.replace(/(".*?")/g, '<span style="color:#CE9178;">$1</span>');
    } else if (lang === 'verilog') {
        html = html.replace(/\b(module|endmodule|input|output|wire|assign)\b/g, '<span style="color:#569CD6;">$1</span>');
        html = html.replace(/(\d+)/g, '<span style="color:#B5CEA8;">$1</span>');
    }
    
    // Return with pre-styled base
    return `<pre style="margin:0; font-family:monospace; font-size:0.9rem; line-height:1.5; color:#D4D4D4;">${html}</pre>`;
}

/* ==========================================================================
   4. Navigation & Routing
   ========================================================================== */
function initNavigation() {
    const navLinks = $$('.nav-link[data-target], .mobile-nav .nav-link');
    
    // Dynamically add Code Studio link to sidebar and mobile nav
    injectCodeStudioNav();

    // Handle navigation clicks
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link[data-target]');
        if (link) {
            e.preventDefault();
            const targetView = link.getAttribute('data-target');
            navigateTo(targetView);
            
            // Update URL hash without jumping
            history.pushState(null, '', `#${targetView.replace('view-', '')}`);
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        const targetView = `view-${hash}`;
        if ($(`#${targetView}`)) {
            navigateTo(targetView, false);
        }
    });
}

function injectCodeStudioNav() {
    const sidebarNav = $('.sidebar-nav ul');
    const mobileNav = $('.mobile-nav ul');

    const codeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

    // Add to Sidebar
    if (sidebarNav && !$('[data-target="view-share"]')) {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#share" class="nav-link" data-target="view-share">
                ${codeIcon}
                <span class="nav-label">Code Studio</span>
            </a>
        `;
        // Insert before Lab
        const labLink = $('[data-target="view-lab"]').closest('li');
        sidebarNav.insertBefore(li, labLink);
    }

    // Add to Mobile Nav (replace Share)
    if (mobileNav) {
        const shareLink = mobileNav.querySelector('a[href="#share"]');
        if (shareLink) shareLink.remove();

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#share" class="nav-link" data-target="view-share">
                ${codeIcon}
                <span>Code</span>
            </a>
        `;
        const labLink = mobileNav.querySelector('a[href="#lab"]').closest('li');
        mobileNav.insertBefore(li, labLink);
    }
}

function navigateTo(viewId, updateState = true) {
    // Hide all views
    $$('.view').forEach(view => view.classList.remove('active'));
    
    // Show target view
    const targetView = $(`#${viewId}`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Update active nav links
        $$('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === viewId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        // Re-trigger animations for CSS
        targetView.style.animation = 'none';
        targetView.offsetHeight; // trigger reflow
        targetView.style.animation = null;

        if (updateState) {
            AppState.currentView = viewId;
            saveState();
        }

        // Initialize specific view logic
        if (viewId === 'view-viva') renderVivaArena();
        if (viewId === 'view-revision') renderRevisionSpace();
        if (viewId === 'view-share') renderCodeStudio();
        if (viewId === 'view-lab') renderVisualLab();
        if (viewId === 'view-universe') renderSubjectUniverse();
    }
}

/* ==========================================================================
   5. View: Home & Dashboard
   ========================================================================== */
function renderHome() {
    const container = $('.floating-subjects-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Map DB subjects to UI cards
    DB.subjects.forEach((subj, index) => {
        // Determine positioning class based on index to match reference layout
        const classes = ['cpp-card', 'verilog-card', 'digital-logic-card', 'git-card'];
        const layoutClass = classes[index % classes.length];
        
        const btn = document.createElement('button');
        btn.className = `subject-float-card ${layoutClass}`;
        btn.dataset.subjectId = subj.id;
        btn.innerHTML = `
            <div class="card-icon" style="color: var(--accent-${subj.color});">${subj.icon}</div>
            <span class="card-text">${subj.name}</span>
        `;
        
        btn.addEventListener('click', () => {
            navigateTo('view-universe');
            history.pushState(null, '', '#universe');
        });

        container.appendChild(btn);
    });
}

/* ==========================================================================
   6. View: Subject Universe
   ========================================================================== */
function renderSubjectUniverse() {
    const container = $('#subject-universe-graph');
    const svgLines = $('#universe-lines');
    
    if (!container || !svgLines) return;

    // Clear existing dynamic nodes and lines
    $$('.universe-node', container).forEach(n => n.remove());
    svgLines.innerHTML = '';

    // Layout nodes in a circle for simplicity and visual balance
    const centerX = 50;
    const centerY = 50;
    const radius = 35; // percentage radius

    const nodePositions = {};

    DB.subjects.forEach((subj, i) => {
        const angle = (i / DB.subjects.length) * (2 * Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        nodePositions[subj.id] = { x, y };

        const btn = document.createElement('button');
        btn.className = 'universe-node';
        btn.textContent = subj.name;
        btn.style.setProperty('--x', `${x}%`);
        btn.style.setProperty('--y', `${y}%`);
        btn.dataset.nodeId = subj.id;
        
        // Hover effect to highlight links (requires JS to update SVG paths)
        container.appendChild(btn);
    });

    // Draw connections (SVG Lines)
    // SVG requires pixel values, so we calculate based on viewBox (0 0 100 100)
    svgLines.setAttribute('viewBox', '0 0 100 100');
    svgLines.setAttribute('preserveAspectRatio', 'none');

    DB.subjects.forEach(subj => {
        subj.links.forEach(linkId => {
            if (nodePositions[linkId]) {
                const start = nodePositions[subj.id];
                const end = nodePositions[linkId];
                
                // Draw line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', start.x);
                line.setAttribute('y1', start.y);
                line.setAttribute('x2', end.x);
                line.setAttribute('y2', end.y);
                line.setAttribute('stroke', 'rgba(255, 255, 255, 0.15)');
                line.setAttribute('stroke-width', '0.5');
                line.setAttribute('marker-end', 'url(#arrow)'); // Optional if we add markers
                
                // Add subtle glow
                line.style.filter = 'drop-shadow(0 0 2px rgba(0, 229, 255, 0.3))';
                
                svgLines.appendChild(line);
            }
        });
    });
}

/* ==========================================================================
   7. View: Viva Arena
   ========================================================================== */
function initVivaArena() {
    renderVivaArena();
}

function renderVivaArena() {
    const questionContainer = $('#viva-options-container');
    const questionText = $('.question-text');
    const timeline = $('#viva-timeline');
    
    if (!questionContainer || !questionText) return;

    const qIndex = AppState.viva.currentQuestionIndex;
    const questions = DB.vivaQuestions;

    // Reset state if quiz is complete
    if (qIndex >= questions.length) {
        renderVivaResults();
        return;
    }

    const q = questions[qIndex];
    
    // Update Question Text
    questionText.textContent = q.question;
    
    // Render Options
    questionContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'viva-option-btn';
        btn.dataset.optionIndex = index;
        btn.innerHTML = `
            <span class="option-text">${opt}</span>
            <svg class="option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        `;
        
        // Check if already selected (e.g., if we implement a check-then-next flow)
        // For this UI, we'll use a simple submit mechanism.
        
        btn.addEventListener('click', () => handleVivaSelection(index, btn, q.correctIndex));
        questionContainer.appendChild(btn);
    });

    // Update Timeline
    updateTimeline(qIndex);
}

function handleVivaSelection(selectedIndex, btnElement, correctIndex) {
    // Disable all buttons to prevent multiple submissions
    const container = $('#viva-options-container');
    const allBtns = $$('.viva-option-btn', container);
    allBtns.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
    });

    // Highlight selected
    btnElement.classList.add('selected');

    const isCorrect = selectedIndex === correctIndex;
    
    if (isCorrect) {
        btnElement.style.borderColor = 'var(--accent-cyan)';
        btnElement.style.background = 'rgba(0, 229, 255, 0.1)';
        AppState.viva.score++;
        showToast('Correct!', 'success');
    } else {
        btnElement.style.borderColor = 'var(--accent-pink)';
        btnElement.style.background = 'rgba(255, 0, 127, 0.1)';
        
        // Highlight correct answer
        allBtns[correctIndex].style.borderColor = 'var(--accent-cyan)';
        allBtns[correctIndex].style.background = 'rgba(0, 229, 255, 0.1)';
        showToast('Incorrect.', 'error');
    }

    // Show explanation and Next button
    const questionCard = $('.question-card');
    let explanationDiv = $('#viva-explanation');
    if (!explanationDiv) {
        explanationDiv = document.createElement('div');
        explanationDiv.id = 'viva-explanation';
        explanationDiv.style.cssText = 'margin-top: 20px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid var(--accent-cyan);';
        questionCard.appendChild(explanationDiv);
    }
    
    explanationDiv.innerHTML = `
        <p style="margin-bottom: 12px; color: var(--text-secondary);"><strong>Explanation:</strong> ${DB.vivaQuestions[AppState.viva.currentQuestionIndex].explanation}</p>
        <button id="next-question-btn" class="btn btn-primary" style="width: 100%;">Next Question</button>
    `;

    $('#next-question-btn').addEventListener('click', () => {
        AppState.viva.currentQuestionIndex++;
        explanationDiv.remove();
        saveState();
        renderVivaArena();
    });
}

function updateTimeline(currentIndex) {
    const timeline = $('#viva-timeline');
    if (!timeline) return;
    
    const milestones = $$('.timeline-milestone', timeline);
    milestones.forEach((m, i) => {
        if (i <= currentIndex) {
            m.classList.add('active');
        } else {
            m.classList.remove('active');
        }
    });
}

function renderVivaResults() {
    const questionCard = $('.question-card');
    const container = $('#viva-options-container');
    
    if (questionCard && container) {
        questionCard.style.display = 'none';
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <h2 style="font-size: 2rem; margin-bottom: 16px; color: var(--accent-cyan);">Arena Complete!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 24px;">You scored ${AppState.viva.score} out of ${DB.vivaQuestions.length}</p>
                <button id="restart-viva" class="btn btn-primary" style="max-width: 200px; margin: 0 auto;">Restart Arena</button>
            </div>
        `;
        container.style.display = 'block';

        $('#restart-viva').addEventListener('click', () => {
            AppState.viva = { currentQuestionIndex: 0, score: 0, completed: false, answeredQuestions: [] };
            saveState();
            questionCard.style.display = 'block';
            container.style.display = 'grid'; // Restore grid layout
            renderVivaArena();
        });
    }
}

/* ==========================================================================
   8. View: Revision Space
   ========================================================================== */
function initRevisionSpace() {
    renderRevisionSpace();
    
    // Search functionality
    const searchInput = $('#revision-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterRevisionCards(query);
        });
    }
}

function renderRevisionSpace() {
    const container = $('#revision-cards-container');
    if (!container) return;

    container.innerHTML = '';

    DB.revisionNotes.forEach(note => {
        const progress = AppState.revision.progress[note.id] || 0;
        const isBookmarked = AppState.revision.bookmarks.includes(note.id);

        const card = document.createElement('article');
        card.className = 'glass-card concept-card';
        card.dataset.conceptId = note.id;
        card.dataset.searchTerms = `${note.title} ${note.category} ${note.description}`.toLowerCase();

        card.innerHTML = `
            <header class="card-header">
                <h3 class="card-title">${note.title}</h3>
                <button type="button" class="icon-btn kebab-menu bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" aria-label="Bookmark ${note.title}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" style="${isBookmarked ? 'fill: var(--accent-cyan); stroke: var(--accent-cyan);' : ''}">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
            </header>
            <p class="card-description">${note.description}</p>
            
            <div class="card-actions">
                <button type="button" class="action-row toggle-notes" data-target="notes-${note.id}">
                    <span>Notes</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div id="notes-${note.id}" class="expandable-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 4px; font-size: 0.85rem; margin-bottom: 8px;">
                    ${note.notes}
                </div>
                <button type="button" class="action-row toggle-notes" data-target="mistakes-${note.id}">
                    <span>Common Mistakes</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div id="mistakes-${note.id}" class="expandable-content" style="display: none; padding: 10px; background: rgba(255,0,0,0.1); border-radius: 4px; font-size: 0.85rem; margin-bottom: 8px; color: #ffb3b3;">
                    ${note.mistakes}
                </div>
            </div>

            <div class="card-footer">
                <div class="card-progress">
                    <span class="progress-label">Progress</span>
                    <span class="progress-numbers">${progress} / ${note.totalSteps}</span>
                </div>
                <div class="progress-track" style="margin-bottom: 16px;">
                    <div class="progress-fill" style="width: ${(progress / note.totalSteps) * 100}%;"></div>
                </div>
                <button type="button" class="btn btn-primary btn-block test-yourself-btn" data-action="test-concept">Test Yourself</button>
            </div>
        `;

        container.appendChild(card);
    });

    // Attach event listeners
    attachRevisionEvents();
}

function attachRevisionEvents() {
    const container = $('#revision-cards-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        // Toggle Notes/Mistakes
        const toggleBtn = e.target.closest('.toggle-notes');
        if (toggleBtn) {
            const targetId = toggleBtn.dataset.target;
            const content = $(`#${targetId}`);
            if (content) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                toggleBtn.querySelector('svg').style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
            }
        }

        // Bookmark toggle
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            const card = bookmarkBtn.closest('.concept-card');
            const id = card.dataset.conceptId;
            
            const index = AppState.revision.bookmarks.indexOf(id);
            if (index > -1) {
                AppState.revision.bookmarks.splice(index, 1);
                bookmarkBtn.classList.remove('bookmarked');
                bookmarkBtn.querySelector('svg').style.fill = 'none';
                bookmarkBtn.querySelector('svg').style.stroke = 'currentColor';
            } else {
                AppState.revision.bookmarks.push(id);
                bookmarkBtn.classList.add('bookmarked');
                bookmarkBtn.querySelector('svg').style.fill = 'var(--accent-cyan)';
                bookmarkBtn.querySelector('svg').style.stroke = 'var(--accent-cyan)';
            }
            saveState();
        }

        // Test Yourself (Simulate progress)
        const testBtn = e.target.closest('.test-yourself-btn');
        if (testBtn) {
            const card = testBtn.closest('.concept-card');
            const id = card.dataset.conceptId;
            
            // Simulate a test: increment progress by 10, cap at total
            const note = DB.revisionNotes.find(n => n.id === id);
            let current = AppState.revision.progress[id] || 0;
            current = Math.min(current + 10, note.totalSteps);
            AppState.revision.progress[id] = current;
            saveState();
            
            // Update UI
            const progressText = card.querySelector('.progress-numbers');
            const progressFill = card.querySelector('.progress-fill');
            progressText.textContent = `${current} / ${note.totalSteps}`;
            progressFill.style.width = `${(current / note.totalSteps) * 100}%`;

            showToast(`Progress updated for ${note.title}!`, 'success');
        }
    });
}

function filterRevisionCards(query) {
    const cards = $$('.concept-card', $('#revision-cards-container'));
    let visibleCount = 0;

    cards.forEach(card => {
        const searchTerms = card.dataset.searchTerms;
        if (searchTerms.includes(query)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Handle empty state
    let emptyState = $('#revision-empty-state');
    if (visibleCount === 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'revision-empty-state';
            emptyState.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);';
            emptyState.textContent = 'No concepts found matching your search.';
            $('#revision-cards-container').appendChild(emptyState);
        }
    } else if (emptyState) {
        emptyState.remove();
    }
}

/* ==========================================================================
   9. View: Code Studio (Injected into #view-share)
   ========================================================================== */
function renderCodeStudio() {
    const container = $('#view-share');
    if (!container) return;

    // Inject Layout if not already present
    if (!container.querySelector('.code-studio-layout')) {
        container.innerHTML = `
            <div class="section-heading-group" style="margin-bottom: var(--space-xl);">
                <h2 class="section-title">Code Studio</h2>
                <p class="section-subtitle">Interactive programs & expected outputs</p>
            </div>
            
            <div class="code-studio-layout" style="display: grid; grid-template-columns: 300px 1fr; gap: var(--space-xl); min-height: 500px;">
                <aside class="code-sidebar glass-card" style="padding: var(--space-md);">
                    <h3 style="margin-bottom: var(--space-md); padding-left: 8px;">Programs</h3>
                    <ul id="code-program-list" style="display: flex; flex-direction: column; gap: 4px;">
                        <!-- List items injected by JS -->
                    </ul>
                </aside>
                
                <main class="code-main glass-card" style="padding: 0; display: flex; flex-direction: column; overflow: hidden;">
                    <header style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle); background: rgba(0,0,0,0.2);">
                        <h3 id="active-program-title" style="font-size: 1.1rem;">Loading...</h3>
                        <button id="copy-code-btn" class="btn btn-secondary btn-sm" aria-label="Copy code">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" style="margin-right: 6px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Copy
                        </button>
                    </header>
                    
                    <div id="active-code-block" style="flex: 1; background: #1E1E1E; padding: var(--space-lg); overflow-y: auto; overflow-x: auto; border-bottom-left-radius: var(--radius-lg); border-bottom-right-radius: var(--radius-lg);">
                        <!-- Code injected here -->
                    </div>

                    <div style="padding: var(--space-lg); background: var(--bg-surface-elevated); border-top: 1px solid var(--border-subtle); border-bottom-left-radius: var(--radius-lg); border-bottom-right-radius: var(--radius-lg);">
                        <h4 style="color: var(--accent-cyan); margin-bottom: 8px; font-size: 0.9rem;">Explanation & Output</h4>
                        <p id="active-code-explanation" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px;"></p>
                        <div style="padding: 12px; background: rgba(0,0,0,0.5); border-radius: var(--radius-sm); border-left: 3px solid var(--accent-cyan);">
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 4px;">Expected Output</span>
                            <code id="active-code-output" style="color: #D4D4D4; font-family: monospace; font-size: 0.9rem;"></code>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }

    // Render List
    const list = $('#code-program-list');
    list.innerHTML = '';
    DB.codePrograms.forEach(prog => {
        const li = document.createElement('li');
        const isActive = AppState.codeStudio.activeProgramId === prog.id;
        li.innerHTML = `
            <button class="action-row ${isActive ? 'active' : ''}" data-prog-id="${prog.id}" style="width: 100%; border: 1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}; background: ${isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent'}; color: ${isActive ? 'var(--text-primary)' : 'var(--text-secondary)'};">
                <span style="font-weight: 500;">${prog.title}</span>
            </button>
        `;
        list.appendChild(li);
    });

    // Load Active Program
    loadProgram(AppState.codeStudio.activeProgramId);

    // Attach Event Listeners
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-prog-id]');
        if (btn) {
            const progId = btn.dataset.progId;
            AppState.codeStudio.activeProgramId = progId;
            saveState();
            renderCodeStudio(); // Re-render to update active states
        }
    });

    $('#copy-code-btn').addEventListener('click', () => {
        const codeText = $('#active-code-block').innerText;
        navigator.clipboard.writeText(codeText).then(() => {
            showToast('Code copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy code.', 'error');
        });
    });
}

function loadProgram(id) {
    const prog = DB.codePrograms.find(p => p.id === id);
    if (!prog) return;

    $('#active-program-title').textContent = prog.title;
    $('#active-code-block').innerHTML = highlightCode(prog.code, prog.language);
    $('#active-code-explanation').textContent = prog.explanation;
    $('#active-code-output').textContent = prog.output;
}

/* ==========================================================================
   10. View: Visual Lab (Injected into #view-lab)
   ========================================================================== */
function renderVisualLab() {
    const container = $('#view-lab');
    if (!container) return;

    if (!container.querySelector('.visual-lab-layout')) {
        container.innerHTML = `
            <div class="section-heading-group" style="margin-bottom: var(--space-xl);">
                <h2 class="section-title">Visual Lab</h2>
                <p class="section-subtitle">Interactive Algorithm Visualizer</p>
            </div>

            <div class="visual-lab-layout glass-card" style="padding: var(--space-xl);">
                <div class="lab-controls" style="display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); justify-content: center;">
                    <button id="lab-reset-btn" class="btn btn-secondary">Reset Array</button>
                    <button id="lab-play-btn" class="btn btn-primary">Start Sorting</button>
                </div>
                
                <div id="lab-canvas" style="display: flex; align-items: flex-end; justify-content: center; gap: 8px; height: 300px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
                    <!-- Bars injected here -->
                </div>
                
                <div style="text-align: center; margin-top: var(--space-md); color: var(--text-muted); font-size: 0.9rem;">
                    Algorithm: Bubble Sort (O(n²))
                </div>
            </div>
        `;
    }

    const canvas = $('#lab-canvas');
    let array = [];
    let isSorting = false;

    function generateArray() {
        array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 80) + 10); // Values 10-90
        renderBars();
    }

    function renderBars(activeIndices = []) {
        canvas.innerHTML = '';
        array.forEach((val, i) => {
            const bar = document.createElement('div');
            bar.style.height = `${val}%`;
            bar.style.width = '20px';
            bar.style.backgroundColor = 'var(--accent-cyan)';
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.transition = 'height 0.2s ease, background-color 0.2s ease';
            
            if (activeIndices.includes(i)) {
                bar.style.backgroundColor = 'var(--accent-pink)';
                bar.style.boxShadow = '0 0 10px var(--accent-pink)';
            }

            canvas.appendChild(bar);
        });
    }

    async function bubbleSort() {
        if (isSorting) return;
        isSorting = true;
        const playBtn = $('#lab-play-btn');
        playBtn.disabled = true;
        playBtn.textContent = 'Sorting...';

        const n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Highlight
                renderBars([j, j + 1]);
                await new Promise(r => setTimeout(r, 50)); // Delay for animation

                if (array[j] > array[j + 1]) {
                    // Swap
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    renderBars([j, j + 1]);
                    await new Promise(r => setTimeout(r, 50));
                }
            }
        }
        
        renderBars(); // Final clean render
        playBtn.disabled = false;
        playBtn.textContent = 'Start Sorting';
        isSorting = false;
        showToast('Sorting complete!', 'success');
    }

    // Initialize
    generateArray();

    // Event Listeners
    $('#lab-reset-btn').addEventListener('click', () => {
        if (isSorting) return;
        generateArray();
    });

    $('#lab-play-btn').addEventListener('click', bubbleSort);
}

/* ==========================================================================
   11. Global Search (Optional but functional)
   ========================================================================== */
function initGlobalSearch() {
    const searchBtn = $('#sidebar-search-btn');
    const mobileSearchBtn = $('#mobile-search-trigger');
    
    const handleSearch = () => {
        // For simplicity, focus on the revision search if we are in that view
        // Or navigate to revision and focus the input
        navigateTo('view-revision');
        history.pushState(null, '', '#revision');
        setTimeout(() => {
            const input = $('#revision-search-input');
            if (input) input.focus();
        }, 100);
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', handleSearch);
}

/* ==========================================================================
   12. Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load State
    loadState();

    // 2. Setup Navigation
    initNavigation();

    // 3. Render Initial Content
    renderHome();
    initGlobalSearch();

    // 4. Handle Initial Route (from hash or saved state)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const targetView = `view-${hash}`;
        if ($(`#${targetView}`)) {
            navigateTo(targetView);
        } else {
            navigateTo(AppState.currentView);
        }
    } else {
        // Restore previous view if no hash
        navigateTo(AppState.currentView);
    }

    // 5. Initialize View Specific Modules
    initVivaArena();
    initRevisionSpace();
}); 