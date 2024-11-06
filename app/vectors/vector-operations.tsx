"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OpenAIEmbeddings } from "@langchain/openai"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { PineconeStore } from "@langchain/community/vectorstores/pinecone"
import { Document } from "@langchain/core/documents"
import { createClient } from "@supabase/supabase-js"
import { Pinecone } from "@pinecone-database/pinecone"

type VectorStore = "supabase" | "pinecone"

export default function VectorOperations() {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState<VectorStore>("supabase")
  const [results, setResults] = useState<Document[]>([])
  const { toast } = useToast()

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      let vectorStore
      if (selectedStore === "supabase") {
        vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
          client: supabase,
          tableName: "documents",
          queryName: "match_documents",
        })
      } else {
        const pineconeIndex = pinecone.Index("langchain-demo")
        vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex,
        })
      }

      const results = await vectorStore.similaritySearch(searchQuery, 5)
      setResults(results)

      toast({
        title: "Success",
        description: `Found ${results.length} relevant documents`,
      })
    } catch (error) {
      console.error("Error performing vector search:", error)
      toast({
        title: "Error",
        description: "Failed to perform vector search",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select
          value={selectedStore}
          onValueChange={(value: VectorStore) => setSelectedStore(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supabase">Supabase</SelectItem>
            <SelectItem value="pinecone">Pinecone</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter your search query..."
            disabled={loading}
          />
        </div>

        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="grid gap-4">
            {results.map((doc, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">
                  Score: {doc.metadata.score?.toFixed(4)}
                </p>
                <p>{doc.pageContent}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 