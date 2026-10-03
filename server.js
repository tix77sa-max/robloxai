const express = require('express');
const axios = require('axios');
const app = express();

// تفعيل قراءة بيانات الـ JSON القادمة من روبلوكس
app.use(express.json());

// مسار استقبال الطلبات من روبلوكس
app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message;
        console.log("تم استلام رسالة من روبلوكس:", userPrompt);
        
        // رد تجريبي مؤكد للتحقق من نجاح الاتصال وعرضه في روبلوكس
        const aiResponse = `أهلاً بك يا تركي! استلمت طلبك بنجاح: "${userPrompt}". جاري ربط الذكاء الاصطناعي الحقيقي...`;

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error("خطأ في السيرفر:", error);
        res.status(500).json({ error: 'حدث خطأ في معالجة الطلب' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`سيرفر المطور الآلي شغال على البورت ${PORT}`);
});
