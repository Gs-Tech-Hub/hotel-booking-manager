// Types
export type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account';

export interface DepartmentItem {
  id: number;
  documentId: number | string | null;
  name: string;
  price: number;
  quantity: number;
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
): { updatedItems: DepartmentItem[]; salesByProduct: SalesByProduct } => {
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

  // Group and sum up quantities for identical items
  const groupedByKey: Record<string, DepartmentItem[]> = {};

  allItems.forEach((item) => {
    const key = `${item.documentId}-${item.name.trim().toLowerCase()}`;
    if (!groupedByKey[key]) groupedByKey[key] = [];
    groupedByKey[key].push(item);
  });

  // Reduce grouped items and calculate sales
  const updatedItems: DepartmentItem[] = [];
  const salesByProduct: SalesByProduct = {};

  Object.entries(groupedByKey).forEach(([key, items]) => {
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const base = items[0]; // preserve other fields from one item
    const amount = totalQuantity * base.price;

    updatedItems.push({
      ...base,
      quantity: totalQuantity,
    });

    salesByProduct[key] = {
      units: totalQuantity,
      amount,
    };
  });

  return { updatedItems, salesByProduct };
};
