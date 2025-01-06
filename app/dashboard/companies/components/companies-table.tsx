"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePolling } from "@/hooks/use-polling";
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
          <TableHead className="text-right">Date</TableHead>
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
            <TableCell className="text-right">
              {item.createdAt.toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
