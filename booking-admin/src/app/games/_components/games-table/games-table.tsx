import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";


export type Games = {
  id: number;
  documentId: string;
  count: number;
  game_status: string;
  amount_paid: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  customer: {
    id: number;
    documentId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
};

export function GamesList({
  games,
  filter,
  sort,
  onRowClick,
}: {
  games: Games[];
  filter?: string;
  sort?: keyof Games;
  onRowClick?: (game: Games) => void;
}) {
  let filteredData = [...games];

  // Filtering by game_status
  if (filter) {
    filteredData = filteredData.filter((item) => item.game_status === filter);
  }

  // Sorting
  if (sort) {
    filteredData = filteredData.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return bValue - aValue;
      }
      return 0;
    });
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Games</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Player Name</TableHead>
            <TableHead>Games Played</TableHead>
            <TableHead>Amount Owed</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Activity</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((item) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={item.id}
              onClick={() => onRowClick?.(item)}
              >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                {item.customer.firstName} {item.customer.lastName}
              </TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>₦{item.amount_paid}</TableCell>
              <TableCell>₦{item.amount_paid}</TableCell>
              <TableCell className="capitalize">{item.game_status}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
