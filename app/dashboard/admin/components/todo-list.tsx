"use client";

import { useOptimistic, useState, useRef, useTransition } from "react";
import { createTodo, toggleTodo } from "@/server/actions/todos";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface OptimisticTodo extends Todo {
  pending?: boolean;
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [optimisticTodos, setOptimisticTodos] =
    useOptimistic<OptimisticTodo[]>(todos);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const text = formData.get("text") as string;
    if (!text) return;

    const newTodo = { id: Date.now().toString(), text, completed: false };
    setOptimisticTodos((prevTodos) => [...prevTodos, newTodo]);

    const { error, todo } = await createTodo(text);
    if (error) {
      toast.error("Failed to create todo");
    } else {
      setTodos((prevTodos) => [...prevTodos, todo!]);
      formRef.current?.reset();
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = optimisticTodos.find((todo) => todo.id === id);
    if (!todo) return;

    setOptimisticTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );

    const { error, message } = await toggleTodo(id, !todo.completed);
    if (error) {
      toast.error(message);
    } else {
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        ),
      );
    }
  };

  return (
    <div className="max-w-md">
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => startTransition(() => handleAddTodo(e))}
        ref={formRef}
      >
        <Input placeholder="Add new todo..." name="text" />
        <Button disabled={isPending}>Add</Button>
      </form>

      <div className="space-y-2">
        {optimisticTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center space-x-2 ${
              todo.pending ? "opacity-50" : ""
            }`}
          >
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() =>
                startTransition(() => handleToggleTodo(todo.id))
              }
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                todo.completed ? "text-gray-500 line-through" : ""
              }`}
            >
              {todo.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
