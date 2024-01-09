import { createCompletion, loadModel, PromptMessage } from 'gpt4all';
import models from './models.json';

const initModel = async (name: string, options = {}) => {
    const model = await loadModel(name, { ...options }); 
    return model;
}

const start = async (modelName: string) => {
    const modelConfig = Array.isArray(models.models) ? models.models.find((model) => model.name === modelName) : {};

    if (!modelConfig) throw new Error(`Model ${modelName} not found`);

    const {model, userPrompt, systemPrompt, initOptions, completionOptions} = modelConfig;

    console.log(`Initializing model ${model}... \n initOptions: ${JSON.stringify(initOptions)} \n completionOptions: ${JSON.stringify(completionOptions)}`)

    const initializedModel = await initModel(modelConfig.model, initOptions);

    const messages: PromptMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];

    const response = await createCompletion(initializedModel, messages, completionOptions);

    initializedModel.dispose();

    return response.choices[0].message;
}

start('Thorin').then((value) => console.log(value.content));

// TODO: Create additional models 
//  one for sentiment analysis
//  one for summarization, etc.
