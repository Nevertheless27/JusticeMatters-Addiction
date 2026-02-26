// Stories functionality for sharing family stories
(function() {
    'use strict';

    // Get DOM elements
    const storyForm = document.getElementById('storyForm');
    const storiesContainer = document.getElementById('storiesContainer');
    const lovedOneNameEl = document.getElementById('lovedOneName');
    const relationshipEl = document.getElementById('relationship');
    const storyEl = document.getElementById('story');
    const consentEl = document.getElementById('consent');

    let stories = [];

    // Relationship label map (defined once at module scope)
    const relationshipText = {
        'parent': 'Parent',
        'child': 'Child',
        'sibling': 'Sibling',
        'spouse': 'Spouse/Partner',
        'friend': 'Friend',
        'other': 'Family Member'
    };

    // Load stories from localStorage
    function loadStories() {
        const storedStoriesData = localStorage.getItem('justiceMattersStories');
        if (storedStoriesData) {
            stories = JSON.parse(storedStoriesData);
            renderStories();
        }
    }

    // Save stories to localStorage
    function saveStories() {
        localStorage.setItem('justiceMattersStories', JSON.stringify(stories));
    }

    // Format date
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Build a single story card DOM element
    function createStoryCard(story) {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';

        // Create story header
        const storyHeader = document.createElement('div');
        storyHeader.className = 'story-header';

        const storyTitle = document.createElement('h3');
        storyTitle.textContent = `In Memory of ${story.lovedOneName}`;

        const storyMeta = document.createElement('p');
        storyMeta.className = 'story-meta';
        storyMeta.textContent = `Shared by ${story.submitterName} (${relationshipText[story.relationship]}) - ${formatDate(story.timestamp)}`;

        storyHeader.appendChild(storyTitle);
        storyHeader.appendChild(storyMeta);

        // Create story content
        const storyContent = document.createElement('div');
        storyContent.className = 'story-content';

        const storyPara = document.createElement('p');
        storyPara.textContent = story.story;
        storyContent.appendChild(storyPara);

        // Create story footer
        const storyFooter = document.createElement('div');
        storyFooter.className = 'story-footer';

        if (story.seekingJustice) {
            const badge = document.createElement('span');
            badge.className = 'justice-badge';
            badge.textContent = 'Seeking Justice';
            storyFooter.appendChild(badge);
        }

        storyCard.appendChild(storyHeader);
        storyCard.appendChild(storyContent);
        storyCard.appendChild(storyFooter);

        return storyCard;
    }

    // Add story - inserts the new card directly without re-rendering all stories
    function addStory(storyData) {
        const now = Date.now();
        const story = {
            id: now,
            submitterName: storyData.submitterName || 'Anonymous',
            lovedOneName: storyData.lovedOneName,
            relationship: storyData.relationship,
            story: storyData.story,
            seekingJustice: storyData.seekingJustice,
            timestamp: now
        };

        stories.unshift(story); // Add to beginning of array
        saveStories();

        // Insert the new card before the first existing user story (after sample cards)
        const firstUserCard = storiesContainer.querySelector('.story-card:not(.sample)');
        storiesContainer.insertBefore(createStoryCard(story), firstUserCard);
    }

    // Render all stories (used on initial load from localStorage)
    function renderStories() {
        // Get existing sample stories
        const sampleStories = storiesContainer.querySelectorAll('.story-card.sample');

        // Clear container
        storiesContainer.innerHTML = '';

        // Re-add sample stories
        sampleStories.forEach(sampleStoryElement => storiesContainer.appendChild(sampleStoryElement));

        // Add user-submitted stories
        stories.forEach(story => storiesContainer.appendChild(createStoryCard(story)));
        stories.forEach(storyEntry => {
            const storyCardElement = document.createElement('div');
            storyCardElement.className = 'story-card';
            
            const relationshipLabelMap = {
                'parent': 'Parent',
                'child': 'Child',
                'sibling': 'Sibling',
                'spouse': 'Spouse/Partner',
                'friend': 'Friend',
                'other': 'Family Member'
            };

            // Create story header
            const storyHeaderSection = document.createElement('div');
            storyHeaderSection.className = 'story-header';
            
            const storyTitleHeading = document.createElement('h3');
            storyTitleHeading.textContent = `In Memory of ${storyEntry.lovedOneName}`;
            
            const storyMetaElement = document.createElement('p');
            storyMetaElement.className = 'story-meta';
            storyMetaElement.textContent = `Shared by ${storyEntry.submitterName} (${relationshipLabelMap[storyEntry.relationship]}) - ${formatDate(storyEntry.timestamp)}`;
            
            storyHeaderSection.appendChild(storyTitleHeading);
            storyHeaderSection.appendChild(storyMetaElement);
            
            // Create story content
            const storyContentSection = document.createElement('div');
            storyContentSection.className = 'story-content';
            
            const storyTextParagraph = document.createElement('p');
            storyTextParagraph.textContent = storyEntry.story;
            storyContentSection.appendChild(storyTextParagraph);
            
            // Create story footer
            const storyFooterSection = document.createElement('div');
            storyFooterSection.className = 'story-footer';
            
            if (storyEntry.seekingJustice) {
                const seekingJusticeBadge = document.createElement('span');
                seekingJusticeBadge.className = 'justice-badge';
                seekingJusticeBadge.textContent = 'Seeking Justice';
                storyFooterSection.appendChild(seekingJusticeBadge);
            }
            
            storyCardElement.appendChild(storyHeaderSection);
            storyCardElement.appendChild(storyContentSection);
            storyCardElement.appendChild(storyFooterSection);
            
            storiesContainer.appendChild(storyCardElement);
        });
    }

    // Handle form submission
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitterName = document.getElementById('submitterName').value.trim();
        const lovedOneName = lovedOneNameEl.value.trim();
        const relationship = relationshipEl.value;
        const story = storyEl.value.trim();
        const seekingJustice = document.getElementById('seekingJustice').checked;
        const consent = consentEl.checked;

        // Validate
        if (!lovedOneName || !relationship || !story || !consent) {
            // Highlight missing fields
            if (!lovedOneName) lovedOneNameEl.style.borderColor = '#E74C3C';
            if (!relationship) relationshipEl.style.borderColor = '#E74C3C';
            if (!story) storyEl.style.borderColor = '#E74C3C';
            if (!consent) consentEl.parentElement.style.color = '#E74C3C';

            setTimeout(() => {
                lovedOneNameEl.style.borderColor = '';
                relationshipEl.style.borderColor = '';
                storyEl.style.borderColor = '';
                consentEl.parentElement.style.color = '';
            }, 2000);
            if (!lovedOneName) window.JusticeMatters.highlightError(document.getElementById('lovedOneName'));
            if (!relationship) window.JusticeMatters.highlightError(document.getElementById('relationship'));
            if (!story) window.JusticeMatters.highlightError(document.getElementById('story'));
            if (!consent) window.JusticeMatters.highlightError(document.getElementById('consent').parentElement, 'color');
            return;
        }

        // Add story
        addStory({
            submitterName: submitterName || 'Anonymous',
            lovedOneName: lovedOneName,
            relationship: relationship,
            story: story,
            seekingJustice: seekingJustice
        });

        // Reset form
        storyForm.reset();

        // Show confirmation message
        const confirmMessage = document.createElement('div');
        confirmMessage.style.cssText = 'background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #c3e6cb;';
        confirmMessage.textContent = 'Thank you for sharing your story. Your loved one\'s memory will help others feel less alone.';

        const shareStoryContainer = document.querySelector('.share-story-container');
        shareStoryContainer.insertBefore(confirmMessage, storyForm);

        const submissionConfirmationElement = document.createElement('div');
        submissionConfirmationElement.style.cssText = 'background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #c3e6cb;';
        submissionConfirmationElement.textContent = 'Thank you for sharing your story. Your loved one\'s memory will help others feel less alone.';
        
        const shareStoryContainer = document.querySelector('.share-story-container');
        shareStoryContainer.insertBefore(submissionConfirmationElement, storyForm);
        
        setTimeout(() => {
            submissionConfirmationElement.remove();
        }, 5000);

        // Scroll to stories
        document.querySelector('.stories-display').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Load stories on page load
    loadStories();

})();
