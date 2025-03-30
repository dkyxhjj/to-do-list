"use client"

import { useEffect, useState } from 'react'
import { Todo, fetchTodos, addTodo, deleteTodo } from '../utils/todos'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const loadTodos = async () => {
    try {
      const todos = await fetchTodos()
      setTodos(todos)
    } catch (error) {
      console.error('Error loading todos:', error)
    }
  }
  useEffect(() => {
    loadTodos()
  }, [])
  
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return
    
    setIsLoading(true)
    try {
      // Fix timezone issue by parsing the date parts manually
      let dueDate: Date | undefined = undefined
      if (newDueDate) {
        // Split the date string into parts
        const [year, month, day] = newDueDate.split('-').map(Number)
        // Create date using UTC to avoid timezone issues (month is 0-indexed in JS Date)
        dueDate = new Date(Date.UTC(year, month - 1, day))
      }
      
      await addTodo(newTask, dueDate)
      setNewTask('')
      setNewDueDate('')
      
      // Refetch todos to update the list with the new todo
      await loadTodos()
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id)
      await loadTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
  
  const formatDate = (date: Date | null): string => {
    if (!date) return 'No due date'
    
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() // 0-indexed
    const day = date.getUTCDate()
    
    const localDate = new Date(year, month, day)
    
    return localDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List App</h1>
    
      {/* Add Todo Form */}
      { (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700">
                Task
              </label>
              <input
                type="text"
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter task"
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Todo'}
            </button>
          </form>
        </div>
      )}
      
      {/* Todo List */}
      {(
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos yet. Add your first one above!</p>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo) => (
                <li key={todo.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{todo.task}</h3>
                      {todo.due_date && (
                        <p className={`mt-1 text-orange-600`}>
                          Due: {formatDate(todo.due_date)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(todo.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
