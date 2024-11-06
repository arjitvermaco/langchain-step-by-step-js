import { Metadata } from "next"
import DocumentProcessor from "./document-processor"

export const metadata: Metadata = {
  title: "Document Processing | LangChain.js Masterclass",
  description: "Process and analyze documents using LangChain.js",
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Document Processing</h1>
        <p className="text-muted-foreground">
          Upload and process documents using LangChain.js
        </p>
      </div>
      <DocumentProcessor />
    </div>
  )
} 