import { Level } from 'level';
import * as path from 'path';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TaskManager {
  private db: Level<string, Task>;

  constructor(dbPath: string = './db') {
    this.db = new Level(path.resolve(dbPath), { valueEncoding: 'json' });
  }

  async initialize(): Promise<void> {
    // Ensure database is ready
    await this.db.open();
  }

  async close(): Promise<void> {
    await this.db.close();
  }

  // Create a new task
  async createTask(title: string, description: string = ''): Promise<Task> {
    // Generate a more unique ID by combining timestamp with random value
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const task: Task = {
      id,
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await this.db.put(id, task);
    return task;
  }

  // Read a single task by ID
  async getTask(id: string): Promise<Task | null> {
    try {
      const task = await this.db.get(id);
      return task || null;
    } catch (error: any) {
      if (error.notFound || error.code === 'LEVEL_NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  // Read all tasks
  async getAllTasks(): Promise<Task[]> {
    const tasks: Task[] = [];
    for await (const [key, value] of this.db.iterator()) {
      tasks.push(value);
    }
    return tasks;
  }

  // Update a task
  async updateTask(id: string, updates: TaskUpdateData): Promise<Task | null> {
    const task = await this.getTask(id);
    if (!task) {
      return null;
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    await this.db.put(id, updatedTask);
    return updatedTask;
  }

  // Delete a task
  async deleteTask(id: string): Promise<boolean> {
    const task = await this.getTask(id);
    if (!task) {
      return false;
    }

    await this.db.del(id);
    return true;
  }

  // Clear all tasks (useful for testing)
  async clearAll(): Promise<void> {
    await this.db.clear();
  }
}

export default TaskManager;