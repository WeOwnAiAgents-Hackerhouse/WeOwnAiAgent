import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Set the runtime to edge for streaming
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Ensure the API key exists
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    // Create the system message for portfolio management
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for MyIRA, a platform that helps users manage their crypto portfolio across multiple chains for retirement planning.
      
      Your primary goal is to help users:
      1. Understand their current portfolio across different chains (Ethereum, Optimism, Base)
      2. Provide insights on portfolio diversification and risk management
      3. Offer retirement planning advice based on their crypto holdings
      4. Guide them through the process of setting up a Self-Directed IRA for crypto
      
      When users ask about their portfolio, you can provide mock data for demonstration purposes.
      Be helpful, concise, and focus on providing actionable advice.`
    };

    // Add the system message to the beginning of the messages array
    const augmentedMessages = [systemMessage, ...messages];

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: augmentedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Error processing your request', { status: 500 });
  }
} 