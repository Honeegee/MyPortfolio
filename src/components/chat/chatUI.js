// Chat functionality
export function initializeChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const userMessage = document.getElementById('userMessage');
    const chatStatusDot = document.getElementById('chatStatusDot');
    const chatStatusText = document.getElementById('chatStatusText');
    const chatOfflineBanner = document.getElementById('chatOfflineBanner');
    const offlineBannerText = document.getElementById('offlineBannerText');
    const submitButton = chatForm?.querySelector('button[type="submit"]');
    let isProcessing = false;
    let isOnline = false;

    // Only initialize if all required elements exist
    if (!chatToggle || !chatWindow || !chatClose || !chatForm || !chatMessages || !userMessage) {
        console.warn('Chat elements not found, skipping chat initialization');
        return;
    }

    // Update connection status UI
    function updateStatusUI(online, message) {
        isOnline = online;
        if (chatStatusDot) {
            chatStatusDot.className = `absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-purple-900/50 ${online ? 'bg-green-500' : 'bg-red-500'}`;
            chatStatusDot.title = online ? 'Connected' : 'Offline';
        }
        if (chatStatusText) {
            chatStatusText.textContent = online ? 'Online' : 'Offline';
            chatStatusText.className = `text-[10px] leading-tight ${online ? 'text-green-400' : 'text-red-400'}`;
        }
        if (chatOfflineBanner) {
            chatOfflineBanner.classList.toggle('hidden', online);
            if (offlineBannerText && message) {
                offlineBannerText.textContent = message;
            }
        }
        if (submitButton) {
            submitButton.disabled = !online;
        }
        if (userMessage) {
            userMessage.placeholder = online ? 'Ask a question...' : 'Chat unavailable - service offline';
        }
    }

    // Check connection status
    async function checkConnection() {
        if (!window.chatAPI) {
            updateStatusUI(false, 'Chat service not initialized');
            return;
        }
        const health = await window.chatAPI.checkHealth();
        updateStatusUI(health.online, health.message);
    }

    // Toggle chat window
    chatToggle.addEventListener('click', async () => {
        if (chatWindow.classList.contains('opacity-0')) {
            // Show chat
            chatWindow.classList.remove('opacity-0', 'scale-90', 'translate-y-5', 'pointer-events-none');
            chatWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
            // Check connection status when opening
            await checkConnection();
            // Welcome message when chat opens
            if (chatMessages.children.length === 0) {
                const welcomeMsg = isOnline
                    ? "Hi! I'm Honey's AI assistant. I can tell you about her skills, experience, education, projects, or how to get in touch. What would you like to know?"
                    : "Hi! I'm currently offline, but you can still browse Honey's portfolio. The AI chat will be available once the service is running.";
                addMessage(welcomeMsg, false);
            }
        } else {
            hideChat();
        }
    });
    
    // Close chat window
    chatClose.addEventListener('click', hideChat);
    
    function hideChat() {
        chatWindow.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'pointer-events-auto');
        chatWindow.classList.add('opacity-0', 'scale-90', 'translate-y-5', 'pointer-events-none');
    }
    
    // Handle chat form submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (userMessage.value.trim() === '' || isProcessing) return;

        // Check if offline before attempting
        if (!isOnline) {
            addMessage("I'm currently offline. Please wait for the AI service to come back online, or try refreshing the page.", false);
            return;
        }

        const messageText = userMessage.value;
        userMessage.value = '';

        // Add user message
        addMessage(messageText, true);

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        isProcessing = true;
        try {
            // Get response from ChatAPI
            if (!window.chatAPI) {
                throw new Error('Chat API not initialized');
            }
            const response = await window.chatAPI.getResponse(messageText);
            // Remove typing indicator and add response
            typingIndicator.remove();
            addMessage(response, false);
            // Update status to online since request succeeded
            updateStatusUI(true);
        } catch (error) {
            console.error('Error getting chat response:', error);
            typingIndicator.remove();

            // Use the error message from our enhanced error handling
            const errorMessage = error.message || "I apologize, but I'm having trouble connecting right now. Please try again later.";
            addMessage(errorMessage, false);

            // Update status based on error type
            if (error.type === 'network' || error.type === 'ollama') {
                updateStatusUI(false, errorMessage);
            }
        } finally {
            isProcessing = false;
        }
    });
    
    // Add message to chat
    function addMessage(text, isUser) {
        const messageElement = document.createElement('div');
        messageElement.className = `opacity-0 translate-y-2 transition-all duration-300 flex items-start space-x-2 mb-4 ${isUser ? 'justify-end' : ''}`;
        
        // Convert URLs to clickable links
        const formattedText = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" class="text-purple-400 hover:text-purple-300 underline">$1</a>'
        );
        
        messageElement.innerHTML = `
            <div class="bg-purple-500/${isUser ? '20' : '10'} backdrop-blur-lg rounded-lg p-3 sm:p-4 
                       text-gray-${isUser ? '200' : '300'} text-sm sm:text-base 
                       border border-purple-500/${isUser ? '30' : '20'}
                       max-w-[80%] break-words shadow-lg">
                ${formattedText}
            </div>
        `;
        chatMessages.appendChild(messageElement);
        
        requestAnimationFrame(() => {
            messageElement.classList.remove('opacity-0', 'translate-y-2');
            messageElement.classList.add('opacity-100', 'translate-y-0');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'flex items-start space-x-2 mb-4';
        typingElement.innerHTML = `
            <div class="bg-purple-500/10 backdrop-blur-lg rounded-lg p-3 sm:p-4 
                       text-gray-300 text-sm sm:text-base 
                       border border-purple-500/20
                       flex items-center space-x-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        `;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingElement;
    }
}
