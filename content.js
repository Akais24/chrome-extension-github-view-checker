// Wait for the DOM to be ready and for the toolbar to be present
function insertButton() {
    // Find the main toolbar container
    const toolbar = document.querySelector('.pr-review-tools');
    if (!toolbar) return;

    // Find the 'files viewed' span
    const filesViewedSpan = Array.from(toolbar.querySelectorAll('span')).find(el => /files? viewed/i.test(el.textContent));

    // Find the Copilot button by id
    const copilotDiv = Array.from(toolbar.querySelectorAll('div')).find(div => div.querySelector('#copilot-diff-header-button'));

    // Only insert if both are found and not already inserted
    if (filesViewedSpan && copilotDiv && !document.getElementById('my-gh-pr-btn')) {
        const btn = document.createElement('button');
        btn.id = 'my-gh-pr-btn';
        btn.textContent = 'My Button';
        btn.style.margin = '0 8px';
        // Try to copy Copilot button style if possible
        const copilotBtn = copilotDiv.querySelector('button');
        if (copilotBtn) btn.className = copilotBtn.className;
        btn.onclick = () => console.log('My Button clicked!');
        // Insert the button after filesViewedSpan and before copilotDiv
        toolbar.insertBefore(btn, copilotDiv);
    }
}

// Observe DOM changes in case toolbar loads late
const observer = new MutationObserver(insertButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial try
insertButton();
