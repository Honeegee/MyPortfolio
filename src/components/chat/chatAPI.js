export class ChatAPI {
    constructor() {
        this.conversationHistory = [];
        this.isOnline = false;
        this.lastHealthCheck = null;
        this.systemPrompt = `You are HoneyAI, an AI assistant on Honey's portfolio website.

STRICT RULES:
1. Always respond in English only
2. You are "HoneyAI" - NEVER say "I'm Honey" or confuse yourself with Honey
3. Keep responses SHORT (2-4 sentences max for simple questions)
4. NO emojis unless the user uses them first
5. NO markdown headers (##) - use plain text or simple bullet points
6. Be conversational, not formal

HONEY'S INFO (the person, not you):
- Email: honeygden@gmail.com
- Education: BS Information Technology, Mapua Malayan Digital College (2022-Present)
- Skills: Java, JavaScript, Kotlin, Python, HTML, CSS
- Tools: Android Studio, VS Code
- Projects: RecipeKeeper (Kotlin), MotoRent (JavaScript), Connectly (JavaScript/Python)
- Experience: Global Link Center (2023), Garmin Corporation (2019-2022)

EXAMPLE RESPONSES:
Q: "Who are you?"
A: "I'm HoneyAI, an assistant here to help you learn about Honey. Feel free to ask about her skills, projects, or experience!"

Q: "What can Honey do?"
A: "Honey specializes in mobile and web development. She works with Java, JavaScript, Kotlin, and Python, and has built apps like RecipeKeeper and MotoRent."

Keep it simple and friendly.`;
    }

    async checkHealth() {
        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            this.isOnline = data.status === 'online';
            this.lastHealthCheck = Date.now();
            return { online: this.isOnline, message: data.message };
        } catch (error) {
            this.isOnline = false;
            this.lastHealthCheck = Date.now();
            return {
                online: false,
                message: 'Unable to connect to server. Please make sure the server is running.'
            };
        }
    }

    getErrorMessage(error) {
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            return {
                type: 'network',
                message: "Can't reach the server. Please check if the server is running on port 8000."
            };
        }
        if (error.response?.data?.message?.includes('API')) {
            return {
                type: 'api',
                message: "The AI service is currently unavailable. Please try again later."
            };
        }
        if (error.message?.includes('timeout')) {
            return {
                type: 'timeout',
                message: "The request took too long. Please try again."
            };
        }
        return {
            type: 'unknown',
            message: "Something went wrong. Please try again later."
        };
    }

    async getResponse(message) {
        try {
            // Add user message to history
            this.conversationHistory.push({ role: 'user', content: message });

            // Keep only last 10 messages to manage context window
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            // Always include system prompt as the first message
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...this.conversationHistory
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: messages
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Error from server: ${response.status} ${response.statusText}`, errorData);
                const error = new Error(errorData.message || `Server returned status ${response.status}`);
                error.response = { data: errorData };
                throw error;
            }

            const data = await response.json();

            // Check if the expected response structure is present
            if (!data || !data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
                console.error('Unexpected response structure from API:', data);
                throw new Error('Received unexpected response structure from API.');
            }

            const assistantResponse = data.choices[0].message.content;
            
            // Add assistant response to history
            this.conversationHistory.push({ role: 'assistant', content: assistantResponse });
            
            return assistantResponse;
        } catch (error) {
            console.error('Error calling chat API:', error);
            this.isOnline = false;
            const errorInfo = this.getErrorMessage(error);
            const enhancedError = new Error(errorInfo.message);
            enhancedError.type = errorInfo.type;
            enhancedError.originalError = error;
            throw enhancedError;
        }
    }
}
