import { strapiService } from '@/utils/dataEndPoint';
import { CartItem } from '@/app/stores/useCartStore';

export const handleProductCounts = async (items: CartItem[]) => {
  const productCounts: { [key: number]: number } = {}; // Map item ID to productCountId

  for (const item of items) {
    const data: any = {
      product_count: item.quantity,
    };

    if (item.department === 'Bar') {
      data.drink = { connect: item.id };
    } else if (item.department === 'Restaurant') {
      data.food_item = { connect: item.id };
    } else {
      console.warn(`Skipping item with unknown department: ${item.name}`);
      continue;
    }

    try {
      const productCountRes = await strapiService.createProductCount(data);
      if (productCountRes?.id) {
        productCounts[item.id] = productCountRes.id; // Map CartItem.id to the returned product_count ID
      } else {
        throw new Error(`Failed to create product-count for item: ${item.name}`);
      }
    } catch (error) {
      console.error(`Error creating product-count for ${item.name}:`, error);
    }
  }

  console.log('✅ Generated productCounts:', productCounts);
  return productCounts;
};
