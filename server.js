const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message;
        console.log("استلمت طلب من روبلوكس:", userPrompt);

        // مفتاح Groq
        const apiKey = process.env.GROQ_API_KEY;
        
        // استخدام نموذج Llama 3.3 الأحدث والنشط حالياً في Groq
        const groqResponse = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
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

        const aiReply = groqResponse.data.choices[0].message.content;
        console.log("تم توليد الرد بنجاح من Llama 3.3");

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("خطأ في الاتصال بـ Groq:", error.response?.data || error.message);
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب الذكي' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المطور الذكي شغال على البورت ${PORT}`);
});
