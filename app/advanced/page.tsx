import { Metadata } from "next"
import RagImplementation from "./rag-implementation"
import CustomAgent from "./custom-agent"

export const metadata: Metadata = {
  title: "Advanced Features | LangChain.js Masterclass",
  description: "Advanced LangChain.js features including RAG and custom agents",
}

export default function AdvancedPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Advanced Features</h1>
        <p className="text-muted-foreground">
          Explore advanced LangChain.js features including RAG and custom agents
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">RAG Implementation</h2>
          <RagImplementation />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Custom Agent</h2>
          <CustomAgent />
        </section>
      </div>
    </div>
  )
} 