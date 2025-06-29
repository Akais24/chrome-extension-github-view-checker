// Wait for the DOM to be ready and for the toolbar to be present
function insertButton() {
    // Find the toolbar containing the 'files viewed' and 'Ask Copilot' components
    const toolbar = document.querySelector('[data-testid="pr-files-toolbar"]');
    if (!toolbar) return;

    // Find the 'Ask Copilot' button
    const copilotBtn = Array.from(toolbar.querySelectorAll('button, summary')).find(el => el.textContent && el.textContent.includes('Copilot'));

    // Find the 'N / M files viewed' element
    const filesViewed = Array.from(toolbar.querySelectorAll('span')).find(el => /files? viewed/i.test(el.textContent));

    // Only insert if both are found and not already inserted
    if (filesViewed && copilotBtn && !document.getElementById('my-gh-pr-btn')) {
        const btn = document.createElement('button');
        btn.id = 'my-gh-pr-btn';
        btn.textContent = 'My Button';
        btn.style.margin = '0 8px';
        btn.className = copilotBtn.className; // Copy GitHub button style
        btn.onclick = () => console.log('My Button clicked!');
        // Insert after filesViewed and before copilotBtn
        filesViewed.parentNode.insertBefore(btn, copilotBtn);
    }
}

// Observe DOM changes in case toolbar loads late
const observer = new MutationObserver(insertButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial try
insertButton();
