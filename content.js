// Wait for the DOM to be ready and for the toolbar to be present
function insertButton() {
    // Find the main toolbar container
    const toolbar = document.querySelector('.pr-review-tools');
    if (!toolbar) return;

    // Find the 'files viewed' span
    const filesViewedSpan = Array.from(toolbar.querySelectorAll('span')).find(el => /files? viewed/i.test(el.textContent));

    // Find the Copilot button by id
    const copilotDiv = Array.from(toolbar.querySelectorAll('div')).find(div => div.querySelector('#copilot-diff-header-button'));

    // Find the 'Review changes' button
    const reviewBtn = document.getElementById('overlay-show-review-changes-modal');

    // Only insert if both are found and not already inserted
    if (filesViewedSpan && copilotDiv && reviewBtn && !document.getElementById('my-gh-pr-btn')) {
        // Clone the 'Review changes' button
        const btn = reviewBtn.cloneNode(true);
        btn.id = 'my-gh-pr-btn';
        // Change the label text
        const label = btn.querySelector('.js-review-changes');
        if (label) label.textContent = 'My Button';
        // Remove attributes that may interfere
        btn.removeAttribute('popovertarget');
        btn.removeAttribute('aria-haspopup');
        btn.removeAttribute('data-hotkey');
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
