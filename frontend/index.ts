import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/story', async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  try {
    const backendRes = await fetch('http://localhost:8080/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelName: 'Thorin', message: prompt })
    });

    const data = await backendRes.json();
    const story = JSON.parse(data.content);

    res.json({ story, score: data.score });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
