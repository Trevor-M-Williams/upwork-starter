"use client";
import { Button } from "@/components/ui/button";
import { getFiles } from "@/server/actions/files";

export default function Admin() {
  const handleGetFiles = async () => {
    const files = await getFiles();
    console.log(files);
  };

  return (
    <div>
      <h1>Admin</h1>
      <Button onClick={handleGetFiles}>Get Files</Button>
    </div>
  );
}
