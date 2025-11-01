import express, { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import TaskManager, { TaskCreateData, TaskUpdateData } from './taskManager';
import { Server } from 'http';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const envMessage = process.env.MSG_ENV || 'hello world';
const taskManager = new TaskManager(path.resolve(__dirname, '../db'));

let counter = 0;
const heartbeat = setInterval(() => {
  console.log(`Counter: ${counter} - EnvMessage: ${envMessage}`);
  counter++;
}, 1000);
heartbeat.unref();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
taskManager.initialize().catch(console.error);

// Serve the HTML frontend
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Create a new task
app.post('/api/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description }: TaskCreateData = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    const task = await taskManager.createTask(title, description);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
app.get('/api/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await taskManager.getAllTasks();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single task
app.get('/api/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskManager.getTask(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed }: TaskUpdateData = req.body;
    const updates: TaskUpdateData = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const task = await taskManager.updateTask(req.params.id, updates);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await taskManager.deleteTask(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

const server: Server = app.listen(port, () => {
  console.log(`Task List API listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await taskManager.close();
    console.log('HTTP server closed');
  });
});

export { app, taskManager };