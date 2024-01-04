import { createCompletion, loadModel, PromptMessage } from 'gpt4all';

const initModel = async (name: string, options = {}) => {
    const model = await loadModel(name, { ...options }); 

    return model;
}

const start = async (modelName: string, message: string) => {
    const options = { verbose: true };
    const model = await initModel(modelName, options);

    const messages: PromptMessage[] = [
        { role: 'system', content: 'You are a flavor scientist'},
        { role: 'user', content: message }
    ];

    const response = await createCompletion(model, messages);

    model.dispose();

    return response.choices[0].message;
}

start('mistral-7b-openorca.Q4_0.gguf', 'write a haiku about hi-chew').then(console.log);
