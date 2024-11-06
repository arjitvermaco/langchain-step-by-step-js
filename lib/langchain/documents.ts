import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from "@langchain/core/documents"
import { createChatModel } from "./config"
import { PROMPT_TEMPLATES } from "./config"

export async function processDocument(text: string) {
  // Create document
  const doc = new Document({ pageContent: text })

  // Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const chunks = await splitter.splitDocuments([doc])

  // Generate summary
  const model = createChatModel()
  const summary = await model.predict(
    PROMPT_TEMPLATES.summarize.replace("{text}", chunks[0].pageContent)
  )

  return {
    chunks,
    summary,
  }
}

export async function splitDocuments(docs: Document[]) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  return await splitter.splitDocuments(docs)
} 