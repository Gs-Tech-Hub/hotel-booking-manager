/* eslint-disable */

export function resolveDepartmentByProductId(
    item: any,
    knownDrinks: Set<number>,
    knownFoods: Set<number>
  ): string | null {
    const product = item.product || item.product_count?.drink || item.product_count?.food_item;
  
    const productId =
      product?.id ?? item.product_count?.drink?.id ?? item.product_count?.food_item?.id;
  
    if (productId) {
      if (knownDrinks.has(productId)) return "bar";
      if (knownFoods.has(productId)) return "restaurant";
    }
  
    return null;
  }
  