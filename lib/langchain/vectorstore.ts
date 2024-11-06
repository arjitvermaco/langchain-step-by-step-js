import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { PineconeStore } from "@langchain/community/vectorstores/pinecone"
import { createClient } from "@supabase/supabase-js"
import { Pinecone } from "@pinecone-database/pinecone"
import { Document } from "@langchain/core/documents"
import { createEmbeddings } from "./config"
import type { VectorStoreConfig } from "./types"

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const pinecone = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
})

export async function createSupabaseVectorStore(
  docs?: Document[],
  config?: VectorStoreConfig
) {
  const embeddings = createEmbeddings()
  
  if (docs) {
    return await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client: supabase,
      tableName: config?.tableName ?? "documents",
      queryName: config?.queryName ?? "match_documents",
    })
  }

  return await SupabaseVectorStore.fromExistingIndex(embeddings, {
    client: supabase,
    tableName: config?.tableName ?? "documents",
    queryName: config?.queryName ?? "match_documents",
  })
}

export async function createPineconeVectorStore(docs?: Document[]) {
  const embeddings = createEmbeddings()
  const pineconeIndex = pinecone.Index("langchain-demo")

  if (docs) {
    return await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
    })
  }

  return await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  })
} 