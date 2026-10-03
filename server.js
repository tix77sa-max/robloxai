const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message;
        console.log("استلمت طلب من روبلوكس:", userPrompt);

        // مفتاح Grok (xAI)
        const apiKey = process.env.XAI_API_KEY;
        
        // الاتصال المباشر بـ Grok API (xAI) باستخدام نموذج grok-beta
        const grokResponse = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'أنت مساعد خبير في تطوير ألعاب روبلوكس وتكتب أكواد Luau نظيفة واحترافية. اكتب الكود المطلوب أو الإجابة باختصار شديد ووضوح.'
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiReply = grokResponse.data.choices[0].message.content;
        console.log("تم توليد الرد بنجاح من Grok");

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("خطأ في الاتصال بـ Grok:", error.response?.data || error.message);
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب الذكي' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المطور الذكي شغال على البورت ${PORT}`);
});
