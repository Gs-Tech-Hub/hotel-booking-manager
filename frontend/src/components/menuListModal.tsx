'use client';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';
import MenuList from '@/components/menuList';
import ApiHandler from '@/utils/apiHandler';
import { MenuType } from '@/store/bookingStore';

interface MenuItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  type: 'food' | 'drink';
}

interface MenuListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuListModal({ isOpen, onClose }: MenuListModalProps) {
  const [activeTab, setActiveTab] = useState('foods');
  
  const { currency } = useCurrency();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ 
    localId: string;
    item: MenuItem;
    menuType: MenuType;
    quantity: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [drinksLoading, setDrinksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '' });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const foodRes = await apiHandler.fetchData('food-items?pagination[pageSize]=50');
        const drinksRes = await apiHandler.fetchData('drinks?pagination[pageSize]=50');
        
        const categorizedFoodItems = foodRes.data.map((item: MenuItem) => ({
          ...item,
          type: 'food',
        }));
        
        const categorizedDrinkItems = drinksRes.data.map((item: MenuItem) => ({
          ...item,
          type: 'drink',
        }));

        setMenuItems([...categorizedFoodItems, ...categorizedDrinkItems]);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setFoodLoading(false);
        setDrinksLoading(false);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);


  const addToCart = (item: MenuItem, menuType: MenuType): void => {
    const newLocalId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;

    if (!item.type) {
      setError('The selected item does not have a valid type. Please select a valid item.');
      return;
    }
  
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.item.id === item.id && cartItem.menuType === menuType
      );
  
      if (existingItem) {
        return prevCart.map(cartItem => {
          if (cartItem.item.id === item.id && cartItem.menuType === menuType) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });
      } else {
        return [
          ...prevCart,
          {
            localId: newLocalId,
            item: { ...item, localId: newLocalId },
            menuType,
            quantity: 1
          }
        ];
      }
    });
  };

  // const removeFromCart = (index: number): void => {
  //   setCart(prevCart => {
  //     const updatedCart = [...prevCart];
  //     if (updatedCart[index].quantity > 1) {
  //       updatedCart[index].quantity -= 1;
  //     } else {
  //       updatedCart.splice(index, 1);
  //     }
  //     return updatedCart;
  //   });
  // };

  // const calculateTotal = (): number => {
  //   return cart.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
  // };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    setCart([]);
    onClose(); // Close after order
  };

  const filterItems = (items: MenuItem[]) =>
    items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tabs">
          <button
            onClick={() => setActiveTab('foods')}
            className={activeTab === 'foods' ? 'active' : ''}
          >
            Foods
          </button>
          <button
            onClick={() => setActiveTab('drinks')}
            className={activeTab === 'drinks' ? 'active' : ''}
          >
            Drinks
          </button>
        </div>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <div className="">
          {(activeTab === 'foods' || activeTab === 'drinks') && (
            <>
              <div>
                <h2 className="section-title">
                  {activeTab === 'foods' ? 'Our Menu' : 'Our Drinks'}
                </h2>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                {loading && <p>Loading...</p>}
                {foodLoading && activeTab === 'foods' && <p>Loading food items...</p>}
                {drinksLoading && activeTab === 'drinks' && <p>Loading drink items...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loading && !error && (
                  <div className="menu-list-container">
                    <div className="menu-list">
                      <MenuList
                        items={filterItems(
                          activeTab === 'foods' ? 
                            menuItems.filter(item => item.type === 'food') 
                            : menuItems.filter(item => item.type === 'drink')
                        )}
                        addToCart={addToCart}
                        currency={currency}
                        formatPrice={formatPrice}
                      />
                    </div>
                  </div>
                )}
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
