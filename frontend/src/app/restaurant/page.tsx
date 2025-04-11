'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';
import MenuList from '@/components/menuList';
import ApiHandler from '@/utils/apiHandler';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

type MenuType = 'Breakfast' | 'Lunch' | 'Dinner';

export default function RestaurantSection() {
  const router = useRouter();
  const [cart, setCart] = useState<{ item: MenuItem; menuType: MenuType }[]>([]);
  const [selectedImage, setSelectedImage] = useState('/images/restaurant/restaurant-cover.jpg');
  const [activeTab, setActiveTab] = useState('description');
  const { currency } = useCurrency();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '' });


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await apiHandler.fetchData('food-items?pagination[pageSize]=50');
        // console.log("food:", res);
        setMenuItems(res.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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
      alert('Please add items to your cart before checking out');
      return;
    }

    setCart([]); // Reset cart after checkout
    router.push(`/booking-summary`);
  };

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
          onClick={() => setActiveTab('order')}
          className={activeTab === 'order' ? 'active' : ''}
        >
          Place Order
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

      {activeTab === 'order' && (
        <div>
          <h2 className="section-title">Our Menu</h2>
          {loading && <p>Loading menu...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && (
            <div className="menu-list">
              <MenuList
                items={menuItems}
                addToCart={addToCart}
                currency={currency}
                formatPrice={formatPrice}
              />
            </div>
          )}

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
                        <span className="cart-item-menu-type">{cartItem.menuType}</span>
                        <span className="cart-item-price">
                          {formatPrice(cartItem.item.price, currency)}
                        </span>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(index)}>
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
          </div>

          {/* Checkout Section */}
          <div className="checkout-section ">
            <button
              className={`checkout-btn ${cart.length === 0 ? 'disabled' : ''}`}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
