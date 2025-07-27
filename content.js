// List of example regular expressions
const regexList = [
    { label: '/^capnp/.*.capnp.go$/', checked: false },
    { label: '/^capnp/.*.capnp.map.go$/', checked: false },
    { label: '/^capnp/.*.handler.go$/', checked: false },
    { label: '/^common/testtransport//', checked: false },
];

function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getPRFilePaths() {
    // GitHub PR file list: file paths are in elements with 'data-tagsearch-path' or in the file tree
    // We'll try to get all file paths from the file list sidebar
    const fileLinks = document.querySelectorAll('[data-tagsearch-path], .js-tree-browser-panel [title]');
    const paths = new Set();
    fileLinks.forEach(link => {
        let path = link.getAttribute('data-tagsearch-path') || link.getAttribute('title');
        if (path) paths.add(path);
    });
    // Fallback: try to get from file headers in the diff view
    if (paths.size === 0) {
        document.querySelectorAll('.file-info a, .file-header .Link--primary').forEach(a => {
            if (a.textContent) paths.add(a.textContent.trim());
        });
    }
    return Array.from(paths);
}

function getRegexMatchCounts(paths) {
    return regexList.map(r => {
        let pattern = r.label;
        // Remove leading/trailing slashes for new RegExp
        let regexBody = pattern.replace(/^\/(.*)\/$/, '$1');
        let regex;
        try {
            regex = new RegExp(regexBody);
        } catch {
            return 0;
        }
        return paths.filter(p => regex.test(p)).length;
    });
}

function createModal() {
    if (document.getElementById('my-gh-pr-modal-overlay')) return;

    // Get file paths and match counts
    const filePaths = getPRFilePaths();
    const matchCounts = getRegexMatchCounts(filePaths);

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'my-gh-pr-modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = isDarkMode() ? 'rgba(22, 27, 34, 0.6)' : 'rgba(27, 31, 35, 0.5)';
    overlay.style.zIndex = '9998';

    // Modal
    const modal = document.createElement('div');
    modal.id = 'my-gh-pr-modal';
    modal.style.position = 'absolute';
    modal.style.zIndex = '9999';
    modal.style.minWidth = '360px';
    modal.style.fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`;
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.maxWidth = '90vw';
    modal.style.borderRadius = '12px';
    modal.style.boxShadow = '0 8px 24px rgba(149, 157, 165, 0.2)';
    modal.style.padding = '0';
    modal.style.border = isDarkMode() ? '1px solid #30363d' : '1px solid #d0d7de';
    modal.style.background = isDarkMode() ? '#22272e' : '#fff';
    modal.style.color = isDarkMode() ? '#c9d1d9' : '#24292f';

    // Position modal so its right edge aligns with the button's right edge
    const btn = document.getElementById('my-gh-pr-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        // Temporarily add modal to body to measure its width
        modal.style.visibility = 'hidden';
        document.body.appendChild(modal);
        const modalWidth = modal.offsetWidth || 360;
        document.body.removeChild(modal);
        modal.style.visibility = '';
        modal.style.left = (rect.right - modalWidth) + 'px';
        modal.style.top = (rect.bottom + window.scrollY + 8) + 'px'; // 8px gap
    } else {
        // fallback to center if button not found
        modal.style.position = 'fixed';
        modal.style.left = '50%';
        modal.style.top = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
    }

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '16px 24px 12px 24px';
    header.style.borderBottom = isDarkMode() ? '1px solid #30363d' : '1px solid #d8dee4';

    const title = document.createElement('h3');
    title.textContent = 'Select Regular Expressions';
    title.style.margin = '0';
    title.style.fontSize = '18px';
    title.style.fontWeight = '600';
    title.style.lineHeight = '1.25';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.fontSize = '24px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = isDarkMode() ? '#8b949e' : '#57606a';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.style.padding = '20px 24px 0 24px';
    regexList.forEach((regex, idx) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.marginBottom = '12px';
        label.style.fontSize = '15px';
        label.style.color = isDarkMode() ? '#c9d1d9' : '#24292f';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = regex.checked;
        checkbox.style.marginRight = '10px';
        checkbox.onchange = (e) => { regexList[idx].checked = e.target.checked; };
        label.appendChild(checkbox);
        // Add regex label and match count
        const regexText = document.createElement('span');
        regexText.textContent = `${regex.label} (${matchCounts[idx]})`;
        regexText.style.flex = '1';
        label.appendChild(regexText);
        content.appendChild(label);
    });
    modal.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'flex-end';
    footer.style.alignItems = 'center';
    footer.style.padding = '16px 24px';
    footer.style.borderTop = isDarkMode() ? '1px solid #30363d' : '1px solid #d8dee4';
    footer.style.marginTop = '16px';

    // Unmark as viewed button
    const unmarkBtn = document.createElement('button');
    unmarkBtn.textContent = 'Unmark as viewed';
    unmarkBtn.style.background = isDarkMode() ? '#444c56' : '#eaecef';
    unmarkBtn.style.color = isDarkMode() ? '#c9d1d9' : '#24292f';
    unmarkBtn.style.border = 'none';
    unmarkBtn.style.borderRadius = '6px';
    unmarkBtn.style.padding = '8px 20px';
    unmarkBtn.style.fontSize = '15px';
    unmarkBtn.style.fontWeight = '600';
    unmarkBtn.style.cursor = 'pointer';
    unmarkBtn.style.marginRight = '8px';
    unmarkBtn.onclick = () => {
        // Unmark files as viewed for checked regexes
        const checkedRegexes = regexList
            .map((r, i) => ({ regex: r.label, checked: regexList[i].checked }))
            .filter(r => r.checked)
            .map(r => {
                let regexBody = r.regex.replace(/^\/(.*)\/$/, '$1');
                try {
                    return new RegExp(regexBody);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        document.querySelectorAll('div.file-header[data-path]').forEach(header => {
            const filePath = header.getAttribute('data-path');
            if (
                filePath &&
                checkedRegexes.some(regex => regex.test(filePath))
            ) {
                const checkbox = header.querySelector('input.js-reviewed-checkbox[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    checkbox.click();
                }
            }
        });
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };
    footer.appendChild(unmarkBtn);

    const markBtn = document.createElement('button');
    markBtn.textContent = 'Mark as viewed';
    markBtn.style.background = isDarkMode() ? '#388bfd' : '#295ea8';
    markBtn.style.color = '#fff';
    markBtn.style.border = 'none';
    markBtn.style.borderRadius = '6px';
    markBtn.style.padding = '8px 20px';
    markBtn.style.fontSize = '15px';
    markBtn.style.fontWeight = '600';
    markBtn.style.cursor = 'pointer';
    markBtn.onclick = () => {
        // Mark files as viewed for checked regexes
        const checkedRegexes = regexList
            .map((r, i) => ({ regex: r.label, checked: regexList[i].checked }))
            .filter(r => r.checked)
            .map(r => {
                // Remove leading/trailing slashes for new RegExp
                let regexBody = r.regex.replace(/^\/(.*)\/$/, '$1');
                try {
                    return new RegExp(regexBody);
                } catch {
                    return null;
                }
            })
            .filter(Boolean);
        document.querySelectorAll('div.file-header[data-path]').forEach(header => {
            const filePath = header.getAttribute('data-path');
            if (
                filePath &&
                checkedRegexes.some(regex => regex.test(filePath))
            ) {
                const checkbox = header.querySelector('input.js-reviewed-checkbox[type="checkbox"]');
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                }
            }
        });
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };
    footer.appendChild(markBtn);
    modal.appendChild(footer);

    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Close modal on overlay click
    overlay.onclick = () => {
        if (document.getElementById('my-gh-pr-modal')) document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };
}

// Wait for the DOM to be ready and for the toolbar to be present
function insertButton() {
    // Check if button already exists
    if (document.getElementById('my-gh-pr-btn')) return;

    // Find the main toolbar container
    const toolbar = document.querySelector('.pr-review-tools');
    if (!toolbar) return;

    // Find the 'Review changes' button (this is the most reliable anchor)
    const reviewBtn = document.getElementById('overlay-show-review-changes-modal');
    if (!reviewBtn) return;

    // Insert button with minimal requirements - only need toolbar and review button
    if (toolbar && reviewBtn) {
        // Create a new button element instead of cloning
        const btn = document.createElement('button');
        btn.id = 'my-gh-pr-btn';
        btn.textContent = 'View marker';
        btn.type = 'button';
        
        // Copy only the styling from the review button
        const computedStyle = window.getComputedStyle(reviewBtn);
        const stylesToCopy = [
            'padding', 'margin', 'border', 'borderRadius', 'fontSize', 'fontFamily', 
            'fontWeight', 'lineHeight', 'textAlign', 'cursor', 'display', 
            'alignItems', 'justifyContent', 'minHeight', 'boxSizing'
        ];
        
        stylesToCopy.forEach(property => {
            btn.style[property] = computedStyle[property];
        });
        
        // Copy CSS classes for consistent styling
        btn.className = reviewBtn.className;
        
        // Set custom styling
        btn.style.marginRight = '8px';
        btn.style.backgroundColor = '#295ea8';
        btn.style.borderColor = '#295ea8';
        btn.style.color = '#fff';
        
        // Add clean click handler
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            createModal();
        });
        
        // Insert the button immediately before the 'Review changes' button in its parent
        reviewBtn.parentNode.insertBefore(btn, reviewBtn);
    }
}

// Improved loading mechanism for GitHub's dynamic content
function waitForElements() {
    // Try multiple times with increasing delays
    const maxAttempts = 10;
    let attempts = 0;
    
    function tryInsert() {
        attempts++;
        insertButton();
        
        // If button was successfully inserted or max attempts reached, stop
        if (document.getElementById('my-gh-pr-btn') || attempts >= maxAttempts) {
            return;
        }
        
        // Try again with exponential backoff
        setTimeout(tryInsert, Math.min(100 * Math.pow(1.5, attempts), 2000));
    }
    
    // Start immediately
    tryInsert();
}

// Observe DOM changes in case toolbar loads late
const observer = new MutationObserver(() => {
    if (!document.getElementById('my-gh-pr-btn')) {
        insertButton();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Multiple initialization strategies
// 1. Immediate try
insertButton();

// 2. DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertButton);
} else {
    insertButton();
}

// 3. Window loaded
window.addEventListener('load', insertButton);

// 4. Delayed attempts for SPA loading
waitForElements();
