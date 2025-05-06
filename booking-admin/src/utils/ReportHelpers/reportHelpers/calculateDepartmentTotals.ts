// Types
export type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account';

export interface DepartmentItem {
  id: number;
  documentId: number | string | null;
  name: string;
  price: number;
  quantity: number;
  paymentMethods: string;
  amountPaid: number;
}

export interface ProductCountItem {
  department: DepartmentKey;
  documentId: string | number;
  name: string;
  product_count: number;
}

export type SalesByProduct = Record<string, { units: number; amount: number }>;

export const calculateDepartmentTotals = (
  groupedItems: Record<DepartmentKey, DepartmentItem[]>,
  productCountData: ProductCountItem[]
): { updatedItems: DepartmentItem[]; salesByProduct: Array<{ name: string; units: number; amount: number }>; paymentMethods: { cash: number; other: number } } => {
  const allItems: DepartmentItem[] = [];

  // Flatten all department items into a single list
  Object.values(groupedItems).forEach((items) => {
    allItems.push(...items);
  });

  // Merge product counts into items
  productCountData.forEach((product) => {
    const safeName = typeof product.name === 'string' ? product.name.trim().toLowerCase() : '';
    const matchedItem = allItems.find(
      (item) =>
        item.documentId === product.documentId &&
        item.name.trim().toLowerCase() === safeName
    );
    if (matchedItem) {
      matchedItem.quantity = product.product_count;
    }
  });

  // Group and sum up quantities for identical items (group by name, not documentId)
  const groupedByName: Record<string, DepartmentItem[]> = {};

  allItems.forEach((item) => {
    const safeName = item.name.trim().toLowerCase(); // Normalize item name (case insensitive)
    if (!groupedByName[safeName]) groupedByName[safeName] = [];
    groupedByName[safeName].push(item);
  });

  // Reduce grouped items and calculate sales
  const updatedItems: DepartmentItem[] = [];
  const salesByProduct: Array<{ name: string; units: number; amount: number }> = [];
  const paymentMethods = { cash: 0, other: 0 };

  Object.entries(groupedByName).forEach(([, items]) => {
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0); // Sum up quantities
    const base = items[0]; // Preserve other fields from one item
    const amount = totalQuantity * base.price; // Calculate total amount

    updatedItems.push({
      ...base,
      quantity: totalQuantity, // Update quantity with the summed value
    });

    // Push the sales data as an array of objects with name, units, and amount
    salesByProduct.push({
      name: base.name,
      units: totalQuantity,
      amount,
    });

    // Track payment methods (cash and other)
    const paymentMethod = base.paymentMethods.toLowerCase();
    if (paymentMethod === 'cash') {
      paymentMethods.cash += amount;
    } else {
      paymentMethods.other += amount;
    }
  });

  return { updatedItems, salesByProduct, paymentMethods };
};
