"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ChatOpenAI } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { Document } from "@langchain/core/documents"
import * as pdfjsLib from 'pdfjs-dist'

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface ProcessedDocument {
  filename: string
  chunks: number
  summary: string
  pageCount?: number
}

export default function DocumentProcessor() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProcessedDocument | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const readPdfFile = async (file: File): Promise<{ text: string; pageCount: number }> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pageCount = pdf.numPages
    let fullText = ''

    // Extract text from each page
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return { text: fullText, pageCount }
  }

  const processDocument = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Read file content based on type
      let text: string
      let pageCount: number | undefined

      if (file.type === 'application/pdf') {
        const pdfData = await readPdfFile(file)
        text = pdfData.text
        pageCount = pdfData.pageCount
      } else {
        text = await file.text()
      }
      
      // Create a document
      const doc = new Document({ pageContent: text })

      // Split text into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      })
      const chunks = await splitter.splitDocuments([doc])

      // Generate summary using OpenAI
      const model = new ChatOpenAI({
        temperature: 0.7,
        modelName: "gpt-3.5-turbo",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      })

      const summary = await model.predict(
        `Summarize the following document in 2-3 sentences: ${chunks[0].pageContent}`
      )

      setResult({
        filename: file.name,
        chunks: chunks.length,
        summary: summary,
        pageCount,
      })

      toast({
        title: "Success",
        description: "Document processed successfully",
      })
    } catch (error) {
      console.error("Error processing document:", error)
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          type="file"
          accept=".txt,.md,.pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        <Button onClick={processDocument} disabled={!file || loading}>
          {loading ? "Processing..." : "Process Document"}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">File Information</h3>
            <p>Filename: {result.filename}</p>
            <p>Number of chunks: {result.chunks}</p>
            {result.pageCount && <p>Number of pages: {result.pageCount}</p>}
          </div>
          <div>
            <h3 className="font-semibold">Summary</h3>
            <p>{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
} 