"use client";

import { NewCompanyDialog } from "@/components/new-company-dialog";
import { useNewCompanyDialog } from "@/hooks/use-new-company-dialog";
import { Plus } from "lucide-react";

export function AddCompanyCard() {
  const { open } = useNewCompanyDialog();

  return (
    <>
      <div
        className="flex aspect-[3/2] w-80 cursor-pointer items-center justify-center gap-1 rounded border-2 border-dashed bg-gray-100 text-gray-600 hover:border-gray-300"
        onClick={open}
      >
        <Plus className="size-4" />
        <span>Add company</span>
      </div>
      <NewCompanyDialog />
    </>
  );
}
