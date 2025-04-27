// components/pos/MenuGrid.tsx
import { useCartStore, MenuItem } from "@/app/stores/useCartStore";
import { Button } from "@/components/ui-elements/button";
import { Card } from "@/components/ui-elements/card";
import { formatPrice } from "@/utils/priceHandler";
import { toast } from "react-toastify";


type MenuGridProps = {
  menuItems: MenuItem[] | null | undefined;  // Allowing null or undefined values
};

export default function MenuGrid({ menuItems }: MenuGridProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (item: MenuItem) => {
    if (!item || item.available == null) {
      toast.error(`Can not add item.`);
      return;
    }

    if (item.available === 0 ) {
      toast.warn(`${item.name} is out of stock!`);
      return;
    }

    if (item.available < 10) {
      toast.info(`${item.name} is running low on stock! Only ${item.available} left.`);
    }

    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  if (!menuItems) {
    toast.error("Menu items are not available.");
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menuItems.map((item) => {
          // if (!item || item.name == null || item.price == null || item.available == null) {
          //   return null;  // Skip rendering if any critical field is missing
          // }

          return (
            <Card
              key={item.id}
              title={item.name}
              content={
                <>
                  <p className="text-lg text-gray-500">Price: {formatPrice(item.price, 'NGN')}</p>
                  <p className="text-sm text-gray-500">Available: {item.available}</p>
                  <Button
                    label="Add to Cart"
                    onClick={() => handleAddToCart(item)}
                    className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
                    size="small"
                    variant="dark"
                    disabled={item.available === 0}  // Disable the button if out of stock
                  />
                </>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
