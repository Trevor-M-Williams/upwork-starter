import { redirect } from "next/navigation";
import { checkAdmin } from "@/server/server-only/admin";
import { TodoList } from "./components/todo-list";
import { getTodos } from "@/server/actions/todos";

export default async function Admin() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const todos = await getTodos();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>
      <TodoList initialTodos={todos} />
    </div>
  );
}
