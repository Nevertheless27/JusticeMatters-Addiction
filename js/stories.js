// Stories functionality for sharing family stories
(function() {
    'use strict';

    // Get DOM elements
    const storyForm = document.getElementById('storyForm');
    const storiesContainer = document.getElementById('storiesContainer');

    let stories = [];

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
        sampleStories.forEach(sampleStoryElement => storiesContainer.appendChild(sampleStoryElement));

        // Add user-submitted stories
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
