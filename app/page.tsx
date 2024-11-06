import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="text-4xl font-bold text-center">
        LangChain.js Masterclass
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/basics">
          <Button className="w-full">Basic LangChain Setup</Button>
        </Link>
        <Link href="/chat">
          <Button className="w-full">Chat Implementation</Button>
        </Link>
        <Link href="/documents">
          <Button className="w-full">Document Processing</Button>
        </Link>
        <Link href="/vectors">
          <Button className="w-full">Vector Operations</Button>
        </Link>
        <Link href="/advanced">
          <Button className="w-full">Advanced Features</Button>
        </Link>
      </div>
    </div>
  )
}
