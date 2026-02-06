import { useEffect, useRef, useState } from 'react'
import './App.css'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'system',
      text: 'Welcome — ask anything or try a prompt below.',
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // scroll to bottom when messages change
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: String(Date.now()), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: text }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || res.statusText)
      }

      const data = await res.json()
      const reply = data?.reply ?? data?.message ?? String(data)
      const assistantMsg: Message = {
        id: 'a-' + Date.now(),
        role: 'assistant',
        text: reply,
      }
      setMessages((m) => [...m, assistantMsg])
    } catch (err: any) {
      const errMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        text: 'Error: ' + (err?.message ?? 'Unknown error'),
      }
      setMessages((m) => [...m, errMsg])
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!sending) sendMessage()
    }
  }

  return (
    <div id="chat-root">
      <header className="chat-header">
        <h1>KostaGPT</h1>
        <p className="subtitle">A friendly chat interface — talk to your API</p>
      </header>

      <main className="chat-main">
        <aside className="sidebar">
          <div className="new-chat">+ New chat</div>
          <div className="examples">
            <strong>Examples</strong>
            <button
              onClick={() => setInput('Write a short summary of the novel "Dune".')}
            >
              Summarize Dune
            </button>
            <button onClick={() => setInput('Give me 3 ideas for a startup in healthcare')}>
              Startup ideas
            </button>
          </div>
        </aside>

        <section className="chat-panel">
          <div className="messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="composer">
            <textarea
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
            <div className="controls">
              <button
                className="send"
                onClick={sendMessage}
                disabled={sending || input.trim() === ''}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
