// Stories functionality for sharing family stories
(function() {
    'use strict';

    // Get DOM elements
    const storyForm = document.getElementById('storyForm');
    const storiesContainer = document.getElementById('storiesContainer');

    let stories = [];

    // Load stories from localStorage
    function loadStories() {
        const stored = localStorage.getItem('justiceMattersStories');
        if (stored) {
            stories = JSON.parse(stored);
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

    // Add story
    function addStory(storyData) {
        const story = {
            id: Date.now(),
            submitterName: storyData.submitterName || 'Anonymous',
            lovedOneName: storyData.lovedOneName,
            relationship: storyData.relationship,
            story: storyData.story,
            seekingJustice: storyData.seekingJustice,
            timestamp: Date.now()
        };
        
        stories.unshift(story); // Add to beginning of array
        saveStories();
        renderStories();
    }

    // Render stories
    function renderStories() {
        // Get existing sample stories
        const sampleStories = storiesContainer.querySelectorAll('.story-card.sample');
        
        // Clear container
        storiesContainer.innerHTML = '';

        // Re-add sample stories
        sampleStories.forEach(sample => storiesContainer.appendChild(sample));

        // Add user-submitted stories
        stories.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            
            const relationshipText = {
                'parent': 'Parent',
                'child': 'Child',
                'sibling': 'Sibling',
                'spouse': 'Spouse/Partner',
                'friend': 'Friend',
                'other': 'Family Member'
            };

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
            
            storiesContainer.appendChild(storyCard);
        });
    }

    // Handle form submission
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitterName = document.getElementById('submitterName').value.trim();
        const lovedOneName = document.getElementById('lovedOneName').value.trim();
        const relationship = document.getElementById('relationship').value;
        const story = document.getElementById('story').value.trim();
        const seekingJustice = document.getElementById('seekingJustice').checked;
        const consent = document.getElementById('consent').checked;

        // Validate
        if (!lovedOneName || !relationship || !story || !consent) {
            // Highlight missing fields
            if (!lovedOneName) document.getElementById('lovedOneName').style.borderColor = '#E74C3C';
            if (!relationship) document.getElementById('relationship').style.borderColor = '#E74C3C';
            if (!story) document.getElementById('story').style.borderColor = '#E74C3C';
            if (!consent) document.getElementById('consent').parentElement.style.color = '#E74C3C';
            
            setTimeout(() => {
                document.getElementById('lovedOneName').style.borderColor = '';
                document.getElementById('relationship').style.borderColor = '';
                document.getElementById('story').style.borderColor = '';
                document.getElementById('consent').parentElement.style.color = '';
            }, 2000);
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
        
        setTimeout(() => {
            confirmMessage.remove();
        }, 5000);

        // Scroll to stories
        document.querySelector('.stories-display').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Load stories on page load
    loadStories();

})();
