const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const textInput = document.getElementById("user-input");
const scrollBtn = document.getElementById("scroll-btn");

function addMessage(text, isUser) {
  const message = document.createElement("div");
  message.className = "message " + (isUser ? "user-message" : "bot-message");
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function streamResponse(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let result = "";
  const botMsg = document.createElement("div");
  botMsg.className = "message bot-message";
  chatBox.appendChild(botMsg);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    result += chunk;
    botMsg.textContent = result;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  textInput.focus(); // avtomatski fokus
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = textInput.value.trim();
  if (!userInput) return;
  addMessage(userInput, true);
  textInput.value = "";
  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ message: userInput }),
    });
    await streamResponse(response);
  } catch (err) {
    addMessage("Napaka pri pridobivanju odgovora.", false);
  }
});

function scrollToTop() {
  chatBox.scrollTop = 0;
}

window.addEventListener("scroll", () => {
  scrollBtn.classList.toggle("show", window.scrollY > 200);
});




