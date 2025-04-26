import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getAvailabilityStatus(quantity: number, threshold: number) {
  if (quantity === 0 || null) return { label: "Out of Stock", color: "text-red-600" };
  if (quantity <= threshold) return { label: "Low Stock", color: "text-yellow-600" };
  return { label: "High Stock", color: "text-green-600" };
}

export type Product = {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number; 
  threshold: number;
  availability: boolean;
  sold: number | null;
  bar_stock: number;
  restaurant_stock: number;
  supplied: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: string | null;
  drink_type: {
    id: number;
    documentId: string;
    typeName: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  } | null;
  profit?: number; // Optional, assuming it's calculated elsewhere
};

export function ProductsList({
  products,
  filter,
  sort,
}: {
  products: Product[];
  filter?: string;
  sort?: string;
}) {
  let filteredData = [...products];

  // Filtering
  if (filter) {
    filteredData = filteredData.filter(
      (item) => item.drink_type?.typeName === filter
    );
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
            <TableHead>Store</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Bar Stock</TableHead>
            <TableHead>Restaurant Stock</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Supplied</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((item) => {
            const status = getAvailabilityStatus(item.quantity, item.threshold);

            return (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={item.name + item.profit}
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{item.name}</TableCell>
                <TableCell>{item.drink_type?.typeName || 'N/A'}</TableCell>
                <TableCell>₦{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.threshold}</TableCell>
                <TableCell className={status.color}>{status.label}</TableCell>
                <TableCell>{item.bar_stock}</TableCell>
                <TableCell>{item.restaurant_stock}</TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell>{item.supplied}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
