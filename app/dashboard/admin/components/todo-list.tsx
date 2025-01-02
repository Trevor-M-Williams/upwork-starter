"use client";

import { useState, useRef } from "react";
import { createTodo, toggleTodo, deleteTodo } from "@/server/actions/todos";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

import { toast } from "sonner";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const text = formData.get("text") as string;
    if (!text) return;

    const id = crypto.randomUUID();
    const newTodo = { id, text, completed: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);

    const { error, message } = await createTodo(id, text);
    if (error) {
      console.error(message);
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== newTodo.id));
      toast.error("Failed to create todo");
    } else {
      formRef.current?.reset();
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    console.log(todo);

    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );

    const { error, message } = await toggleTodo(id, !todo.completed);
    if (error) {
      console.error(message);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      );
      toast.error(message);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;

    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));

    const { error, message } = await deleteTodo(id);
    if (error) {
      console.error(message);
      setTodos((prevTodos) => [...prevTodos, todo]);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md">
      <form className="mb-4 flex gap-2" onSubmit={handleAddTodo} ref={formRef}>
        <Input placeholder="Add new todo..." name="text" />
        <Button>Add</Button>
      </form>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="group flex items-center space-x-2">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => handleToggleTodo(todo.id)}
            />
            <Label
              htmlFor={`todo-${todo.id}`}
              className={`flex-grow font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                todo.completed ? "text-gray-500 line-through" : ""
              }`}
            >
              {todo.text}
            </Label>
            <Trash2
              onClick={() => handleDeleteTodo(todo.id)}
              className="h-4 w-4 cursor-pointer text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
