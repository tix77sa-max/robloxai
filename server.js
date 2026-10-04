const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.json());

// تهيئة عميل Anthropic باستخدام المتغير البيئي الآمن اللي حطيناه في Render
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.message || (req.body && req.body.message);
    
    if (!userMessage) {
      return res.status(400).json({ error: 'الرجاء إرسال رسالة أو طلب صالح لـ ATLAS.' });
    }

    // إرسال الطلب إلى نموذج Claude 3.5 Sonnet المخصص لكتابة الأكواد
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: "أنت ATLAS، مساعد برمجي ذكي وخبير في هندسة الأكواد ولغة Luau وتطوير ألعاب روبلوكس. وظيفتك هي إعطاء أكواد نظيفة، دقيقة، وجاهزة للاستخدام بدون أخطاء، مع توضيح بسيط إذا لزم الأمر.",
      messages: [
        { role: 'user', content: userMessage }
      ],
    });

    // استخراج رد الذكاء الاصطناعي وإرجاعه لروبلوكس استديو
    const replyText = response.content[0].text;
    res.json({ reply: replyText });

  } catch (error) {
    console.error('خطأ في الاتصال بـ Claude API:', error);
    res.status(500).json({ error: 'حدث خطأ داخلي في سيرفر ATLAS.', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ATLAS server is running on port ${PORT}`);
});
