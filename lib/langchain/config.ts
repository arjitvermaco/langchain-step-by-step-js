import { ChatOpenAI } from "@langchain/openai"
import { OpenAIEmbeddings } from "@langchain/openai"
import { BufferMemory } from "langchain/memory"
import type { ChatModelConfig, MemoryConfig } from "./types"

// Base model configuration
export function createChatModel(config?: ChatModelConfig) {
  return new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-4o",
    streaming: false,
    ...config,
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
}

// Embeddings configuration
export function createEmbeddings() {
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
}

// Memory configuration
export function createMemory(options?: MemoryConfig) {
  return new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history",
    ...options,
  })
}

// Common prompt templates
export const PROMPT_TEMPLATES = {
  summarize: "Summarize the following text in 2-3 sentences: {text}",
  analyze: "Analyze the following text and provide key insights: {text}",
  translate: "Translate the following text to {language}: {text}",
  questionAnswer: "Answer the following question based on the context: {context}\n\nQuestion: {question}",
} as const 