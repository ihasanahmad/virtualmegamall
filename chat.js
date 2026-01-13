document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML if not present
    if (!document.getElementById('chat-widget')) {
        const chatHTML = `
            <div class="chat-widget-btn" onclick="toggleChat()">
                <i class="fa-solid fa-comments"></i>
                <span class="chat-notification-badge" id="chat-notification" style="display:none;">1</span>
            </div>

            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div>
                        <h4>🤖 Virtual Mall Assistant</h4>
                        <p class="chat-status">Online • Ready to help!</p>
                    </div>
                    <span class="close-chat" onclick="toggleChat()">×</span>
                </div>
                <div class="chat-body" id="chat-body">
                    <div class="chat-message bot">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>Hello! 👋 I'm your Virtual Mall Assistant. I can help you with:</p>
                            <div class="quick-replies">
                                <button onclick="sendQuickReply('What\\'s trending?')" class="quick-reply-btn">
                                    🔥 Trending
                                </button>
                                <button onclick="sendQuickReply('Any offers?')" class="quick-reply-btn">
                                    💰 Offers
                                </button>
                                <button onclick="sendQuickReply('Winter items')" class="quick-reply-btn">
                                    ❄️ Winter
                                </button>
                                <button onclick="sendQuickReply('Track my order')" class="quick-reply-btn">
                                    📦 Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask me anything..." onkeypress="handleKeyPress(event)">
                    <button onclick="sendMessage()" class="send-btn">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Show welcome notification after 3 seconds
        setTimeout(() => {
            const badge = document.getElementById('chat-notification');
            if (badge && !sessionStorage.getItem('chat-opened')) {
                badge.style.display = 'flex';
            }
        }, 3000);
    }
});

let conversationHistory = [];

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const badge = document.getElementById('chat-notification');

    chatWindow.classList.toggle('active');

    if (chatWindow.classList.contains('active')) {
        badge.style.display = 'none';
        sessionStorage.setItem('chat-opened', 'true');
        document.getElementById('chat-input').focus();
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendQuickReply(message) {
    const input = document.getElementById('chat-input');
    input.value = message;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    // Add user message to history
    conversationHistory.push({ role: 'user', content: msg });

    // Display user message
    addMessage(msg, 'user');
    input.value = "";

    // Show typing indicator
    showTypingIndicator();

    try {
        // Call backend chatbot API with absolute URL for local testing
        const backendURL = window.location.protocol.includes('file')
            ? 'http://localhost:5000'
            : ''; // Use relative URL when served via HTTP

        const response = await fetch(`${backendURL}/api/chatbot/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: msg,
                userId: localStorage.getItem('userId') || null,
                conversationHistory: conversationHistory
            })
        });

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator();

        if (data.success) {
            // Add bot response to history
            conversationHistory.push({ role: 'assistant', content: data.response });

            // Display bot response
            addMessage(data.response, 'bot');

            // If there's additional data (products, orders, etc.), display it
            if (data.data) {
                displayDataCards(data.data);
            }
        } else {
            addMessage("Sorry, I'm having trouble right now. Please try again!", 'bot');
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addMessage("Oops! I couldn't connect to the server. Please check your connection.", 'bot');
    }
}

function addMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;

    if (sender === 'bot') {
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    }

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chat-body');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function displayDataCards(data) {
    const chatBody = document.getElementById('chat-body');
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'chat-message bot';

    let cardsHTML = '<div class="message-avatar">🤖</div><div class="message-content"><div class="product-cards">';

    if (data.type === 'products' || data.type === 'offers' || data.type === 'seasonal') {
        data.products.forEach(product => {
            const discount = data.type === 'offers' ? `<span class="discount-badge">-${product.discount}%</span>` : '';
            cardsHTML += `
                <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
                    ${discount}
                    <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
                    <div class="product-info">
                        <p class="product-brand">${product.brand || 'Brand'}</p>
                        <h5 class="product-name">${product.name}</h5>
                        <p class="product-price">Rs. ${product.price?.toLocaleString()}</p>
                    </div>
                </div>
            `;
        });
    } else if (data.type === 'orders') {
        data.orders.forEach(order => {
            const statusEmojis = {
                'pending': '⏳',
                'processing': '📦',
                'shipped': '🚚',
                'delivered': '✅',
                'cancelled': '❌'
            };
            cardsHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-number">#${order.orderNumber}</span>
                        <span class="order-status">${statusEmojis[order.status] || '📦'} ${order.status}</span>
                    </div>
                    <div class="order-details">
                        <p>Amount: Rs. ${order.total?.toLocaleString()}</p>
                        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        });
    }

    cardsHTML += '</div></div>';
    cardsDiv.innerHTML = cardsHTML;
    chatBody.appendChild(cardsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
