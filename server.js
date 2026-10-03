const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const aiReply = `استلمت رسالتك يا بطل وقريت: "${userMessage}"، جاري بناء اللعبة!`;
        res.json({ reply: aiReply });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر شغال بسلام على البورت ${PORT}`);
});