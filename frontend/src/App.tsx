import { useEffect, useRef, useState } from 'react'
import './App.css'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  isTyping?: boolean
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

    // add a temporary typing indicator message
    const typingId = 't-' + Date.now()
    const typingMsg: Message = { id: typingId, role: 'assistant', text: '', isTyping: true }
    setMessages((m) => [...m, typingMsg])

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
      // replace typing message with assistant reply
      setMessages((prev) => prev.map((msg) => (msg.id === typingId ? assistantMsg : msg)))
    } catch (err: any) {
      const errMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        text: 'Error: ' + (err?.message ?? 'Unknown error'),
      }
      setMessages((prev) => prev.map((msg) => (msg.id === typingId ? errMsg : msg)))
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

  // escape HTML and convert plain URLs to anchor tags
  function escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function linkify(text: string) {
    // simple URL regex
    const urlRegex = /((https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+(\/[\w\-.,@?^=%&:/~+#]*)?)/g
    return text.replace(urlRegex, (match) => {
      let url = match
      if (!/^https?:\/\//i.test(url)) url = 'http://' + url
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`
    })
  }

  function renderMessageHtml(text: string) {
    if (!text) return ''
    const escaped = escapeHtml(text)
    const withLinks = linkify(escaped)
    // preserve line breaks
    return withLinks.replace(/\n/g, '<br/>')
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
              <div key={m.id} className={`msg ${m.role} ${m.isTyping ? 'typing' : ''}`}>
                <div className="bubble">
                  {m.isTyping ? (
                    <span className="typing-dots" aria-hidden>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                  ) : (
                    <span
                      className="bubble-html"
                      dangerouslySetInnerHTML={{ __html: renderMessageHtml(m.text) }}
                    />
                  )}
                </div>
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
