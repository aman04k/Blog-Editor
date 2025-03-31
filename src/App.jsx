import { useState } from 'react'
import './App.css'
import BlogEditor from './components/Pages/BlogEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <BlogEditor />
   </>
  )
}

export default App
