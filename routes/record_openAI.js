const express = require("express");
const OpenAI = require("openai");
require("dotenv").config({path:"./config.env"});

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordOPENAIRoutes = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
const OPENAI_RESOURCE = process.env.OPENAI_RESOURCE;

const model = 'BH35Turbo';
const apiVersion = '2023-06-01-preview';

// Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
const openai = new OpenAI({
    OPENAI_KEY,
    baseURL: `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${model}`,
    defaultQuery: { 'api-version': apiVersion },
    defaultHeaders: { 'api-key': OPENAI_KEY },
  });

// This section will help you get a list of all the records.
recordOPENAIRoutes.route("/openAI/:prompt").get(async function (req, response) {
    let prompt = req.params.prompt;
    //console.log(prompt);

    //console.log('Non-streaming:');
    try {
        const result = await openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
        });
        response.write(result.choices[0].message?.content);
        //console.log(result.choices[0].message?.content);
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }  
  });

  module.exports = recordOPENAIRoutes;