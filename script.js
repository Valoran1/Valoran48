const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const scrollBtn = document.getElementById("scroll-btn");

let messages = [];

function addMessage(content, sender, typing = false) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-message" : "bot-message";
  if (typing) {
    const span = document.createElement("span");
    msg.appendChild(span);
    chatBox.appendChild(msg);
    return span;
  } else {
    msg.textContent = content;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.className = "bot-message";
  typing.textContent = "Valoran piše...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function scrollToBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

chatBox.addEventListener("scroll", () => {
  scrollBtn.style.display = chatBox.scrollTop < chatBox.scrollHeight - 300 ? "block" : "none";
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  userInput.value = "";
  messages.push({ role: "user", content: input });

  showTypingIndicator();

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });

    const reply = await res.text();
    removeTypingIndicator();

    const span = addMessage("", "bot", true);
    let words = reply.split(" ");
    let i = 0;

    function typeNextWord() {
      if (i < words.length) {
        span.textContent += (i > 0 ? " " : "") + words[i];
        chatBox.scrollTop = chatBox.scrollHeight;
        i++;
        setTimeout(typeNextWord, 80); // hitrost
      } else {
        messages.push({ role: "assistant", content: reply });
      }
    }

    typeNextWord();
  } catch (err) {
    removeTypingIndicator();
    addMessage("Napaka pri komunikaciji z Valoranom.", "bot");
    console.error(err);
  }
});




