import { useState } from 'react'
import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">shadcn/ui + Vite + React</h1>
        <p className="text-muted-foreground">
          Bây giờ bạn đã có shadcn/ui trong dự án! 🎉
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="flex gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
    </div>
  )
}

export default App
