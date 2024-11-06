import { Metadata } from "next"
import VectorOperations from "./vector-operations"

export const metadata: Metadata = {
  title: "Vector Operations | LangChain.js Masterclass",
  description: "Vector embeddings and similarity search using multiple vector stores",
}

export default function VectorsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Vector Operations</h1>
        <p className="text-muted-foreground">
          Experiment with document embeddings and vector similarity search
        </p>
      </div>
      <VectorOperations />
    </div>
  )
} 