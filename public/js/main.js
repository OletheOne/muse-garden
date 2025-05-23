// Initialize the social share functionality
// Removed duplicate declaration of 'socialShare'

document.addEventListener('DOMContentLoaded', () => {
    console.log('Muse Garden is awakening...');
    
    // Initialize the application
    initApp();
});

// Initialize the analyzer
// Removed duplicate declaration of 'analyzer'

function initApp() {
    const app = document.getElementById('app');
    
    // Create the initial interface
    app.innerHTML = `
        <div class="prompt-container">
            <h2>Welcome to your creative garden</h2>
            <p>Plant a seed of inspiration and watch ideas grow</p>
            <div class="controls">
                <button id="generate-btn" class="btn primary">Plant a Seed</button>
                <button id="analyze-btn" class="btn accent hidden">Analyze Potential</button>
                <button id="save-btn" class="btn secondary hidden">Save This Idea</button>
            </div>
            <div id="result" class="result-container hidden"></div>
            <div id="analysis" class="analysis-container hidden"></div>
            <div id="saved-ideas"></div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('generate-btn').addEventListener('click', generatePrompt);
    document.getElementById('save-btn').addEventListener('click', saveIdea);
    
    // Analysis button will be added when an idea is generated
    
    // Load saved ideas if any
    loadSavedIdeas();
}

// Creative prompt categories
const promptTypes = [
    "Digital Product",
    "Physical Product",
    "Service",
    "Content Creation",
    "Educational Resource",
    "Community Platform",
    "Productivity Tool",
    "Entertainment",
    "Wellness Solution"
];

// Creative prompt templates
const promptTemplates = [
    "A [type] that helps [audience] to [action] without [painPoint]",
    "A [type] that combines [concept1] with [concept2] to solve [problem]",
    "A [type] that transforms how [audience] approaches [activity]",
    "A [type] that makes [difficultThing] accessible to [audience]",
    "An innovative [type] that disrupts the traditional [industry] by [method]",
    "A [type] that automates [tediousTask] for [audience]",
    "A subscription-based [type] that provides [audience] with [value]",
    "A [type] that uses [technology] to enhance [everydayActivity]"
];

// Word banks for filling in templates
const wordBanks = {
    audience: ["freelancers", "parents", "students", "remote workers", "creators", "small business owners", "travelers", "professionals", "educators", "entrepreneurs", "artists", "researchers"],
    painPoint: ["wasting time", "high costs", "complexity", "information overload", "lack of personalization", "technical barriers", "inconsistency", "limited access"],
    action: ["organize information", "learn new skills", "connect with others", "make decisions", "save time", "increase productivity", "express creativity", "solve problems"],
    concept1: ["AI assistance", "gamification", "personalization", "automation", "social connection", "visual learning", "data analytics", "storytelling"],
    concept2: ["subscription model", "community feedback", "interactive challenges", "customizable templates", "progress tracking", "collaborative tools", "real-time updates"],
    problem: ["information overload", "decision fatigue", "skill development", "work-life balance", "digital overwhelm", "creative blocks", "technical complexity"],
    activity: ["learning", "working", "creating content", "managing projects", "planning", "analyzing data", "making decisions", "collaborating"],
    difficultThing: ["complex data", "technical skills", "creative processes", "expert knowledge", "time management", "resource allocation", "strategic planning"],
    industry: ["education", "content creation", "project management", "personal development", "data analysis", "creative work", "professional services"],
    method: ["simplifying the complex", "removing barriers", "connecting communities", "leveraging AI", "personalizing experiences", "automating repetitive tasks"],
    tediousTask: ["data entry", "scheduling", "formatting", "research", "repetitive workflows", "administrative tasks", "content organization"],
    value: ["curated resources", "expert insights", "time-saving tools", "exclusive templates", "community support", "personalized recommendations"],
    technology: ["AI", "automation", "data visualization", "voice recognition", "predictive analytics", "augmented reality", "natural language processing"],
    everydayActivity: ["note-taking", "brainstorming", "planning", "learning", "communicating", "creating", "organizing information"]
};

// Generate a random creative prompt
function generatePrompt() {
    const resultContainer = document.getElementById('result');
    const saveBtn = document.getElementById('save-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisContainer = document.getElementById('analysis');
    
    // Randomly select a prompt type and template
    const type = promptTypes[Math.floor(Math.random() * promptTypes.length)];
    const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
    
    // Fill in the template with random words from our word banks
    let prompt = template.replace('[type]', type);
    
    // Replace other placeholders
    for (const [key, values] of Object.entries(wordBanks)) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        prompt = prompt.replace(regex, () => {
            return values[Math.floor(Math.random() * values.length)];
        });
    }
    
    // Add a random twist or constraint
    const twists = [
        "Consider making it voice-activated for hands-free use.",
        "What if it could integrate with existing popular platforms?",
        "How might this be monetized through a freemium model?",
        "Could this be expanded to serve international markets?",
        "What if this was designed specifically for mobile-first users?",
        "How could AI enhance this concept over time?",
        "Consider adding a social or community component.",
        "What if this was built as a browser extension?",
        "How might this concept evolve into a platform?"
    ];
    
    const twist = twists[Math.floor(Math.random() * twists.length)];
    
    // Display the result
    resultContainer.innerHTML = `
        <div class="idea-card" id="current-idea">
            <h3>Creative Spark ✨</h3>
            <p><strong>${prompt}</strong></p>
            <p class="twist"><em>${twist}</em></p>
        <div class="idea-actions">
            <div id="share-container"></div>
        </div>
    </div>
    `;

        // Add share buttons
        const shareContainer = document.getElementById('share-container');
        const shareText = `Check out this business idea: ${prompt}`;
        const shareUrl = window.location.href;
        shareContainer.appendChild(socialShare.createShareBar(shareText, shareUrl));
    
    resultContainer.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    analyzeBtn.classList.remove('hidden');
    analysisContainer.classList.add('hidden');
    
    // Add event listener for analyze button
    document.getElementById('analyze-btn').addEventListener('click', () => {
        analyzeCurrentIdea(prompt + " " + twist);
    });
}

// Analyze the current idea
function analyzeCurrentIdea(ideaText) {
    const analysisContainer = document.getElementById('analysis');
    
    // Get analysis results
    const analysisResults = analyzer.analyzeIdea(ideaText);
    const recommendations = analyzer.getRecommendations(analysisResults);
    
    // Create score bars for visualization
    let scoreHTML = '';
    for (const [criterion, score] of Object.entries(analysisResults.scores)) {
        const percentage = score * 10;
        let colorClass = 'low';
        if (score >= 7) colorClass = 'high';
        else if (score >= 4) colorClass = 'medium';
        
        scoreHTML += `
            <div class="score-item">
                <div class="score-label">${criterion}</div>
                <div class="score-bar-container">
                    <div class="score-bar ${colorClass}" style="width: ${percentage}%"></div>
                    <div class="score-value">${score}/10</div>
                </div>
            </div>
        `;
    }
    
    // Create feedback HTML
    let feedbackHTML = '<ul class="feedback-list">';
    analysisResults.feedback.forEach(point => {
        feedbackHTML += `<li>${point}</li>`;
    });
    feedbackHTML += '</ul>';
    
    // Create recommendations HTML
    let recommendationsHTML = '<h4>Focus on improving: ' + recommendations.focusArea + '</h4>';
    recommendationsHTML += '<ul class="recommendations-list">';
    recommendations.tips.forEach(tip => {
        recommendationsHTML += `<li>${tip}</li>`;
    });
    recommendationsHTML += '</ul>';
    
    // Display the analysis
    analysisContainer.innerHTML = `
        <div class="analysis-card">
            <h3>Idea Analysis</h3>
            <div class="overall-score">
                <div class="score-circle ${getScoreClass(analysisResults.overallScore)}">
                    <span>${analysisResults.overallScore}</span>
                </div>
                <div class="score-label">Overall Viability</div>
            </div>
            <div class="score-breakdown">
                <h4>Breakdown</h4>
                ${scoreHTML}
            </div>
            <div class="feedback-section">
                <h4>Key Insights</h4>
                ${feedbackHTML}
            </div>
            <div class="recommendations-section">
                ${recommendationsHTML}
            </div>
        </div>
    `;
    
    analysisContainer.classList.remove('hidden');
}

// Helper function to get score class
function getScoreClass(score) {
    if (score >= 7) return 'high-score';
    if (score >= 4) return 'medium-score';
    return 'low-score';
}

// Initialize modules
const analyzer = new IdeaAnalyzer();
const socialShare = new SocialShare();
const ideaExporter = new IdeaExporter();
const ideaOrganizer = new IdeaOrganizer();

// Save an idea
function saveIdea() {
    const currentIdea = document.getElementById('current-idea');
    const analysisContainer = document.getElementById('analysis');
    
    if (!currentIdea) return;
    
    // Create organization UI
    const organizeModal = document.createElement('div');
    organizeModal.className = 'modal';
    organizeModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Organize Your Idea</h2>
            <p>Add a category and tags to help organize your idea garden.</p>
            <div id="category-container"></div>
            <div id="tags-container"></div>
            <button id="save-organized-idea" class="btn primary" style="margin-top: 1rem;">Save Idea</button>
        </div>
    `;
    
    document.body.appendChild(organizeModal);
    
    // Add category selector
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.appendChild(ideaOrganizer.createCategorySelector());
    
    // Add tag selector
    const tagsContainer = document.getElementById('tags-container');
    tagsContainer.appendChild(ideaOrganizer.createTagSelector());
    
    // Event listeners
    document.querySelector('.close-modal').addEventListener('click', () => {
        organizeModal.remove();
    });
    
    document.getElementById('save-organized-idea').addEventListener('click', () => {
        const savedIdeasContainer = document.getElementById('saved-ideas');
        const savedIdeas = JSON.parse(localStorage.getItem('muse-garden-ideas') || '[]');
        
        // Get selected category and tags
        const category = ideaOrganizer.getSelectedCategory();
        const tags = ideaOrganizer.getSelectedTags();
        
        // Check if we have analysis
        const hasAnalysis = !analysisContainer.classList.contains('hidden');
        
        // Extract idea text for search functionality
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentIdea.innerHTML;
        const ideaText = tempDiv.querySelector('p strong')?.textContent || '';
        
        // Add a timestamp and ID to the idea
        const ideaData = {
            id: Date.now(),
            content: currentIdea.innerHTML,
            date: new Date().toLocaleDateString(),
            hasAnalysis: hasAnalysis,
            analysis: hasAnalysis ? analysisContainer.innerHTML : null,
            category: category,
            tags: tags,
            searchText: ideaText.toLowerCase()
        };
        
        // Check if user is signed in
        if (firebase.auth().currentUser) {
            // Save to Firestore
            saveIdeaToFirestore(ideaData)
                .then(firestoreId => {
                    // Update local ID with Firestore ID
                    ideaData.firestoreId = firestoreId;
                    savedIdeas.push(ideaData);
                    localStorage.setItem('muse-garden-ideas', JSON.stringify(savedIdeas));
                    
                    // Remove the modal
                    organizeModal.remove();
                    
                    // Update the display
                    loadSavedIdeas();
                })
                .catch(error => {
                    console.error('Error saving to Firestore:', error);
                    // Fall back to local storage
                    savedIdeas.push(ideaData);
                    localStorage.setItem('muse-garden-ideas', JSON.stringify(savedIdeas));
                    
                    // Remove the modal
                    organizeModal.remove();
                    
                    // Update the display
                    loadSavedIdeas();
                });
        } else {
            // Just save locally
            savedIdeas.push(ideaData);
            localStorage.setItem('muse-garden-ideas', JSON.stringify(savedIdeas));
            
            // Remove the modal
            organizeModal.remove();
            
            // Update the display
            loadSavedIdeas();
        }
    });
}

// Also update loadSavedIdeas to show categories and tags
function loadSavedIdeas() {
    const savedIdeasContainer = document.getElementById('saved-ideas');
    const savedIdeas = JSON.parse(localStorage.getItem('muse-garden-ideas') || '[]');
    
    if (savedIdeas.length === 0) {
        savedIdeasContainer.innerHTML = '<p>Your garden is empty. Plant some seeds to start growing ideas!</p>';
        return;
    }
    
    // Sort ideas by date (newest first)
    savedIdeas.sort((a, b) => b.id - a.id);
    
    // Create HTML for saved ideas
    let ideasHTML = `
        <h2>Your Idea Garden</h2>
        <div class="search-container">
            <input type="text" id="idea-search" placeholder="Search your ideas..." class="search-input">
        </div>
    `;
    
    // Add filters
    const filtersContainer = ideaOrganizer.createFilterUI();
    ideasHTML += filtersContainer.outerHTML;
    
    savedIdeas.forEach(idea => {
        // Extract the idea text for sharing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = idea.content;
        const ideaText = tempDiv.querySelector('p strong')?.textContent || 'Check out this business idea';
        
        ideasHTML += `
            <div class="idea-card saved-idea" data-id="${idea.id}" data-category="${idea.category || ''}" data-tags="${idea.tags ? idea.tags.join(',') : ''}">
                ${idea.content}
                <div class="share-container" id="share-${idea.id}"></div>
                <div class="export-container" id="export-${idea.id}"></div>
                ${idea.category || (idea.tags && idea.tags.length > 0) ? `
                    <div class="organize-container">
                        ${idea.category ? `
                            <div class="category-container">
                                <span>Category: </span>
                                <span class="idea-category">${idea.category}</span>
                            </div>
                        ` : ''}
                        ${idea.tags && idea.tags.length > 0 ? `
                            <div class="tag-container">
                                <span>Tags: </span>
                                ${idea.tags.map(tag => `<span class="idea-tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                ${idea.hasAnalysis ? 
                    `<button class="view-analysis-btn" data-id="${idea.id}">View Analysis</button>
                    <div class="saved-analysis hidden" id="analysis-${idea.id}">${idea.analysis}</div>` 
                    : ''}
                <div class="idea-meta">
                    <span>Planted on ${idea.date}</span>
                    <button class="delete-idea" data-id="${idea.id}">Delete</button>
                </div>
            </div>
        `;
    });
    
    savedIdeasContainer.innerHTML = ideasHTML;
    
    // Add event listeners for filters
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', () => {
            // Rest of the filter functionality is handled in organizer.js
        });
    });
    
    // Add search functionality
    const searchInput = document.getElementById('idea-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();
            
            document.querySelectorAll('.saved-idea').forEach(ideaCard => {
                const id = parseInt(ideaCard.getAttribute('data-id'));
                const idea = savedIdeas.find(i => i.id === id);
                
                if (!idea) return;
                
                // Search in title, description, and category/tags
                const searchable = [
                    idea.searchText || '',
                    idea.category || '',
                    ...(idea.tags || [])
                ].join(' ').toLowerCase();
                
                if (searchText === '' || searchable.includes(searchText)) {
                    ideaCard.style.display = 'block';
                } else {
                    ideaCard.style.display = 'none';
                }
            });
        });
    }
    
    // Add share buttons to each saved idea
    savedIdeas.forEach(idea => {
        const shareContainer = document.getElementById(`share-${idea.id}`);
        if (shareContainer) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = idea.content;
            const ideaText = tempDiv.querySelector('p strong')?.textContent || 'Check out this business idea';
            const shareUrl = window.location.href;
            shareContainer.appendChild(socialShare.createShareBar(ideaText, shareUrl));
        }
        
        // Add export functionality
        const exportContainer = document.getElementById(`export-${idea.id}`);
        if (exportContainer) {
            exportContainer.appendChild(ideaExporter.createExportDropdown(idea));
        }
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-idea').forEach(button => {
        button.addEventListener('click', (e) => {
            const ideaId = parseInt(e.target.getAttribute('data-id'));
            deleteIdea(ideaId);
        });
    });
    
    // Add event listeners to view analysis buttons
    document.querySelectorAll('.view-analysis-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const ideaId = parseInt(e.target.getAttribute('data-id'));
            const analysisDiv = document.getElementById(`analysis-${ideaId}`);
            analysisDiv.classList.toggle('hidden');
            e.target.textContent = analysisDiv.classList.contains('hidden') ? 
                'View Analysis' : 'Hide Analysis';
        });
    });
}

// Delete an idea
function deleteIdea(ideaId) {
    let savedIdeas = JSON.parse(localStorage.getItem('muse-garden-ideas') || '[]');
    const ideaToDelete = savedIdeas.find(idea => idea.id === ideaId);
    
    // Remove from array
    savedIdeas = savedIdeas.filter(idea => idea.id !== ideaId);
    localStorage.setItem('muse-garden-ideas', JSON.stringify(savedIdeas));
    
    // If user is signed in and idea has a Firestore ID, delete from Firestore
    if (firebase.auth().currentUser && ideaToDelete && ideaToDelete.firestoreId) {
        deleteIdeaFromFirestore(ideaToDelete.firestoreId)
            .catch(error => console.error('Error deleting from Firestore:', error));
    }
    
    // Update the display
    loadSavedIdeas();
}