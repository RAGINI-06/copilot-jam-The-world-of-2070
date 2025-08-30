const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// ✅ Replace this with your Gemini API key
const API_KEY = "AIzaSyCD7PB0ockxaU9Baa353Nya3zgM5uJh_tk";
// Add a new message to chat
function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-msg" : "ai-msg";
    msgDiv.textContent = text;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message when button clicked
sendBtn.addEventListener("click", sendMessage);

// Also send message when Enter key pressed
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    // Show user message
    addMessage(message, "user");
    chatInput.value = "";

    // Show typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-msg";
    typingDiv.textContent = "AI is typing...";
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }],
                }),
            }
        );

        const data = await response.json();
        console.log(data);

        // Remove typing indicator
        typingDiv.remove();

        // Get AI reply
        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from AI";

        addMessage(reply, "ai");
    } catch (error) {
        console.error("Error:", error);
        typingDiv.remove();
        addMessage("⚠️ Something went wrong!", "ai");
    }
}
