const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// تهيئة الذكاء الاصطناعي باستخدام مفتاح الـ API المخزن في بيئة Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message;
        console.log("استلمت طلب من روبلوكس:", userPrompt);

        // توجيه الذكاء الاصطناعي لكتابة أكواد روبلوكس احترافية
        const fullPrompt = `أنت مساعد خبير في تطوير ألعاب روبلوكس وتكتب أكواد Luau نظيفة واحترافية. المطور طلب منك التالي: "${userPrompt}". اكتب الكود المطلوب أو الإجابة باختصار شديد ووضوح.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        const aiReply = response.text;
        console.log("تم توليد الرد بنجاح من الذكاء الاصطناعي");

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("خطأ في الاتصال بالذكاء الاصطناعي:", error);
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب الذكي' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المطور الذكي شغال على البورت ${PORT}`);
});
