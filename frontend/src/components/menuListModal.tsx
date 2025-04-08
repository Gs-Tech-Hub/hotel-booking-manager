'use client';
import { useState } from 'react';
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';
import { allMenuItems } from '@/data/menuData';
import MenuList from '@/components/menuList';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

type MenuType = 'Breakfast' | 'Lunch' | 'Dinner';

interface MenuListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuListModal({ isOpen, onClose }: MenuListModalProps) {
  const [cart, setCart] = useState<{ item: MenuItem; menuType: MenuType }[]>([]);
  const { currency } = useCurrency();

  const addToCart = (item: MenuItem, menuType: MenuType): void => {
    setCart([...cart, { item, menuType }]);
  };

  const removeFromCart = (index: number): void => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, { item }) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

     cart.map(({ menuType }) => menuType).join(', ');
    setCart([]);
    onClose(); // Close after order
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 className="section-title">Our Menu</h2>

        <div className="menu-list">
          <MenuList
            items={allMenuItems}
            addToCart={addToCart}
            currency={currency}
            formatPrice={formatPrice}
          />
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <h3>Your Order</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty. Please add items from the menu.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((cartItem, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-details">
                      <span className="cart-item-name">{cartItem.item.name}</span>
                      <span className="cart-item-price">
                        {formatPrice(cartItem.item.price, currency)}
                      </span>
                      <span className="cart-item-menu-type">({cartItem.menuType})</span>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: {formatPrice(calculateTotal(), currency)}</strong>
              </div>
            </>
          )}
        </div>

        {/* Checkout Section */}
        <div className="checkout-section">
          <button
            className={`checkout-btn ${cart.length === 0 ? 'disabled' : ''}`}
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
