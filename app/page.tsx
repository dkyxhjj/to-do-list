"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: number;     
  text: string;   
  completed: boolean; 
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputTask, setInputTask] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const addTask = () => {
    if (inputTask.trim() === '') return

    const newTask: Task = {
      id: Date.now(),
      text: inputTask,
      completed: false
    }

    setTasks([...tasks, newTask])
    setInputTask('')
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-cyan-100 to-blue-200 text-gray-800'
    }`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800 border-2 border-gray-700' 
            : 'bg-white/80 backdrop-blur-lg'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-bold ${
            theme === 'dark' ? 'text-purple-300' : 'text-indigo-600'
          }`}>
            Task List
          </h1>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' 
                ? 'bg-purple-600 text-white hover:bg-purple-500' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="flex mb-4">
          <input 
            type="text"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()} 
            placeholder="What is due soon!???"
            className={`flex-grow p-3 rounded-l-lg border-2 transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 text-white border-gray-600 focus:border-purple-500' 
                : 'bg-white border-gray-300 focus:border-indigo-500'
            }`}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTask}
            className={`px-4 py-3 rounded-r-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-purple-700 text-white hover:bg-purple-600' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            Add
          </motion.button>
        </div>

        <AnimatePresence>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {tasks.map((task) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center p-3 rounded-lg transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className={`mr-3 h-5 w-5 rounded transition-colors ${
                    theme === 'dark' 
                      ? 'text-purple-500 bg-gray-600' 
                      : 'text-indigo-600 bg-gray-200'
                  }`}
                />
                <span 
                  className={`flex-grow ${
                    task.completed 
                      ? 'line-through text-gray-500' 
                      : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {tasks.some(task => task.completed) && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCompletedTasks}
            className={`mt-4 w-full p-3 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-red-700 text-white hover:bg-red-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            Clear Completed Tasks
          </motion.button>
        )}
        
        <div className={`mt-4 text-center ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {tasks.length > 0 
            ? `${tasks.filter(task => !task.completed).length} tasks remaining` 
            : 'No tasks yet'}
        </div>
      </motion.div>
    </div>
  )
}
