"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ChatOpenAI } from "@langchain/openai"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { createClient } from "@supabase/supabase-js"
import { Document } from "@langchain/core/documents"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RetrievalQAChain } from "langchain/chains"

export default function RagImplementation() {
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const { toast } = useToast()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!context || !question) {
      toast({
        title: "Error",
        description: "Please provide both context and question",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create embeddings
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })

      // Create vector store
      const vectorStore = await SupabaseVectorStore.fromDocuments(
        [new Document({ pageContent: context })],
        embeddings,
        {
          client: supabase,
          tableName: "documents",
          queryName: "match_documents",
        }
      )

      // Create model and chain
      const model = new ChatOpenAI({
        temperature: 0.7,
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())

      // Get answer
      const response = await chain.call({
        query: question,
      })

      setAnswer(response.text)

      toast({
        title: "Success",
        description: "Generated answer based on context",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process the request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Context</label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter the context information..."
            className="h-32"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the context..."
            disabled={loading}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate Answer"}
        </Button>
      </form>

      {answer && (
        <div className="p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
} 