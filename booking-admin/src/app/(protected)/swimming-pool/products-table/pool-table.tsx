import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/deprecated/priceHandler";

export function SwimmingPoolList({
  hotelServices,
}: {
  hotelServices: {
    id: number;
    documentId: string;
    name: string;
    price: number;
    quantity: number; // Number of swimmers
    amountPaid: number; // Amount paid
  }[];
}) {
  // Calculate the total amount paid
  const totalAmountPaid = hotelServices.reduce((acc, service) => acc + service.amountPaid, 0);

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        {/* Optional: Add any content here */}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Service Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Number of Users</TableHead>
            <TableHead>Amount Paid</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {hotelServices.map((service) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={service.documentId}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{service.name}</TableCell>
              <TableCell>₦{service.price}</TableCell>
              <TableCell>{service.quantity}</TableCell>
              <TableCell>₦{service.amountPaid}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Row for total amount paid */}
        <TableFooter>
          <TableRow className="text-base font-medium text-dark dark:text-white">
            <TableCell colSpan={3} className="text-right space-between pr-5 sm:pr-6 xl:pr-7.5">Total Amount Paid</TableCell>
            <TableCell>{formatPrice (totalAmountPaid, 'NGN')}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
