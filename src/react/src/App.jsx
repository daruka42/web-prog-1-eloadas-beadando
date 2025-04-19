import { Link, Routes, Route } from 'react-router-dom'
import Calculator from './Calculator'
import TodoList from './TodoList'

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">React Beadandó</h1>
      <nav className="mb-4 flex gap-4">
        <Link to="/calculator" className="text-blue-500 hover:underline">Számológép</Link>
        <Link to="/todo" className="text-blue-500 hover:underline">Teendők</Link>
      </nav>
      <Routes>
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="*" element={<p>Válassz egy menüpontot!</p>} />
      </Routes>
    </div>
  )
}