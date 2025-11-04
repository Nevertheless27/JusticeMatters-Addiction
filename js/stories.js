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

            storyCard.innerHTML = `
                <div class="story-header">
                    <h3>In Memory of ${escapeHtml(story.lovedOneName)}</h3>
                    <p class="story-meta">Shared by ${escapeHtml(story.submitterName)} (${relationshipText[story.relationship]}) - ${formatDate(story.timestamp)}</p>
                </div>
                <div class="story-content">
                    <p>${escapeHtml(story.story).replace(/\n/g, '</p><p>')}</p>
                </div>
                <div class="story-footer">
                    ${story.seekingJustice ? '<span class="justice-badge">Seeking Justice</span>' : ''}
                </div>
            `;
            
            storiesContainer.appendChild(storyCard);
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
            alert('Please fill in all required fields and provide consent to share.');
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

        // Show confirmation
        alert('Thank you for sharing your story. Your loved one\'s memory will help others feel less alone.');

        // Scroll to stories
        document.querySelector('.stories-display').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });

    // Load stories on page load
    loadStories();

})();
