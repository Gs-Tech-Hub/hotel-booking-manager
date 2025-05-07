/* eslint-disable */
import { CartItem } from '@/app/stores/useCartStore';
import { strapiService } from '../dataEndPoint';
import { ValidatedItem } from '@/types/order';

export const resolveProductCountIds = async (
  items: CartItem[],
  validatedItems: ValidatedItem []
) => {
  const itemToValidId = new Map<number, number>(); // documentId → id

  for (const v of validatedItems) {
    if (v.documentId) {
      itemToValidId.set(Number(v.documentId), Number(v.id));
    }
  }

  const productCountResults: { itemId: number; productCountId: number }[] = [];

  for (const item of items) {
    const validItemId = itemToValidId.get(Number(item.documentId));
    if (!validItemId) {
      console.warn(`⚠️ No valid ID found for item ${item.name} (${item.documentId})`);
      continue;
    }

    const data: any = {
      product_count: item.department === 'Games' ? item.count : item.quantity,
    };

    if (item.department === 'Bar') {
      data.drink = { connect: Number(validItemId) };
    } else if (item.department === 'Restaurant') {
      data.food_item = { connect: Number(validItemId) };
    } else if (item.department === 'Games') {
      data.game = Number(validItemId);
    } else if (item.department === 'Hotel-Services') {
      data.hotel_service = { connect: Number(validItemId) };
    } else {
      console.warn(`Unknown department for item: ${item.name}`);
      continue;
    }

    const res = await strapiService.createProductCount(data);
    if (res?.id) {
      productCountResults.push({ itemId: item.id, productCountId: res.id });
    } else {
      console.error(` Failed to create product count for ${item.name}`);
    }
  }

  return new Map(productCountResults.map(r => [r.itemId, r.productCountId]));
};
