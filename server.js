const express = require('express');
const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.message || (req.body && req.body.message);
    
    if (!userMessage) {
      return res.status(400).json({ error: 'الرجاء إرسال رسالة أو طلب صالح لـ ATLAS.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model: 'claude-5', // تم تغيير الموديل هنا إلى موديل مدعوم ومضمون
        max_tokens: 4000,
        system: "أنت ATLAS، مساعد برمجي ذكي وخبير في هندسة الأكواد ولغة Luau وتطوير ألعاب روبلوكس.",
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('خطأ من Anthropic API:', data);
      return res.status(500).json({ error: 'خطأ من مزود الذكاء الاصطناعي', details: data });
    }

    const replyText = data.content[0].text;
    res.json({ reply: replyText });

  } catch (error) {
    console.error('خطأ في السيرفر:', error);
    res.status(500).json({ error: 'حدث خطأ داخلي في سيرفر ATLAS.', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ATLAS server is running on port ${PORT}`);
});
