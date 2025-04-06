class SocialShare {
    constructor() {
        this.platforms = {
            twitter: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: (text, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            facebook: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            email: (text, url) => `mailto:?subject=${encodeURIComponent('Check out this business idea I found')}&body=${encodeURIComponent(text + '\n\n' + url)}`
        };
    }
    
    createShareButton(platform, text, url) {
        if (!this.platforms[platform]) return null;
        
        const button = document.createElement('button');
        button.className = `share-btn ${platform}`;
        button.innerHTML = `<span class="share-icon">${this.getIcon(platform)}</span>`;
        button.title = `Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(
                this.platforms[platform](text, url),
                'share-dialog',
                'width=600,height=400'
            );
        });
        
        return button;
    }
    
    createShareBar(text, url) {
        const shareBar = document.createElement('div');
        shareBar.className = 'share-bar';
        
        const shareText = document.createElement('span');
        shareText.className = 'share-text';
        shareText.textContent = 'Share this idea:';
        shareBar.appendChild(shareText);
        
        for (const platform of ['twitter', 'linkedin', 'facebook', 'email']) {
            const button = this.createShareButton(platform, text, url);
            if (button) shareBar.appendChild(button);
        }
        
        return shareBar;
    }
    
    getIcon(platform) {
        // Simple text icons for the MVP
        const icons = {
            twitter: '𝕏',
            linkedin: 'in',
            facebook: 'f',
            email: '✉'
        };
        
        return icons[platform] || '';
    }
}