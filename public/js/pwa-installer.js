// PWA Installation Banner
document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const installBanner = document.createElement('div');
    installBanner.className = 'pwa-install-banner hidden';
    installBanner.innerHTML = `
        <div class="install-content">
            <div class="install-text">
                <strong>Install Muse Garden</strong>
                <p>Add to your home screen for easy access</p>
            </div>
            <div class="install-actions">
                <button class="install-btn">Install</button>
                <button class="dismiss-btn">Not Now</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Check if PWA is installable
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the install banner
        installBanner.classList.remove('hidden');
    });
    
    // Handle install button click
    document.querySelector('.install-btn').addEventListener('click', () => {
        installBanner.classList.add('hidden');
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
    
    // Handle dismiss button click
    document.querySelector('.dismiss-btn').addEventListener('click', () => {
        installBanner.classList.add('hidden');
    });
    
    // Check if app was successfully installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('Muse Garden was installed');
        installBanner.classList.add('hidden');
    });
});