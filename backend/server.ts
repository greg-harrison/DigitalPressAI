// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
import { createCompletion, loadModel, PromptMessage } from 'gpt4all';

// const app = express();
// const port = 3000;

// const jsonParser = bodyParser.json();

const initModel = async (name: string, options = {}) => {
    const model = await loadModel(name, { ...options }); 

    return model;
}

const start = async (modelName: string, message: string) => {
    const options = { verbose: true };
    const model = await initModel(modelName, options);

    const messages: PromptMessage[] = [
        { role: 'user', content: message }
    ];

    const response = await createCompletion(model, messages);

    return response;
}

start('mistral-7b-openorca.Q4_0.gguf', 'Please write a haiku about the sun').then(console.log);

// app.post('/generate', jsonParser, async (req: Request, res: Response) => {
    // const { modelName, messages, options } = req.body;
    // res.json(response);
// });

// app.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });
