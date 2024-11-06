import { Document } from "@langchain/core/documents"
import { BaseMessage } from "@langchain/core/messages"
import { CallbackManager } from "@langchain/core/callbacks/manager"
import { BaseMemory } from "@langchain/core/memory"

export interface ChatModelConfig {
  temperature?: number
  streaming?: boolean
  callbacks?: CallbackManager[]
  modelName?: string
}

export interface MemoryConfig {
  returnMessages?: boolean
  memoryKey?: string
  inputKey?: string
  outputKey?: string
}

export interface VectorStoreConfig {
  tableName?: string
  queryName?: string
}

export interface ProcessedDocument {
  chunks: Document[]
  summary: string
}

export interface AgentMemory extends BaseMemory {
  chatHistory: BaseMessage[]
  returnMessages: boolean
  memoryKey: string
}

export interface AgentExecutorResult {
  output: string
  intermediateSteps: Array<{
    action: {
      tool: string
      toolInput: string
      log: string
    }
  }>
} 