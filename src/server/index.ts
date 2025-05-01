import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/openai', async (req, res) => {
  try {
    const { messages, model = 'gpt-4', temperature = 0.7 } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ` Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, messages, temperature }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err });
  }
});

app.listen(PORT, () => console.log(`AI proxy server running on http://localhost:${PORT}`));








