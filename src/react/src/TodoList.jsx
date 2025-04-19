import { useState } from 'react'

export default function TodoList() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState([])

  const addTodo = () => {
    if (task.trim()) {
      setTodos([...todos, task])
      setTask('')
    }
  }

  const deleteTodo = index => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Teendők</h2>
      <input
        type="text"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Új teendő..."
        className="border p-1"
      />
      <button onClick={addTodo} className="bg-green-500 text-white px-3 py-1 rounded">
        Hozzáadás
      </button>
      <ul className="list-disc pl-5">
        {todos.map((t, i) => (
          <li key={i} className="flex justify-between items-center">
            {t}
            <button onClick={() => deleteTodo(i)} className="text-red-500 ml-2">
              Törlés
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
