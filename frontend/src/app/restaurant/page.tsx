'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

export default function RestaurantSection() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState('/images/restaurant/restaurant-cover.jpg');
  const [activeTab, setActiveTab] = useState('description');
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
  
  const removeFromCart = (index: number): void => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1);
      }
      return updatedCart;
    });
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    setCart([]);
    router.push(`/booking-summary`);
  };

  const filterItems = (items: MenuItem[]) =>
    items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="restaurant-page">
      <div className="tabs">
        <button
          onClick={() => setActiveTab('description')}
          className={activeTab === 'description' ? 'active' : ''}
        >
          View Our Restaurant
        </button>
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

      {activeTab === 'description' && (
        <div className="description-section">
          <h2>Welcome to Our Restaurant</h2>
          <p>
            Experience the finest dining with a wide selection of African meals and refreshing
            beverages in a clean and comfortable environment.
          </p>
          <Image
            src={selectedImage}
            alt="Restaurant View"
            width={800}
            height={400}
            className="cover-image"
          />
          <div className="thumbnail-gallery">
            <Image
              src="/images/restaurant/DSC_8119.jpg"
              alt="Thumbnail 3"
              width={250}
              height={200}
              className="thumbnail-image"
              onClick={() => setSelectedImage('/images/restaurant/DSC_8119.jpg')}
            />
            <Image
              src="/images/restaurant/DSC_8115.jpg"
              alt="Thumbnail 1"
              width={250}
              height={200}
              className="thumbnail-image"
              onClick={() => setSelectedImage('/images/restaurant/DSC_8115.jpg')}
            />
            <Image
              src="/images/restaurant/DSC_8116.jpg"
              alt="Thumbnail 2"
              width={250}
              height={200}
              className="thumbnail-image"
              onClick={() => setSelectedImage('/images/restaurant/DSC_8116.jpg')}
            />
          </div>
        </div>
      )}

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

          {/* Cart Section */}
          <div className="cart-section">
            <h3>Your Order</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty. Please add items from the menu.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(({ localId, item, menuType, quantity }, index) => (
                    <div
                      key={`${localId}`}
                      className="cart-item"
                    >
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-menu-type">{menuType.categoryName}</span>
                        <span className="cart-item-quantity">Qty: {quantity}</span>
                        <span className="cart-item-price">
                          {formatPrice(item.price * quantity, currency)}
                        </span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        <span>×</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <strong>Total: {formatPrice(calculateTotal(), currency)}</strong>
                </div>
              </>
            )}
            <div className="checkout-section">
              <button
                className={`book-btn ${cart.length === 0 ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
