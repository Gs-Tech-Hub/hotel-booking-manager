import { strapiService } from '@/utils/dataEndPoint';
import { CartItem } from '@/app/stores/useCartStore';

type ProductCountAssociation = {
  itemId: number;
  productCountId: number;
};

/**
 * Creates product-count records and returns associated item-product_count pairs.
 */
export const handleProductCounts = async (items: CartItem[]): Promise<ProductCountAssociation[]> => {
  const associations: ProductCountAssociation[] = [];

  for (const item of items) {
    const data: any = {
      product_count: item.department === 'Games' ? item.count : item.quantity,
    };

    if (item.department === 'Bar') {
      data.drink = { connect: item.id };
    } else if (item.department === 'Restaurant') {
      data.food_item = { connect: item.id };
    } else if (item.department === 'Games') {
      data.game = item.id;
    } else if (item.department === 'Hotel-Services') {
      data.hotel_service = { connect: item.id };
    } else {
      console.warn(`Skipping item with unknown department: ${item.name}`);
      continue;
    }

    try {
      const res = await strapiService.createProductCount(data);
      if (res?.id) {
        associations.push({
          itemId: item.id,
          productCountId: res.id,
        });
      } else {
        throw new Error(`Failed to create product-count for item: ${item.name}`);
      }
    } catch (error) {
      console.error(`Error creating product-count for ${item.name}:`, error);
    }
  }

  return associations;
};
