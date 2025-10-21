const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

window.onload = () => {
    const savedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    savedMessages.forEach(msg => addMessage(msg.text, msg.type, msg.time, false));
    chatBox.scrollTop = chatBox.scrollHeight;
};

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;

    if (messageInput.disabled) return;
    messageInput.disabled = true;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addMessage(text, "sent", time, true);
    saveMessage(text, "sent", time);
    messageInput.value = "";


    setTimeout(() => {
        let reply;
         const lowerText = text.toLowerCase();

        if (text.toLowerCase().includes("hello")) {
            reply = "Hi there! 👋";
        } else if (text.toLowerCase().includes("how are you")) {
            reply = "I'm doing great, thanks for asking!";
        } else if (text.toLowerCase().includes("bye")) {
            reply = "Goodbye! 👋 Have a nice day!";
        } else {
            reply = "That's interesting!";
        }

        // const reply = replies[Math.floor(Math.random() * replies.length)];
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        addMessage(reply, "received", botTime, true);
        saveMessage(reply, "received", botTime);
    }, 1000);
}

function addMessage(text, type, time, scroll = true) {
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.innerHTML = `
    <div>${text}</div>
    <span class="timestamp">${time}</span>
    `;
    chatBox.appendChild(msg);

    if (scroll) chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessage(text, type, time) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ text, type, time });
    localStorage.setItem("messages", JSON.stringify(messages));
}