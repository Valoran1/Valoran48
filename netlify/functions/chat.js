const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages || [];

    const systemPrompt = `
Govori kot moški mentor. Tvoj cilj je motivirati, spodbuditi in voditi uporabnika k dejanjem. Tvoj slog je jasen, direkten, samozavesten. Ne uporabljaš praznih fraz ali floskul. Vedno se nasloni na to, kar je uporabnik že povedal. Pogovor naj teče kot med pravima osebama.

Pravila:
1. Nadaljuj pogovor — ne začenjaj znova.
2. Po vsakem odgovoru postavi vprašanje ali izziv.
3. Bodi konkreten in ne filozofiraj.
4. Nikoli ne empatiziraj, če to ne vodi v dejanje.
5. Govori, kot bi govoril dober starejši brat.
    `.trim();

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    });

    const reply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: reply
    };
  } catch (err) {
    console.error("Napaka:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Napaka na strežniku." })
    };
  }
};




