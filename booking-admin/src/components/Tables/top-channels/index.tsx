import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getTopChannels } from "../fetch";

export async function TopChannels({ className }: { className?: string }) {
  const data = await getTopChannels();

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Guest List
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Booking-Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="!text-right">Amount Paid</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((channel, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={channel.name + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <div className="">{channel.name}</div>
              </TableCell>

              <TableCell>{channel.name}</TableCell>

              <TableCell className="!text-right text-green-light-1">
                ${standardFormat(channel.revenues)}
              </TableCell>

              <TableCell>{channel.sales}</TableCell>

              <TableCell>{channel.conversion}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
