const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message;
        console.log("استلمت طلب من روبلوكس:", userPrompt);

        const apiKey = process.env.GEMINI_API_KEY;
        
        // استخدام النموذج الموصى به gemini-3.8-flash
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            { text: `أنت مساعد خبير في تطوير ألعاب روبلوكس وتكتب أكواد Luau نظيفة واحترافية. المطور طلب منك التالي: "${userPrompt}". اكتب الكود المطلوب أو الإجابة باختصار شديد ووضوح.` }
                        ]
                    }
                ]
            }
        );

        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        console.log("تم توليد الرد بنجاح من الذكاء الاصطناعي");

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("خطأ في الاتصال بالذكاء الاصطناعي:", error.response?.data || error.message);
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب الذكي' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المطور الذكي شغال على البورت ${PORT}`);
});
