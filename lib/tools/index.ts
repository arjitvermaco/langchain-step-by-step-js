import { Tool } from "@langchain/core/tools"
import { z } from "zod"
import { ChatOpenAI } from "@langchain/openai"

const baseInputSchema = z.object({
  input: z.string(),
})

export class WeatherTool extends Tool {
  name = "weather"
  description = "Get current weather information for a location"
  schema = baseInputSchema

  constructor() {
    super()
  }

  /** @ignore */
  async _call(input: { input: string }) {
    // This is a mock implementation
    // In a real app, you'd call a weather API
    return `The weather in ${input.input} is currently sunny and 22°C`
  }
}

export class WikipediaTool extends Tool {
  name = "wikipedia"
  description = "Search Wikipedia articles"
  schema = baseInputSchema

  constructor() {
    super()
  }

  /** @ignore */
  async _call(input: { input: string }) {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          input.input
        )}`
      )
      const data = await response.json()
      return data.extract || "No information found"
    } catch (_error) {
      return "Failed to fetch Wikipedia information"
    }
  }
}

export class TranslationTool extends Tool {
  name = "translate"
  description = "Translate text to another language. Format: 'text|targetLanguage'"
  schema = baseInputSchema
  private model: ChatOpenAI

  constructor() {
    super()
    this.model = new ChatOpenAI({ 
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    })
  }

  /** @ignore */
  async _call(input: { input: string }) {
    const [text, targetLanguage] = input.input.split('|')
    if (!text || !targetLanguage) {
      return "Please provide both text and target language, separated by |"
    }
    
    try {
      const response = await this.model.predict(
        `Translate the following text to ${targetLanguage}: ${text}`
      )
      return response
    } catch (_error) {
      return "Translation failed"
    }
  }
}

export class NewsSearchTool extends Tool {
  name = "news_search"
  description = "Search for recent news articles about a topic"
  schema = baseInputSchema

  constructor() {
    super()
  }

  /** @ignore */
  async _call(input: { input: string }) {
    try {
      // Mock implementation
      // In a real app, you'd use a news API
      return `Here are the latest news about "${input.input}":
1. Major developments in ${input.input} reported by multiple sources
2. Recent updates about ${input.input} trending on news platforms
3. Expert analysis of ${input.input} published today`
    } catch (_error) {
      return "Failed to fetch news information"
    }
  }
} 