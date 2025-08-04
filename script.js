const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatLog = document.getElementById("chat-box");
const scrollBtn = document.getElementById("scroll-btn");

let conversation = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message === "") return;

  conversation.push({ role: "user", content: message });
  addMessage("user", message);
  input.value = "";
  input.focus();

  const botElement = addMessage("bot", "Valoran piše...");
  botElement.classList.add("typing");

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: conversation })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let botMsg = "";

  botElement.classList.remove("typing");
  botElement.textContent = ""; // odstrani "Valoran piše..."

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    botMsg += chunk;
    botElement.textContent = botMsg;
    scrollToBottom();
  }

  conversation.push({ role: "assistant", content: botMsg });
  scrollToBottom();
});

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}-message fade-in`;
  div.textContent = text;
  chatLog.appendChild(div);
  scrollToBottom();
  return div;
}

function scrollToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});





