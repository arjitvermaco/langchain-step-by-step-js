import { Metadata } from "next"
import BasicLangChainDemo from "./basic-langchain-demo"

export const metadata: Metadata = {
  title: "Basic LangChain Setup | LangChain.js Masterclass",
  description: "Learn the basics of LangChain.js with simple examples",
}

export default function BasicsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Basic LangChain Setup</h1>
        <p className="text-muted-foreground">
          Learn the fundamentals of LangChain.js with simple examples
        </p>
      </div>
      <BasicLangChainDemo />
    </div>
  )
} 