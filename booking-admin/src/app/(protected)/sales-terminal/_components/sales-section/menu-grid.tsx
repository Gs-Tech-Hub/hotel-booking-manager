import { useState, useMemo } from "react";
import { useCartStore, MenuItem } from "@/app/stores/useCartStore";
import { Button } from "@/components/ui-elements/button";
import { Card } from "@/components/ui-elements/card";
import { formatPrice } from "@/utils/priceHandler";
import { toast } from "react-toastify";

type MenuGridProps = {
  menuItems: MenuItem[] | null | undefined;
};

export default function MenuGrid({ menuItems }: MenuGridProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddToCart = (item: MenuItem) => {
    if (!item || item.available == null) {
      toast.error(`Can not add item.`);
      return;
    }

    if (item.available === 0) {
      toast.warn(`${item.name} is out of stock!`);
      return;
    }

    if (item.available < 10) {
      toast.info(`${item.name} is running low on stock! Only ${item.available} left.`);
    }

    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-48"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
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
                    disabled={item.available === 0}
                  />
                </>
              }
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            {menuItems ? "No matching items found." : "Menu items are not available."}
          </p>
        )}
      </div>
    </div>
  );
}
