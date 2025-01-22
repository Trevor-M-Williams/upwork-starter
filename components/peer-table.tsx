import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertCamelCaseToTitleCase, formatValue } from "@/lib/utils";

type PeerTableProps = {
  companyData: Record<string, any>;
  peerData: Array<{ ticker: string; data: Record<string, any> }>;
};

export function PeerTable({ companyData, peerData }: PeerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Company</TableHead>
          {peerData.map((peer) => (
            <TableHead key={peer.ticker}>{peer.ticker}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-base">
        {Object.keys(companyData).map((key) => (
          <TableRow key={key}>
            <TableCell>
              {convertCamelCaseToTitleCase(key.replace(/TTM$/, ""))}
            </TableCell>
            <TableCell>{formatValue(Number(companyData[key]))}</TableCell>
            {peerData.map((peer) => (
              <TableCell key={`${key}-${peer.ticker}`}>
                {formatValue(Number(peer.data[key]))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
