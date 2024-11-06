"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createAgent, type AgentExecutorResult } from "@/lib/langchain/agents"
import { createMemory } from "@/lib/langchain/config"
import { createChatModel } from "@/lib/langchain/config"

interface ChatMessage {
  type: 'query' | 'response'
  content: string
  toolsUsed?: string[]
  isStreaming?: boolean
}

export default function CustomAgent() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const memory = createMemory({
    returnMessages: true,
    memoryKey: "chat_history",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setChatHistory(prev => [...prev, { type: 'query', content: query }])
    
    // Add placeholder for streaming response
    const responseIndex = chatHistory.length + 1
    setChatHistory(prev => [...prev, { 
      type: 'response', 
      content: '', 
      isStreaming: true 
    }])

    try {
      const model = createChatModel()

      const executor = await createAgent(memory)

      const result = await executor.call({
        input: query,
      })

      // Update final response
      setChatHistory(prev => {
        const updated = [...prev]
        if (updated[responseIndex]) {
          updated[responseIndex] = {
            type: 'response',
            content: result.output,
            toolsUsed: result.intermediateSteps.map(
              (step: { action: { tool: string } }) => step.action.tool
            ),
            isStreaming: false,
          }
        }
        return updated
      })

      setQuery("")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to process the query",
        variant: "destructive",
      })
      // Remove the streaming placeholder on error
      setChatHistory(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`${
              message.type === 'query' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'
            } p-4 rounded-lg max-w-[80%] ${message.isStreaming ? 'animate-pulse' : ''}`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.toolsUsed && !message.isStreaming && (
              <div className="mt-2 text-sm opacity-70">
                Tools used: {message.toolsUsed.join(', ')}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the agent to perform a task..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </Button>
      </form>
    </div>
  )
} 