// Chat functionality for support chat room
(function() {
    'use strict';

    // Get DOM elements
    const chatBox = document.getElementById('chatBox');
    const userNameInput = document.getElementById('userName');
    const joinBtn = document.getElementById('joinBtn');
    const nameInputSection = document.getElementById('nameInputSection');
    const messageInputSection = document.getElementById('messageInputSection');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    let currentUser = '';
    let messages = [];

    // Load messages from localStorage
    function loadMessages() {
        const stored = localStorage.getItem('justiceMattersChat');
        if (stored) {
            messages = JSON.parse(stored);
            renderMessages();
        }
    }

    // Save messages to localStorage
    function saveMessages() {
        localStorage.setItem('justiceMattersChat', JSON.stringify(messages));
    }

    // Format timestamp
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Add message to chat
    function addMessage(sender, text, timestamp = Date.now()) {
        const message = {
            sender: sender,
            text: text,
            timestamp: timestamp
        };
        messages.push(message);
        saveMessages();
        renderMessages();
    }

    // Render all messages
    function renderMessages() {
        // Keep system messages and add user messages
        const systemMessages = chatBox.querySelectorAll('.system-message');
        chatBox.innerHTML = '';
        
        // Re-add system messages
        systemMessages.forEach(msg => chatBox.appendChild(msg));

        // Add user messages
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = msg.sender === currentUser ? 'message user-message' : 'message other-message';
            
            const senderSpan = document.createElement('div');
            senderSpan.className = 'message-sender';
            senderSpan.textContent = msg.sender;
            
            const textP = document.createElement('p');
            textP.textContent = msg.text;
            
            const timeSpan = document.createElement('div');
            timeSpan.className = 'message-time';
            timeSpan.textContent = formatTime(msg.timestamp);
            
            if (msg.sender !== currentUser) {
                messageDiv.appendChild(senderSpan);
            }
            messageDiv.appendChild(textP);
            messageDiv.appendChild(timeSpan);
            
            chatBox.appendChild(messageDiv);
        });

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Join chat
    function joinChat() {
        const userName = userNameInput.value.trim();
        if (userName === '') {
            alert('Please enter your name to join the chat.');
            return;
        }

        currentUser = userName;
        
        // Hide name input, show message input
        nameInputSection.style.display = 'none';
        messageInputSection.style.display = 'flex';

        // Add system message
        const joinMessage = document.createElement('div');
        joinMessage.className = 'message system-message';
        joinMessage.innerHTML = `<p>${userName} joined the chat. Welcome!</p>`;
        chatBox.appendChild(joinMessage);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Focus on message input
        messageInput.focus();
    }

    // Send message
    function sendMessage() {
        const text = messageInput.value.trim();
        if (text === '') {
            return;
        }

        addMessage(currentUser, text);
        messageInput.value = '';
        messageInput.focus();
    }

    // Event listeners
    joinBtn.addEventListener('click', joinChat);
    
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinChat();
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Load messages on page load
    loadMessages();

    // Simulate other users' messages (for demo purposes)
    // In a real application, this would be handled by a backend server
    function simulateOtherUsers() {
        const demoMessages = [
            { sender: 'Sarah M.', text: 'I lost my son two months ago. Some days are harder than others, but this community has been such a blessing.' },
            { sender: 'Anonymous', text: 'Thank you all for being here. I feel less alone knowing others understand this pain.' },
            { sender: 'David R.', text: 'We\'re meeting with a lawyer next week. If anyone has experience with wrongful death cases, I\'d appreciate any guidance.' }
        ];

        // Check if we need to add demo messages
        if (messages.length === 0) {
            setTimeout(() => {
                const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
                if (currentUser && randomMessage.sender !== currentUser) {
                    addMessage(randomMessage.sender, randomMessage.text);
                }
            }, 30000); // Add a message after 30 seconds if chat is active
        }
    }

    // Start simulation
    simulateOtherUsers();

})();
