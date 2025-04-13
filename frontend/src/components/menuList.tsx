import React, { useState } from 'react';
import { useBookingStore, MenuType } from '@/store/bookingStore';

export interface MenuItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  type: 'food' | 'drink';
  localId?: string;
}

interface MenuListProps {
  items: MenuItem[];
  addToCart: (item: MenuItem, menuType: MenuType) => void;
  currency: string;
  formatPrice: (amount: number, currency: string) => string;
}

const menuTypes: MenuType[] = [
  { documentId: 'wmag1r014mv0iuzsfcv50cwj', categoryName: 'Breakfast' },
  { documentId: 'xd34vgdgpqjfk2ryjtebegyl', categoryName: 'Lunch' },
  { documentId: 'svjzbgy4a8cwb8q0bm0kjp00', categoryName: 'Dinner' },
];

const MenuList: React.FC<MenuListProps> = ({ items, addToCart, currency, formatPrice }) => {
  const [menuTypeSelections, setMenuTypeSelections] = useState<{ [id: number]: MenuType }>({});
  const { updateSelectedMenu } = useBookingStore();

  if (!items || !Array.isArray(items)) return <p>No menu items available.</p>;

  // Ensure all items have a localId before rendering
  const itemsWithLocalId: MenuItem[] = items.map(item => ({
    ...item,
    localId: item.localId || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`
  }));

  const handleMenuTypeChange = (itemId: number, selectedDocId: string) => {
    const selectedType = menuTypes.find(type => type.documentId === selectedDocId);
    if (selectedType) {
      setMenuTypeSelections(prev => ({
        ...prev,
        [itemId]: selectedType,
      }));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const selectedType = menuTypeSelections[item.id] || menuTypes[0]; // Default to breakfast
    addToCart(item, selectedType);
    updateSelectedMenu(item, selectedType);
  };

  return (
    <div className="menu-list">
      {itemsWithLocalId.map(item => (
        <div key={item.localId} className="menu-row">
          <div className="menu-details">
            <h4>{item.name}</h4>
            <p className="menu-price">{formatPrice(item.price, currency)}</p>

            <div className="menu-row">
              <div>
                <label htmlFor={`menuType-${item.id}`}>Select Menu Type:</label>
                <select
                  id={`menuType-${item.id}`}
                  value={menuTypeSelections[item.id]?.documentId || menuTypes[0].documentId}
                  onChange={e => handleMenuTypeChange(item.id, e.target.value)}
                >
                  {menuTypes.map(type => (
                    <option key={type.documentId} value={type.documentId}>
                      {type.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <button className="add-btn" onClick={() => handleAddToCart(item)}>
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
