"use server"

import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"

export async function generateJoke(topic: string) {
  try {
    const model = new ChatOpenAI({
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = PromptTemplate.fromTemplate(
      "Tell me a short joke about {topic}"
    )

    const chain = prompt.pipe(model)
    const response = await chain.invoke({ topic })
    
    const content = typeof response.content === 'string' 
      ? response.content 
      : JSON.stringify(response.content)
    
    return { content, error: null }
  } catch (error) {
    console.error(error)
    return { 
      content: null, 
      error: "An error occurred while generating the joke" 
    }
  }
} 