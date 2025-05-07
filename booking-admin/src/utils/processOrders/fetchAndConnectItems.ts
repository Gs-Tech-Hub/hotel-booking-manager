
import { Order, OrderItem, ConnectedItem } from '../../types/order';

export const fetchAndConnectItems = async (
    items: OrderItem[],
    fetchFn: Function,
    type: string,
    order: Order,
    employeeOrders: any[]
  ): Promise<ConnectedItem[]> => {
    const ids: ConnectedItem[] = [];
  
    for (const item of items) {
      const res = await fetchFn({ 'filters[documentId][$eq]': item.documentId });
      const found = res?.[0];
      if (!found) throw new Error(`${type} not found: ${item.documentId}`);
  
      if (
        order.discountPrice &&
        order.selectedStaffId &&
        !employeeOrders.some(e => e[type]?.connect?.id === found.id)
      ) {
        employeeOrders.push({
          discount_amount: order.discountPrice,
          total: order.totalAmount,
          amount_paid: order.finalPrice,
          users_permissions_user: { connect: { id: order.selectedStaffId } },
          [type]: { connect: { id: found.id } },
        });
      }
  
      ids.push({ id: found.id, documentId: found.documentId, bar_stock: found.bar_stock });
    }
  
    return ids;
  };
  