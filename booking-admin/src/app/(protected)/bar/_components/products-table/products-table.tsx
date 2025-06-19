import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/priceHandler";
import { ExtendedProduct } from "@/utils/handleDepartmentRecord";

function getAvailabilityStatus(quantity: number, threshold: number) {
  if (quantity === 0) return { label: "Out of Stock", color: "text-red-600" };
  if (quantity <= threshold) return { label: "Low", color: "text-yellow-600" };
  return { label: "In Stock", color: "text-green-600" };
}

export type Product = {
  name: string;
  type: string;
  price: number;
  bar_stock: number; // existing field
  sold: number;
  amount: number;
  amountPaid: number;
  profit: number;
  isFood?: boolean; // Make optional
  isBar?: boolean; // Make optional
  isHotel?: boolean; // Make optional
  showStock?: boolean; // Make optional
  stock?: number; // Make optional
  other_stock?: number; // Make optional
  drink_type: {
    id: number;
    documentId: string;
    typeName: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  } | null;
};


export function ProductsList({
  products,
  filter,
  sort,
}: {
  products: ExtendedProduct[];
  filter?: string;
  sort?: string;
}) {
  let filteredData = [...products];

  // Filtering
  if (filter) {
    filteredData = filteredData.filter((item) => item.type === filter);
  }

  // Sorting
  if (sort) {
    filteredData = filteredData.sort((a, b) => {
      const aValue = a[sort as keyof Product];
      const bValue = b[sort as keyof Product];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue;
      }
      return 0;
    });
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">Products</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Bar Stock</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Units Sold</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((item) => {
            const status = getAvailabilityStatus(item.stock ?? 0, 10);

            return (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={item.name + item.profit}
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{formatPrice((item.price),'NGN')}</TableCell>
                <TableCell>{item.showStock ? item.stock : 'N/A'}</TableCell> {/* Use `stock` */}
                <TableCell className={status.color}>{status.label}</TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell>{formatPrice((item.amount),'NGN')}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
