import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.AI_API_KEY,
});

export default openai

// // Second API call - model continues reasoning from where it left off
// const response2 = await client.chat.completions.create({
//   model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
//   messages, // Includes preserved reasoning_details
// });