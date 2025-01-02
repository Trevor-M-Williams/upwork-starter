"use client";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Company } from "@/types";

export function CompaniesTable({ companies }: { companies: Company[] }) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Ticker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Analysis Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-24 text-center">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((item, index) => (
          <TableRow
            className="cursor-pointer"
            key={index}
            onClick={() => router.push(`/dashboard/companies/${item.id}`)}
          >
            <TableCell>{item.ticker}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>Financial Analysis</TableCell>
            <TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                {item.status === "pending" ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : item.status === "success" ? (
                  <div className="size-3 rounded-full bg-blue-500" />
                ) : (
                  <div className="size-3 rounded-full bg-red-500" />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
