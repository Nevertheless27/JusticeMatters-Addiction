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
        const storedChatMessages = localStorage.getItem('justiceMattersChat');
        if (storedChatMessages) {
            messages = JSON.parse(storedChatMessages);
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

    // Create a single message DOM element
    function createMessageElement(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = msg.sender === currentUser ? 'message user-message' : 'message other-message';

        if (msg.sender !== currentUser) {
            const senderSpan = document.createElement('div');
            senderSpan.className = 'message-sender';
            senderSpan.textContent = msg.sender;
            messageDiv.appendChild(senderSpan);
        }

        const textP = document.createElement('p');
        textP.textContent = msg.text;
        messageDiv.appendChild(textP);

        const timeSpan = document.createElement('div');
        timeSpan.className = 'message-time';
        timeSpan.textContent = formatTime(msg.timestamp);
        messageDiv.appendChild(timeSpan);

        return messageDiv;
    }

    // Add message to chat - appends only the new element instead of re-rendering all
    function addMessage(sender, text, timestamp = Date.now()) {
        const message = {
            sender: sender,
            text: text,
            timestamp: timestamp
        };
        messages.push(message);
        saveMessages();
        chatBox.appendChild(createMessageElement(message));
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Render all messages (used on initial load from localStorage)
    function renderMessages() {
        // Keep system messages and add user messages
        const systemMessages = chatBox.querySelectorAll('.system-message');
        chatBox.innerHTML = '';
        
        // Re-add system messages
        systemMessages.forEach(systemMsgElement => chatBox.appendChild(systemMsgElement));

        // Add user messages
        messages.forEach(msg => chatBox.appendChild(createMessageElement(msg)));
        messages.forEach(chatMsgData => {
            const chatMessageElement = document.createElement('div');
            chatMessageElement.className = chatMsgData.sender === currentUser ? 'message user-message' : 'message other-message';
            
            const senderNameElement = document.createElement('div');
            senderNameElement.className = 'message-sender';
            senderNameElement.textContent = chatMsgData.sender;
            
            const messageTextParagraph = document.createElement('p');
            messageTextParagraph.textContent = chatMsgData.text;
            
            const messageTimestampElement = document.createElement('div');
            messageTimestampElement.className = 'message-time';
            messageTimestampElement.textContent = formatTime(chatMsgData.timestamp);
            
            if (chatMsgData.sender !== currentUser) {
                chatMessageElement.appendChild(senderNameElement);
            }
            chatMessageElement.appendChild(messageTextParagraph);
            chatMessageElement.appendChild(messageTimestampElement);
            
            chatBox.appendChild(chatMessageElement);
        });

        scrollToBottom();
    }

    // Scroll chat to the bottom
    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Join chat
    function joinChat() {
        const enteredUserName = userNameInput.value.trim();
        if (enteredUserName === '') {
            userNameInput.focus();
            window.JusticeMatters.highlightError(userNameInput);
            return;
        }

        currentUser = enteredUserName;
        
        // Hide name input, show message input
        nameInputSection.style.display = 'none';
        messageInputSection.style.display = 'flex';

        // Add system message
        const joinNotificationElement = document.createElement('div');
        joinNotificationElement.className = 'message system-message';
        const joinNotificationParagraph = document.createElement('p');
        joinNotificationParagraph.textContent = `${enteredUserName} joined the chat. Welcome!`;
        joinNotificationElement.appendChild(joinNotificationParagraph);
        chatBox.appendChild(joinNotificationElement);

        scrollToBottom();

        // Focus on message input
        messageInput.focus();
    }

    // Send message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === '') {
            return;
        }

        addMessage(currentUser, messageText);
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
                const selectedDemoMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
                if (currentUser && selectedDemoMessage.sender !== currentUser) {
                    addMessage(selectedDemoMessage.sender, selectedDemoMessage.text);
                }
            }, 30000); // Add a message after 30 seconds if chat is active
        }
    }

    // Start simulation
    simulateOtherUsers();

})();
