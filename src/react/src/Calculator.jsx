import { useState } from 'react'

export default function Calculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState(null)

  const calc = () => {
    const sum = parseFloat(a) + parseFloat(b)
    setResult(sum)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Számológép</h2>
      <input
        type="number"
        placeholder="Első szám"
        value={a}
        onChange={e => setA(e.target.value)}
        className="border p-1"
      />
      <input
        type="number"
        placeholder="Második szám"
        value={b}
        onChange={e => setB(e.target.value)}
        className="border p-1"
      />
      <button onClick={calc} className="bg-blue-500 text-white px-3 py-1 rounded">
        Összeadás
      </button>
      {result !== null && <p>Eredmény: {result}</p>}
    </div>
  )
}
