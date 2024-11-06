"use server"

import { ChatOpenAI } from "@langchain/openai"
import { BufferMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"

// Initialize the chat model and memory outside the action
const memory = new BufferMemory({
  k: 5,
  returnMessages: true,
})

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  streaming: true,
  apiKey: process.env.OPENAI_API_KEY, // Note: Remove NEXT_PUBLIC_ prefix
  maxRetries: 3, // Add retry attempts
  timeout: 30000, // 30 seconds timeout
})

const chain = new ConversationChain({
  llm: model,
  memory: memory,
})

export async function sendMessage(message: string) {
  try {
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, 30000);
    });

    // Race between the actual request and timeout
    const response = await Promise.race([
      chain.call({
        input: message,
      }),
      timeoutPromise
    ]);

    return { success: true, data: response.response }
  } catch (error) {
    console.error("Error in chat:", error)
    
    // More specific error messages
    let errorMessage = "Failed to get response";
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        errorMessage = "Cannot connect to OpenAI API. Please check your internet connection.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes('API key')) {
        errorMessage = "Invalid API key configuration.";
      }
    }
    
    return { success: false, error: errorMessage }
  }
} 