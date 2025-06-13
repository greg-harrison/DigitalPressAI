import models from './models.json';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createStory, deleteStory, getStories, getStory, updateStory } from './database';

const app = express();
const port = 8080;

const jsonParser = bodyParser.json();

const LM_STUDIO_API_URL = process.env.LM_STUDIO_API_URL || 'http://localhost:1234/v1/chat/completions';

const start = async (modelName: string, userMessage?: string) => {
    if (!Array.isArray(models.models)) throw new Error('Models must be an array of objects');

    const modelConfig = models.models.find((model) => model.name === modelName);

    if (!modelConfig) throw new Error(`Model ${modelName} not found`);

    const { name, model, messages: modelMessages, completionOptions } = modelConfig;

    // Clone messages so we don't mutate the config across requests
    const messages = JSON.parse(JSON.stringify(modelMessages));

    console.log(name);

    if (userMessage && Array.isArray(messages)) {
        const userMsg = messages.find((message: { role: string; content: string }) => message.role === 'user');
        if (userMsg) {
            userMsg.content += userMessage;
        } else {
            messages.push({ role: 'user', content: userMessage });
        }
    }

    const body = {
        model,
        messages,
        ...completionOptions
    };

    const res = await fetch(LM_STUDIO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw new Error(`LM Studio request failed with status ${res.status}`);
    }

    const response = await res.json();

    return response.choices[0].message;
}

// let story = {}
// start('Thorin').then((value) => {
//     story = JSON.parse(value.content);
//     console.log('STORY:::', story)
//     start('Dwalin', story.body).then((value) => console.log(value));
// });


app.post('/generate', jsonParser, async (req: Request, res: Response) => {
    const { modelName, message } = req.body;
    let response = {};
    response = await start(modelName, message).then((value) => value)

    // TODO: Remove this
    if (modelName === 'Thorin') {
        const story = JSON.parse(response.content);
        response['score'] = await start('Dwalin', story.body).then((value) => value.score);
        const saved = createStory({
            title: story.title ?? '',
            body: story.body,
            sentiment: response['score']
        });
        response['id'] = saved.id;
    }

    res.json(response);
})

app.get('/stories', (_req: Request, res: Response) => {
    res.json(getStories());
});

app.get('/stories/:id', (req: Request, res: Response) => {
    const story = getStory(parseInt(req.params.id));
    if (!story) return res.status(404).send('Not found');
    res.json(story);
});

app.post('/stories', jsonParser, (req: Request, res: Response) => {
    const { title, body, sentiment } = req.body;
    const story = createStory({ title, body, sentiment });
    res.status(201).json(story);
});

app.put('/stories/:id', jsonParser, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    updateStory(id, req.body);
    const updated = getStory(id);
    if (!updated) return res.status(404).send('Not found');
    res.json(updated);
});

app.delete('/stories/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    deleteStory(id);
    res.status(204).end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});


// TODO: Create additional models 
//  one for sentiment analysis
//  one for summarization, etc.
