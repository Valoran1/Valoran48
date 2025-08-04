document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-box");
  const scrollBtn = document.getElementById("scroll-btn");

  let conversation = [];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    // Dodaj vprašanje uporabnika
    conversation.push({ role: "user", content: message });
    addMessage("user", message);
    input.value = "";
    input.focus();

    // Prikaži indikator pisanja (tri pikice)
    const botElement = addMessage("bot", "...");
    botElement.classList.add("typing");

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation })
      });

      if (!response.ok || !response.body) {
        botElement.textContent = "Napaka pri povezavi z AI.";
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMsg = "";
      botElement.classList.remove("typing");
      botElement.textContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        botMsg += chunk;
        botElement.textContent = botMsg;
        scrollToBottom();
      }

      conversation.push({ role: "assistant", content: botMsg });
    } catch (err) {
      botElement.textContent = "Prišlo je do napake. Poskusi znova.";
      console.error(err);
    }

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

  // Estetski prikaz gumba za scroll
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = window.scrollY > 100 ? "block" : "none";
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });
});





