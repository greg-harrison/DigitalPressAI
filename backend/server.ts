import { createCompletion, loadModel, PromptMessage } from 'gpt4all';
import models from './models.json';

const initModel = async (name: string, options = {}) => {
    const model = await loadModel(name, { ...options }); 
    return model;
}

const start = async (modelName: string) => {
    if (!Array.isArray(models.models)) throw new Error('Models must be an array of objects');

    const modelConfig = models.models.find((model) => model.name === modelName);

    if (!modelConfig) throw new Error(`Model ${modelName} not found`);

    const {model, messages, initOptions, completionOptions} = modelConfig;

    const initializedModel = await initModel(model, initOptions);

    const response = await createCompletion(initializedModel, messages as PromptMessage[], completionOptions);

    initializedModel.dispose();

    return response.choices[0].message;
}

start('Thorin').then((value) => console.log(value.content));

// TODO: Create additional models 
//  one for sentiment analysis
//  one for summarization, etc.
