import React, { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setLog((prev) => [...prev, { role: 'user', message: input }]);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are NARI, an intelligent assistant guided by dharma and purpose.' },
            ...log.map(entry => ({ role: entry.role, content: entry.message })),
            { role: 'user', content: input }
          ]
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response from NARI.';
      setLog((prev) => [...prev, { role: 'assistant', message: reply }]);
    } catch (e) {
      setLog((prev) => [...prev, { role: 'assistant', message: 'NARI encountered a connection issue.' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>NARI Console</h1>
      <div style={{ height: 200, overflowY: 'auto', border: '1px solid white', padding: 10 }}>
        {log.map((entry, idx) => (
          <div key={idx}><strong>{entry.role === 'user' ? 'You' : 'NARI'}:</strong> {entry.message}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder='Ask NARI anything...' style={{ width: '70%' }} />
      <button onClick={handleSubmit} disabled={loading}>{loading ? 'Thinking...' : 'Ask'}</button>
    </div>
  );
}
