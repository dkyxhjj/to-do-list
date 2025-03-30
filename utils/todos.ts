import { supabase } from './supabase';

export interface Todo {
  id: number;
  created_at: string;
  task: string;
  due_date: Date | null;
}

// Fetch all todos
export async function fetchTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('due_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
  
  // Convert string dates to Date objects with proper timezone handling
  return (data || []).map(todo => {
    // Handle due_date conversion with proper timezone handling
    let due_date = null;
    if (todo.due_date) {
      // Parse the date parts to avoid timezone issues
      const [year, month, day] = todo.due_date.split('-').map(Number);
      // Create date using UTC (month is 0-indexed in JS Date)
      due_date = new Date(Date.UTC(year, month - 1, day));
    }
    
    return {
      ...todo,
      due_date
    };
  }) as Todo[];
}

// Add a new todo
export async function addTodo(task: string, due_date?: Date | string) {
  const todoData: Record<string, any> = { task };
  
  // Only add due_date if it's provided
  if (due_date) {
    // If due_date is a Date object, convert to ISO string for Supabase
    todoData.due_date = due_date instanceof Date 
      ? due_date.toISOString().split('T')[0] // Just get the date part YYYY-MM-DD
      : due_date;
  }
  
  const { data, error } = await supabase
    .from('todos')
    .insert([todoData])
    .select();
  
  if (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
  
  // Convert the returned due_date string to a Date object with proper timezone handling
  const todo = data[0];
  let parsedDueDate = null;
  
  if (todo.due_date) {
    // Parse the date parts to avoid timezone issues
    const [year, month, day] = todo.due_date.split('-').map(Number);
    // Create date using UTC (month is 0-indexed in JS Date)
    parsedDueDate = new Date(Date.UTC(year, month - 1, day));
  }
  
  return {
    ...todo,
    due_date: parsedDueDate
  } as Todo;
}

// Update a todo
export async function updateTodo(id: number, updates: Partial<Todo>) {
  // If due_date is a Date object, convert to ISO string for Supabase
  const updatesForDb: Record<string, any> = { ...updates };
  if (updates.due_date instanceof Date) {
    updatesForDb.due_date = updates.due_date.toISOString().split('T')[0];
  }
  
  const { data, error } = await supabase
    .from('todos')
    .update(updatesForDb)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
  
  // Convert the returned due_date string to a Date object with proper timezone handling
  const todo = data[0];
  let parsedDueDate = null;
  
  if (todo.due_date) {
    // Parse the date parts to avoid timezone issues
    const [year, month, day] = todo.due_date.split('-').map(Number);
    // Create date using UTC (month is 0-indexed in JS Date)
    parsedDueDate = new Date(Date.UTC(year, month - 1, day));
  }
  
  return {
    ...todo,
    due_date: parsedDueDate
  } as Todo;
}

// Delete a todo
export async function deleteTodo(id: number) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
  
  return true;
}
