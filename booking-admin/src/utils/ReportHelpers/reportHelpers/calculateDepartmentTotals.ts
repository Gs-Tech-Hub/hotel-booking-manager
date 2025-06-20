// Types
export type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account' | 'gym_memberships' | 'sport_memberships';

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

export interface ProductCountItem {
  department: DepartmentKey;
  documentId: string | number;
  name: string;
  product_count: number;
}

export type SalesByProduct = Record<string, { units: number; amount: number; amountPaid: number }>;

export const calculateDepartmentTotals = (
  groupedItems: Record<DepartmentKey, DepartmentItem[]>,
  productCountData: ProductCountItem[],
  department: DepartmentKey
) => {
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

  // Ensure all quantities are numbers (sum if array, else keep as is)
  allItems.forEach((item) => {
    if (Array.isArray(item.quantity)) {
      item.quantity = item.quantity.reduce((sum, q) => sum + (q.product_count || 0), 0);
    }
  });

  // Group and sum up quantities for identical items (group by name, not documentId)
  const groupedByName: Record<string, DepartmentItem[]> = {};
  allItems.forEach((item) => {
    const safeName = item.name.trim().toLowerCase();
    if (!groupedByName[safeName]) groupedByName[safeName] = [];
    groupedByName[safeName].push(item);
  });

  // Reduce grouped items and calculate sales
  const updatedItems: DepartmentItem[] = [];
  const salesByProduct: Array<{ name: string; units: number; amount: number; amountPaid: number }> = [];
  const paymentMethods = { cash: 0, other: 0 };
  const departmentTotals = { cashSales: 0, totalTransfers: 0, totalSales: 0 };

  Object.entries(groupedByName).forEach(([name, items]) => {
    const totalQuantity = items.reduce((sum, i) => sum + (typeof i.quantity === 'number' ? i.quantity : 0), 0);
    const base = items[0];
    const amount = totalQuantity * base.price;
    const amountPaid = items.reduce((sum, i) => sum + i.amountPaid, 0);

    // Track payment methods for all items in the group
    items.forEach((i) => {
      const paymentMethod = i.paymentMethods.toLowerCase();
      const itemQuantity = typeof i.quantity === 'number' ? i.quantity : 0;
      const itemAmount = itemQuantity * i.price;
      if (paymentMethod === 'cash') {
        paymentMethods.cash += itemAmount || i.amountPaid;
        if (i.department === department) {
          departmentTotals.cashSales += itemAmount || i.amountPaid;
        }
      } else {
        paymentMethods.other += itemAmount || i.amountPaid;
        if (i.department === department) {
          departmentTotals.totalTransfers += itemAmount || i.amountPaid;
        }
      }
      if (i.department === department) {
        departmentTotals.totalSales += itemAmount || i.amountPaid;
      }
    });

    // Exclude cash/other from product sales
    if (name !== 'cash' && name !== 'other') {
      updatedItems.push({
        ...base,
        quantity: totalQuantity,
      });

      salesByProduct.push({
        name: base.name,
        units: totalQuantity,
        amount,
        amountPaid,
      });
    }
  });

  return { updatedItems, salesByProduct, paymentMethods, departmentTotals };
};
