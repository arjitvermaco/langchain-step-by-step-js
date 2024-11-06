"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { generateJoke } from "@/app/actions/openai"

export default function BasicLangChainDemo() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [topic, setTopic] = useState("acting")

  const runDemo = async () => {
    setLoading(true)
    try {
      const { content, error } = await generateJoke(topic)
      if (error) {
        throw new Error(error)
      }
      setResult(content || "")
    } catch (error) {
      console.error(error)
      setResult("An error occurred while running the demo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter a topic for the joke"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="max-w-xs"
      />
      
      <Button 
        onClick={runDemo} 
        disabled={loading}
      >
        {loading ? "Running..." : "Run Basic Demo"}
      </Button>
      
      {result && (
        <div className="p-4 border rounded-lg">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
} 