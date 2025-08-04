const scrollBtn = document.getElementById("scroll-btn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

function scrollToBottom() {
  const chatLog = document.getElementById("chat-log");
  chatLog.scrollTop = chatLog.scrollHeight;
}

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatLog = document.getElementById("chat-log");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message === "") return;

  addMessage("user", message);
  input.value = "";
  input.focus();

  const botElement = addMessage("bot", "Valoran piše");
  botElement.classList.add("typing");

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  botElement.classList.remove("typing");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    botElement.textContent += chunk;
    scrollToBottom();
  }

  input.focus();
});

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}-message fade-in`;
  div.textContent = text;
  chatLog.appendChild(div);
  scrollToBottom();
  return div;
}




