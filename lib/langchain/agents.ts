import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { Calculator } from "@langchain/community/tools/calculator"
import { WebBrowser } from "langchain/tools/webbrowser"
import { WeatherTool, WikipediaTool, TranslationTool, NewsSearchTool } from "@/lib/tools"
import { createChatModel, createEmbeddings } from "./config"

export async function createAgent(memory: any) {
  const model = createChatModel()
  const embeddings = createEmbeddings()

  const tools = [
    new Calculator(),
    new WebBrowser({ model, embeddings }),
    new WeatherTool(),
    new WikipediaTool(),
    new TranslationTool(),
    new NewsSearchTool(),
  ]

  return await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-conversational-react-description",
    verbose: true,
    memory,
  })
}

export type AgentExecutorResult = {
  output: string
  intermediateSteps: Array<{
    action: {
      tool: string
    }
  }>
} 