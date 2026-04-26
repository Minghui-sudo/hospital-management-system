const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chat = async (req, res) => {
  const { message } = req.body;
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a helpful medical assistant for a hospital management system. 
          Help patients understand their symptoms and suggest which department they should visit.
          Always remind users that this is not a substitute for professional medical advice.
          Be compassionate, clear, and concise. If symptoms are severe or life-threatening, 
          always advise them to call emergency services immediately.
          Always respond in English only, regardless of the language the patient uses.`,
        },
        { role: 'user', content: message }
      ],
      max_tokens: 1024,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service error.' });
  }
};

module.exports = { chat };