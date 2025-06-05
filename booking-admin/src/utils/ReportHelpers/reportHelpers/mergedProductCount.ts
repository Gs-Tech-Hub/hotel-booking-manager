// Types
export interface DepartmentItem {
  id: number;
  documentId: number | string | null;
  name: string;
  price: number;
  quantity: number;
  paymentMethods: string;
  amountPaid: number;
  department: string;
}

interface ProductCountItem {
  product_count: number;
  documentId: string | number;
  department: string;
  name: string;
}

type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account' | 'gym_memberships' | 'sport_memberships';

/**
 * Merges product count data into grouped department items by updating matching quantities.
 * Does not perform aggregation or transformation beyond merging.
 */
export const mergedProductCount = (
  groupedItems: Record<DepartmentKey, DepartmentItem[]>,
  productCountData: ProductCountItem[]
): { updatedItems: Record<DepartmentKey, DepartmentItem[]> } => {
  // Clone to avoid mutating original input
  const updatedItems: Record<DepartmentKey, DepartmentItem[]> = { ...groupedItems };

  for (const product of productCountData) {
    const department = product.department as DepartmentKey;

    // Skip if department does not exist
    if (!updatedItems[department]) continue;

    const safeName = typeof product.name === 'string' ? product.name.trim().toLowerCase() : '';

    // Ensure only valid product names are used for matching
    if (!safeName) continue;

    const matchedItem = updatedItems[department].find(
      (item) =>
        item.documentId === product.documentId &&
        item.name?.trim().toLowerCase() === safeName
    );

    if (matchedItem) {
      matchedItem.quantity = product.product_count;
    }
  }

  return { updatedItems };
};
