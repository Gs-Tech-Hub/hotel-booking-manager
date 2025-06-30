import { OrderItem, ConnectedItem } from '@/types/order';
import { strapiService } from '@/utils/dataEndpoint';

export const updateDrinkStock = async (items: OrderItem[], drinks: ConnectedItem[]) => {
    for (const item of items) {
      console.log('item:', item);
      const drink = drinks.find(d => d.documentId === item.documentId);
      if (drink && drink.documentId) {
        const newStock = (drink.bar_stock ?? 0) - item.quantity;
        if (newStock < 0) throw new Error(`Insufficient stock for drink: ${item.name}`);
        await strapiService.menuEndpoints.updateDrinksList(drink.documentId, { bar_stock: newStock });
        drink.bar_stock = newStock;
      }
    }
  };