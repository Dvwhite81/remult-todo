'use client';
import { FormEvent, useEffect, useState } from 'react';
import { remult } from 'remult';
import { Task } from '@/shared/Task';
import { TasksController } from '@/shared/TasksController';

const taskRepo = remult.repo(Task);

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await taskRepo.insert({ title: newTaskTitle });
      // setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (error) {
      alert((error as { message: string }).message);
    }
  };

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed);
  };

  useEffect(() => {
    taskRepo
      .find({
        limit: 20,
        orderBy: { createdAt: 'asc' },
        // where: { completed: true },
      })
      .then(setTasks);
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <main>
        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addTask}>
            <input
              value={newTaskTitle}
              placeholder="Add task..."
              onChange={({ target }) => setNewTaskTitle(target.value)}
            />
            <button type="submit">Add Task</button>
          </form>
        )}
        {tasks.map((task) => {
          const setTask = (value: Task) =>
            setTasks((tasks) => tasks.map((t) => (t === task ? value : t)));

          const setCompleted = async (completed: boolean) =>
            // setTask(await taskRepo.save({ ...task, completed }));
            await taskRepo.save({ ...task, completed });

          const setTitle = (title: string) => setTask({ ...task, title });

          const saveTask = async () => {
            try {
              // setTask(await taskRepo.save(task));
              await taskRepo.save(task);
            } catch (error) {
              alert((error as { message: string }).message);
            }
          };

          const deleteTask = async () => {
            try {
              await taskRepo.delete(task);
              // setTasks(tasks.filter((t) => t !== task));
            } catch (error) {
              alert((error as { message: string }).message);
            }
          };

          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={({ target }) => setCompleted(target.checked)}
              />
              <input
                value={task.title}
                onChange={({ target }) => setTitle(target.value)}
              />
              <button type="button" onClick={saveTask}>
                Save
              </button>
              {taskRepo.metadata.apiDeleteAllowed(task) && (
                <button type="button" onClick={deleteTask}>
                  Delete
                </button>
              )}
            </div>
          );
        })}
        <div>
          <button type="button" onClick={() => setAllCompleted(true)}>
            Set All Completed
          </button>
          <button type="button" onClick={() => setAllCompleted(false)}>
            Set All Uncompleted
          </button>
        </div>
      </main>
    </div>
  );
}
