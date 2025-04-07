import React, { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';

export type MenuType = 'Breakfast' | 'Lunch' | 'Dinner';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface MenuListProps {
  items: MenuItem[];
  addToCart: (item: MenuItem, menuType: MenuType) => void;
  currency: string;
  formatPrice: (amount: number, currency: string) => string;
}

const MenuList: React.FC<MenuListProps> = ({ items, addToCart, currency, formatPrice }) => {
  const [menuTypeSelections, setMenuTypeSelections] = useState<{ [id: number]: MenuType }>({});
  const { updateSelectedMenu } = useBookingStore();

  const handleMenuTypeChange = (itemId: number, newType: MenuType) => {
    setMenuTypeSelections(prev => ({
      ...prev,
      [itemId]: newType,
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const selectedType = menuTypeSelections[item.id] || 'Lunch';
  
    console.log('Selected Item:', item);
    console.log('Selected Menu Type:', selectedType);
  
    addToCart(item, selectedType);
    updateSelectedMenu(item, selectedType);
  };
  

  return (
    <div className="menu-list">
      {items.map(item => (
        <div key={item.id} className="menu-row">
          <div className="menu-details">
            <h4>{item.name}</h4>
            <p className="menu-price">{formatPrice(item.price, currency)}</p>

            <div className="menu-row">
              <div>
                <label htmlFor={`menuType-${item.id}`}>Select Menu Type:</label>
                <select
                  id={`menuType-${item.id}`}
                  value={menuTypeSelections[item.id] || 'Lunch'}
                  onChange={e => handleMenuTypeChange(item.id, e.target.value as MenuType)}
                  className=""
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <button
                className="add-btn"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;