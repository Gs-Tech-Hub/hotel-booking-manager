import { OrderItem } from '../../types/order';

export const groupItemsByDepartment = (items: OrderItem[]) => {
    return items.reduce((acc, item) => {
      const dept = item.department || 'General';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(item);
      return acc;
    }, {} as Record<string, OrderItem[]>);
  };