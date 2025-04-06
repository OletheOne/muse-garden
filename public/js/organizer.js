class IdeaOrganizer {
    constructor() {
        this.categories = [
            'Digital Product', 'Physical Product', 'Service', 
            'Content Creation', 'Educational', 'Community', 
            'Productivity', 'Entertainment', 'Wellness'
        ];
        
        this.tags = [
            'AI', 'Mobile', 'Subscription', 'B2B', 'B2C', 
            'Low Cost', 'High Margin', 'Quick Launch', 'Passive Income',
            'Creative', 'Technical', 'Social', 'Global', 'Local'
        ];
    }
    
    createCategorySelector(initialCategory = null) {
        const container = document.createElement('div');
        container.className = 'category-selector';
        
        const label = document.createElement('label');
        label.textContent = 'Category:';
        label.htmlFor = 'idea-category';
        
        const select = document.createElement('select');
        select.id = 'idea-category';
        select.className = 'category-select';
        
        // Add blank option
        const blankOption = document.createElement('option');
        blankOption.value = '';
        blankOption.textContent = '-- Select Category --';
        select.appendChild(blankOption);
        
        // Add category options
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            
            if (initialCategory === category) {
                option.selected = true;
            }
            
            select.appendChild(option);
        });
        
        container.appendChild(label);
        container.appendChild(select);
        
        return container;
    }
    
    createTagSelector(selectedTags = []) {
        const container = document.createElement('div');
        container.className = 'tag-selector';
        
        const label = document.createElement('div');
        label.textContent = 'Tags:';
        label.className = 'tag-label';
        
        const tagOptions = document.createElement('div');
        tagOptions.className = 'tag-options';
        
        this.tags.forEach(tag => {
            const tagOption = document.createElement('div');
            tagOption.className = 'tag-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `tag-${tag}`;
            checkbox.value = tag;
            checkbox.checked = selectedTags.includes(tag);
            
            const tagLabel = document.createElement('label');
            tagLabel.htmlFor = `tag-${tag}`;
            tagLabel.textContent = tag;
            
            tagOption.appendChild(checkbox);
            tagOption.appendChild(tagLabel);
            tagOptions.appendChild(tagOption);
        });
        
        container.appendChild(label);
        container.appendChild(tagOptions);
        
        return container;
    }
    
    createFilterUI() {
        const container = document.createElement('div');
        container.className = 'filters-container';
        
        // Categories filter
        const categoryFilter = document.createElement('div');
        categoryFilter.className = 'filter-group';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'filter-title';
        categoryTitle.textContent = 'Filter by Category:';
        
        const categoryOptions = document.createElement('div');
        categoryOptions.className = 'filter-options';
        
        // Add "All" option
        const allCategoryOption = document.createElement('div');
        allCategoryOption.className = 'filter-option active';
        allCategoryOption.textContent = 'All';
        allCategoryOption.setAttribute('data-category', 'all');
        categoryOptions.appendChild(allCategoryOption);
        
        // Add category options
        this.categories.forEach(category => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = category;
            option.setAttribute('data-category', category);
            categoryOptions.appendChild(option);
        });
        
        categoryFilter.appendChild(categoryTitle);
        categoryFilter.appendChild(categoryOptions);
        
        // Tags filter
        const tagFilter = document.createElement('div');
        tagFilter.className = 'filter-group';
        
        const tagTitle = document.createElement('div');
        tagTitle.className = 'filter-title';
        tagTitle.textContent = 'Filter by Tag:';
        
        const tagOptions = document.createElement('div');
        tagOptions.className = 'filter-options';
        
        // Add "All" option
        const allTagOption = document.createElement('div');
        allTagOption.className = 'filter-option active';
        allTagOption.textContent = 'All';
        allTagOption.setAttribute('data-tag', 'all');
        tagOptions.appendChild(allTagOption);
        
        // Add tag options
        this.tags.forEach(tag => {
            const option = document.createElement('div');
            option.className = 'filter-option';
            option.textContent = tag;
            option.setAttribute('data-tag', tag);
            tagOptions.appendChild(option);
        });
        
        tagFilter.appendChild(tagTitle);
        tagFilter.appendChild(tagOptions);
        
        // Add event listeners for filter options
        container.appendChild(categoryFilter);
        container.appendChild(tagFilter);
        
        // Add event listeners
        categoryOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-option')) {
                // Toggle active state
                categoryOptions.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Apply filter
                this.applyFilters();
            }
        });
        
        tagOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-option')) {
                // Toggle active state
                tagOptions.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Apply filter
                this.applyFilters();
            }
        });
        
        return container;
    }
    
    applyFilters() {
        const activeCategory = document.querySelector('.filter-options .filter-option.active[data-category]').getAttribute('data-category');
        const activeTag = document.querySelector('.filter-options .filter-option.active[data-tag]').getAttribute('data-tag');
        
        const ideas = document.querySelectorAll('.saved-idea');
        
        ideas.forEach(idea => {
            let showIdea = true;
            
            // Apply category filter
            if (activeCategory !== 'all') {
                const ideaCategory = idea.getAttribute('data-category');
                if (ideaCategory !== activeCategory) {
                    showIdea = false;
                }
            }
            
            // Apply tag filter
            if (activeTag !== 'all' && showIdea) {
                const ideaTags = idea.getAttribute('data-tags')?.split(',') || [];
                if (!ideaTags.includes(activeTag)) {
                    showIdea = false;
                }
            }
            
            // Show/hide based on filters
            idea.style.display = showIdea ? 'block' : 'none';
        });
    }
    
    getSelectedCategory() {
        const select = document.getElementById('idea-category');
        return select ? select.value : '';
    }
    
    getSelectedTags() {
        const selectedTags = [];
        document.querySelectorAll('.tag-option input:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        return selectedTags;
    }
    
    displayCategoryAndTags(container, category, tags) {
        if (category || (tags && tags.length > 0)) {
            const organizeContainer = document.createElement('div');
            organizeContainer.className = 'organize-container';
            
            if (category) {
                const categoryContainer = document.createElement('div');
                categoryContainer.className = 'category-container';
                
                const categoryLabel = document.createElement('span');
                categoryLabel.textContent = 'Category: ';
                
                const categoryBadge = document.createElement('span');
                categoryBadge.className = 'idea-category';
                categoryBadge.textContent = category;
                
                categoryContainer.appendChild(categoryLabel);
                categoryContainer.appendChild(categoryBadge);
                organizeContainer.appendChild(categoryContainer);
            }
            
            if (tags && tags.length > 0) {
                const tagContainer = document.createElement('div');
                tagContainer.className = 'tag-container';
                
                const tagLabel = document.createElement('span');
                tagLabel.textContent = 'Tags: ';
                
                tagContainer.appendChild(tagLabel);
                
                tags.forEach(tag => {
                    const tagBadge = document.createElement('span');
                    tagBadge.className = 'idea-tag';
                    tagBadge.textContent = tag;
                    tagContainer.appendChild(tagBadge);
                });
                
                organizeContainer.appendChild(tagContainer);
            }
            
            container.appendChild(organizeContainer);
        }
    }
}