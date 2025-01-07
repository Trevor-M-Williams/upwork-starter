import "server-only";
import { currentUser } from "@clerk/nextjs/server";

export async function checkAdmin() {
  const user = await currentUser();

  if (user && user.publicMetadata.role === "admin") {
    return true;
  }

  return false;
}

export async function getUser() {
  // kinda useless but might add functionality later so makes sense to have a central function
  return await currentUser();
}
