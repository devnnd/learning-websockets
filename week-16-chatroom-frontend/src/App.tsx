import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState<string[]>(["hello reds!!", "heyyyy"]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data as string]);
    };

    wsRef.current = ws;

    ws.onopen = (event) => {
      ws.send(JSON.stringify({
        "type": "join",
        "roomId": "red"
      }));
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <>
      <div className='relative h-screen w-full bg-gray-100'>
        <div className='flex flex-col p-4 gap-1'>
          { messages.map(m => <span className='bg-gray-50 border-1 border-gray-200 text-black rounded-lg p-2' key={Math.random()}>
              {m}
          </span>) }
        </div>

        <div className='w-full absolute bottom-0 flex justify-center bg-gray-200 rounded-2xl p-2 gap-4'>
          <input ref={inputRef} className='rounded-xl px-2 py-1 w-1/2 bg-gray-100 text-black outline-none' placeholder='Type your message here'/>
          <button className='rounded-xl bg-gray-900 px-2 py-1 text-white' onClick={()=>{
            let message = inputRef.current?.value;
            wsRef.current?.send(JSON.stringify({
              "type": "chat",
              "message": message
            }));
          }}>Send</button>
        </div>
      </div>
    </>
  )
}

export default App
