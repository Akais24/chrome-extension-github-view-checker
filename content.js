// List of example regular expressions
const regexList = [
    { label: '/^capnp\/.*\\.capnp\\.go$/', checked: false },
    { label: '/^capnp\/.*\\.capnp\\.map\\.go$/', checked: false },
    { label: '/^capnp\/.*\\.handler\\.go$/', checked: false },
    { label: '/^common\/testtransport\//', checked: false },
];

function createModal() {
    if (document.getElementById('my-gh-pr-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'my-gh-pr-modal';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#fff';
    modal.style.border = '1px solid #d0d7de';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 32px rgba(0,0,0,0.15)';
    modal.style.padding = '24px 20px 16px 20px';
    modal.style.zIndex = '9999';
    modal.style.minWidth = '320px';

    // Modal content
    const title = document.createElement('h3');
    title.textContent = 'Select Regular Expressions';
    title.style.marginTop = '0';
    modal.appendChild(title);

    // List of regexes with checkboxes
    regexList.forEach((regex, idx) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.marginBottom = '8px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = regex.checked;
        checkbox.style.marginRight = '8px';
        checkbox.onchange = (e) => { regexList[idx].checked = e.target.checked; };
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(regex.label));
        modal.appendChild(label);
    });

    // 'Mark as viewed' button
    const markBtn = document.createElement('button');
    markBtn.textContent = 'Mark as viewed';
    markBtn.style.background = '#295ea8';
    markBtn.style.color = '#fff';
    markBtn.style.border = 'none';
    markBtn.style.borderRadius = '6px';
    markBtn.style.padding = '8px 16px';
    markBtn.style.marginTop = '12px';
    markBtn.style.cursor = 'pointer';
    markBtn.onclick = () => {
        // Placeholder for future logic
        alert('Marked as viewed for selected regexes!');
        document.body.removeChild(modal);
    };
    modal.appendChild(markBtn);

    // Close modal on outside click
    modal.addEventListener('click', e => e.stopPropagation());
    setTimeout(() => {
        document.body.addEventListener('click', function handler() {
            if (document.getElementById('my-gh-pr-modal')) {
                document.body.removeChild(modal);
            }
            document.body.removeEventListener('click', handler);
        });
    }, 0);

    document.body.appendChild(modal);
}

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
        btn.onclick = (e) => {
            e.stopPropagation();
            createModal();
        };
        // Add margin to the right for spacing
        btn.style.marginRight = '8px';
        // Set custom background color (even darker blue)
        btn.style.backgroundColor = '#295ea8';
        btn.style.borderColor = '#295ea8';
        btn.style.color = '#fff';
        // Insert the button immediately before the 'Review changes' button in its parent
        reviewBtn.parentNode.insertBefore(btn, reviewBtn);
    }
}

// Observe DOM changes in case toolbar loads late
const observer = new MutationObserver(insertButton);
observer.observe(document.body, { childList: true, subtree: true });

// Initial try
insertButton();
