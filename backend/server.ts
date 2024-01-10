import { createCompletion, loadModel, PromptMessage } from 'gpt4all';
import models from './models.json';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

const jsonParser = bodyParser.json();

const initModel = async (name: string, options = {}) => {
    const model = await loadModel(name, { ...options }); 
    return model;
}

const start = async (modelName: string, userMessage?: string) => {
    if (!Array.isArray(models.models)) throw new Error('Models must be an array of objects');

    const modelConfig = models.models.find((model) => model.name === modelName);

    if (!modelConfig) throw new Error(`Model ${modelName} not found`);

    const {name, model, messages, initOptions, completionOptions} = modelConfig;

    console.log(name)

    const initializedModel = await initModel(model, initOptions);

    if (userMessage && Array.isArray(messages)) {
        messages.find((message) => message.role === 'user').content += userMessage;
    }

    const response = await createCompletion(initializedModel, messages as PromptMessage[], completionOptions);

    initializedModel.dispose();

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
    }

    res.json(response);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});


// TODO: Create additional models 
//  one for sentiment analysis
//  one for summarization, etc.
