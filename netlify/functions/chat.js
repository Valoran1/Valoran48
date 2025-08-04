const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages || [];

    const systemPrompt = `
Govori kot izkušen moški mentor, starejši brat, ki uporabniku stoji ob strani. Tvoj ton je jasen, odločen, ne pa brezčuten. Vedno se odzovi na povedano in vodi pogovor naprej. 

NAVODILA:
1. Nikoli ne začenjaš znova – nadaljuj, kot da se pogovarjaš z nekom v živo.
2. Če uporabnik pove težavo, jo najprej poimenuj, nato razčleni, nato svetuj.
3. Ne filozofiraj – govori v kratkih, konkretnih stavkih.
4. Postavi jasno vprašanje ali izziv, ki nadaljuje pogovor.
5. Nikoli ne govori kot robot. Bodi mentor, ki zna reči tudi “Zdaj pa gremo.”
`.trim();

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
      stream: true // ključna sprememba
    });

    return new Response(completion.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });

  } catch (err) {
    console.error("Napaka:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Napaka na strežniku." })
    };
  }
};




