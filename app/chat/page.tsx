import { Metadata } from "next"
import ChatInterface from "./chat-interface"

export const metadata: Metadata = {
  title: "Chat Implementation | LangChain.js Masterclass",
  description: "Interactive chat interface with memory and streaming responses",
}

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Chat Implementation</h1>
        <p className="text-muted-foreground">
          Interactive chat interface with memory and streaming responses
        </p>
      </div>
      <ChatInterface />
    </div>
  )
} 