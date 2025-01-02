"use server";

import { db } from "@/server/db";
import { todos } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export const getTodos = async () => {
  return await db.select().from(todos).orderBy(asc(todos.createdAt));
};

export const createTodo = async (id: string, text: string) => {
  if (text.trim() === "error") {
    return { error: true, message: "Failed to create todo" };
  }

  try {
    await db.insert(todos).values({ id, text });
    return { error: false, message: "Todo created" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to create todo" };
  }
};

export const toggleTodo = async (id: string, completed: boolean) => {
  try {
    await db.update(todos).set({ completed }).where(eq(todos.id, id));
    return { error: false, message: "Todo updated" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to update todo" };
  }
};

export const deleteTodo = async (id: string) => {
  try {
    await db.delete(todos).where(eq(todos.id, id));
    return { error: false, message: "Todo deleted" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete todo" };
  }
};
