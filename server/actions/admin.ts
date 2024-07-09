"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function checkAdmin() {
  const userId = auth().userId;
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    if (user.privateMetadata.role === "admin") return true;
  }
  return false;
}
