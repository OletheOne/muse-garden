class SimpleAnalytics {
    constructor() {
        this.storageKey = 'muse-garden-analytics';
        this.data = this.loadData();
    }
    
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing analytics data', e);
                return this.initializeData();
            }
        }
        return this.initializeData();
    }
    
    initializeData() {
        return {
            firstVisit: new Date().toISOString(),
            visits: 0,
            lastVisit: null,
            actions: {
                ideasGenerated: 0,
                ideasAnalyzed: 0,
                ideasSaved: 0,
                waitlistJoins: 0,
                ideaShares: 0
            },
            pageViews: {
                home: 0,
                generator: 0,
                blog: 0
            }
        };
    }
    
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }
    
    recordVisit(page) {
        this.data.visits++;
        this.data.lastVisit = new Date().toISOString();
        
        if (page in this.data.pageViews) {
            this.data.pageViews[page]++;
        }
        
        this.saveData();
    }
    
    recordAction(action) {
        if (action in this.data.actions) {
            this.data.actions[action]++;
            this.saveData();
        }
    }
    
    getReport() {
        const daysSinceFirst = Math.floor((new Date() - new Date(this.data.firstVisit)) / (1000 * 60 * 60 * 24));
        
        return {
            daysSinceFirstVisit: daysSinceFirst,
            totalVisits: this.data.visits,
            actionsPerVisit: this.data.visits > 0 ? 
                (this.data.actions.ideasGenerated + this.data.actions.ideasAnalyzed + this.data.actions.ideasSaved) / this.data.visits : 0,
            conversionRate: this.data.actions.ideasGenerated > 0 ? 
                (this.data.actions.ideasSaved / this.data.actions.ideasGenerated) * 100 : 0,
            mostViewedPage: Object.entries(this.data.pageViews).sort((a, b) => b[1] - a[1])[0][0],
            ...this.data
        };
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new SimpleAnalytics();
    
    // Record page view
    const pagePath = window.location.pathname;
    let page = 'other';
    
    if (pagePath.includes('index.html') || pagePath.endsWith('/')) {
        page = 'generator';
    } else if (pagePath.includes('landing.html')) {
        page = 'home';
    } else if (pagePath.includes('blog.html')) {
        page = 'blog';
    }
    
    window.analytics.recordVisit(page);
    
    // Add event listeners for analytics
    if (page === 'generator') {
        const generateBtn = document.getElementById('generate-btn');
        const analyzeBtn = document.getElementById('analyze-btn');
        const saveBtn = document.getElementById('save-btn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                window.analytics.recordAction('ideasGenerated');
            });
        }
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                window.analytics.recordAction('ideasAnalyzed');
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                window.analytics.recordAction('ideasSaved');
            });
        }
    }
    
    // Track waitlist joins
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', () => {
            window.analytics.recordAction('waitlistJoins');
        });
    }
    
    // Track shares
    document.addEventListener('click', (e) => {
        if (e.target.closest('.share-btn')) {
            window.analytics.recordAction('ideaShares');
        }
    });
});