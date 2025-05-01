import { MenuItem } from '@/app/stores/useCartStore';
import { strapiService } from '@/utils/dataEndPoint';

export const handleProductCounts = async (items: MenuItem[]) => {
  const updatedItems: MenuItem[] = [];
  console.log('items:', items);
  console.log('updatedItems:', updatedItems);

  // Iterate over the items and create the product-count entries
  for (const item of items) {
    const data: any = {
      product_count: item.quantity,
    };

    // Handle different departments (Bar or Restaurant)
    if (item.department === 'Bar') {
      console.log('item.department (Bar)', item.id);
      data.drink = { connect: item.id };  // Connect with the drink ID directly
      console.log('data.drink:', data.drink);
    } else if (item.department === 'Restaurant') {
      data.food_item = { connect: item.id };  // Connect with the food item ID directly
      console.log('data.food_item:', data.food_item);
    } else {
      updatedItems.push(item);  // Skip if the department is unknown
      continue;
    }

    try {
      // Call the Strapi service to create the product count
      const productCountRes = await strapiService.createProductCount(data);
      console.log('productCountRes:', productCountRes);

      // If successful, push the updated item with product count ID
      if (productCountRes?.id) {
        updatedItems.push({
          ...item,
          productCountId: productCountRes.id,  // Attach the product count ID to the item
        });
      } else {
        throw new Error(`Failed to create product-count for item: ${item.name}`);
      }
    } catch (error) {
      console.error('Error creating product-count:', error);
    }
  }
  console.log('updatedItems:', updatedItems);
  return updatedItems;
};
