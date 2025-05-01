import { MenuItem } from '@/app/stores/useCartStore';
import { strapiService } from '@/utils/dataEndPoint';

export const createProductCounts = async (items: MenuItem[]) => {
  const updatedItems: MenuItem[] = [];
  console.log('items', items);
  console.log('updateItems', updatedItems);
  for (const item of items) {
    let productCountRes;

    const data: any = {
      count: item.quantity,
    };
    if (item.department === 'Bar') {
        console.log('item.department', item.id);
        data.drink = { connect: item.id };  // Connect with the id directly
        console.log('data.drink', data.drink);
      } else if (item.department === 'Restaurant') {
        data.food_item = { connect: item.id };  // Connect with the id directly
      } else {
        updatedItems.push(item); // skip if unknown
        continue;
      }
      
    // Create product-count with proper relation
    productCountRes = await strapiService.post('product-counts', { data });
    console.log('productCountRes', productCountRes);

    if (productCountRes?.data?.id) {
      updatedItems.push({
        ...item,
        productCount: productCountRes.data.id,
      });
    } else {
      throw new Error(`Failed to create product-count for item: ${item.name}`);
    }
  }

  return updatedItems;
};
