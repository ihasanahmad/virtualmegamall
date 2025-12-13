document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML if not present
    if (!document.getElementById('chat-widget')) {
        const chatHTML = `
            <div class="chat-widget-btn" onclick="toggleChat()">
                <i class="fa-solid fa-comments"></i>
            </div>

            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <h4>Mega Mall Support</h4>
                    <span class="close-chat" onclick="toggleChat()">×</span>
                </div>
                <div class="chat-body" id="chat-body">
                    <div class="chat-message bot">
                        Hello! 👋 How can we help you today?
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                    <button onclick="sendMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
});

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    // User Message
    addMessage(msg, 'user');
    input.value = "";

    // Simulate Bot Reply
    const chatBody = document.getElementById('chat-body');
    const loadingId = 'loading-' + Date.now();

    // Typing indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot';
    loadingDiv.id = loadingId;
    loadingDiv.innerText = '...';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        document.getElementById(loadingId).remove();
        let reply = "Thanks for reaching out! Our support team is currently busy, but please leave your email and we'll get back to you.";

        if (msg.toLowerCase().includes('order') || msg.toLowerCase().includes('track')) {
            reply = "You can track your order in the 'My Account' section or check your email for the tracking ID.";
        } else if (msg.toLowerCase().includes('return') || msg.toLowerCase().includes('refund')) {
            reply = "We have a 7-day return policy. Please visit our Returns page specifically for brand store items.";
        } else if (msg.toLowerCase().includes('hello') || msg.toLowerCase().includes('hi')) {
            reply = "Hi there! Welcome to Virtual Mega Mall. Happy Shopping! 🛍️";
        }

        addMessage(reply, 'bot');
    }, 1500);
}

function addMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
