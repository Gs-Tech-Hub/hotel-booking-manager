'use client'
import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/utils/priceHandler';
import { useCurrency } from '@/context/currencyContext';

// import { i, image } from 'framer-motion/client';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function RestaurantSection() {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [menuType, setMenuType] = useState('Lunch');
  const [roomNumber, setRoomNumber] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const { currency } = useCurrency();

  const menuItems = [
    { id: 1, name: 'Jollof Rice, Salad and Goat Meat', price: 6500, image: '/images/dish1.jpg' },
    { id: 2, name: 'Jollof Rice, Salad and Chicken', price: 8000, image: '/images/dish2.jpg' },
    { id: 3, name: 'Jollof Rice, Salad and Turkey', price: 11500, image: '/images/dish3.jpg' },

    { id: 4, name: 'Fried Rice, Salad and Goat Meat', price: 6500, image: '/images/drink1.jpg' },
    { id: 5, name: 'Fried Rice, Salad and Chicken', price: 8000, image: '/images/drink2.jpg' },
    { id: 6, name: 'Fried Rice, Salad and Turkey', price: 11000, image: '/images/drink3.jpg' },

    { id: 7, name: ' Goat Meat Sauce', price: 5000, image: '/images/dish1.jpg' },
    { id: 8, name: ' Chicken Sauce', price: 6000, image: '/images/dish2.jpg' },
    { id: 9, name: ' Turkey Sauce', price: 8000, image: '/images/dish3.jpg' },

    { id: 10, name: 'Goat Meat pepper Soup', price: 5000, image: '/images/drink1.jpg' },
    { id: 11, name: 'White Rice with Goat Meat Pepper Soup', price: 7000, image: '/images/drink2.jpg' },

    { id: 12, name: 'Eba/Semo/Poundo with Melon Soup and Goat Meat', price: 8000, image: '/images/drink3.jpg' },
    { id: 13, name: 'Eba/Semo/Poundo with Melon Soup and Chicken', price: 10000, image: '/images/dish1.jpg' },
    { id: 14, name: 'Eba/Semo/Poundo with Melon Soup and Turkey', price: 13000, image: '/images/dish2.jpg' },

    { id: 15, name: 'Eba/Semo/Poundo with Ogbono Soup and Goat Meat', price: 8000, image: '/images/drink1.jpg' },
    { id: 16, name: 'Eba/Semo/Poundo with Ogbono Soup and Chicken', price: 10000, image: '/images/dish1.jpg' },
    { id: 17, name: 'Eba/Semo/Poundo with Ogbono Soup and Turkey', price: 13000, image: '/images/dish2.jpg' },

    { id: 18, name: 'Eba/Semo/Poundo with Banga Soup and Goat Meat', price: 8000, image: '/images/drink1.jpg' },
    { id: 19, name: 'Eba/Semo/Poundo with Banga Soup and Chicken', price: 10000, image: '/images/dish1.jpg' },
    { id: 20, name: 'Eba/Semo/Poundo with Banga Soup and Turkey', price: 13000, image: '/images/dish2.jpg' },

    { id: 21, name: 'bread, Egg and Tea', price: 5000, image: '/images/drink1.jpg' },
    { id: 22, name: 'chips and Sausage', price: 5000, image: '/images/drink2.jpg' },
    { id: 23, name: 'chips and Chicken', price: 5000, image: '/images/drink3.jpg' },

    { id: 24, name: 'Fried Plantain', price: 1500, image: '/images/drink1.jpg' },
    { id: 25, name: 'Fried Plantain and Egg Sauce', price: 4500, image: '/images/drink2.jpg' },

    { id: 26, name: 'Fried Yam and Egg Sauce', price: 5500, image: '/images/drink3.jpg' },

    { id: 27, name: 'Fried Yam, Egg and Goat Meat', price: 7500, image: '/images/drink1.jpg' },
    { id: 28, name: 'Fried Yam, Egg and Chicken', price: 10500, image: '/images/drink2.jpg' },
    { id: 29, name: 'Fried Yam, Egg and Turkey', price: 12500, image: '/images/drink3.jpg' },

    { id: 30, name: 'Yam Porridge', price: 5500, image: '/images/drink1.jpg' },

    { id: 31, name: 'Noodle with Egg', price: 4000, image: '/images/drink1.jpg'},
    { id: 32, name: 'Noodle with Goat Meat', price: 5500, image: '/images/drink1.jpg'},
    { id: 33, name: 'Noodle with Chicken', price: 7500, image: '/images/drink1.jpg'},
    { id: 34, name: 'Noodles, Egg and Goat Meat', price: 6500, image: '/images/drink1.jpg'},
    { id: 35, name: 'Noodles, Egg and Chicken', price: 6500, image: '/images/drink1.jpg'},
    { id: 36, name: 'Noodles, Egg and Turkey', price: 11000, image: '/images/drink1.jpg'},

    { id: 37, name: 'Spaghetti with Chicken', price: 9000, image: '/images/drink1.jpg' },
    { id: 38, name: 'Spaghetti with Goat Meat', price: 6500, image: '/images/drink1.jpg' },
    { id: 39, name: 'Spaghetti with Turkey', price: 11000, image: '/images/drink1.jpg' },
    { id: 40, name: 'Spaghetti with Egg', price: 5500, image: '/images/drink1.jpg' },

    { id: 41, name: 'Spaghetti with Egg and Goat Meat', price: 8000, image: '/images/drink1.jpg' },
    { id: 42, name: 'Spaghetti with Egg and Chicken', price: 10000, image: '/images/dish1.jpg' },
    { id: 43, name: 'Spaghetti with Egg and Turkey', price: 13000, image: '/images/dish2.jpg' },

    { id: 44, name: 'White Rice Stew and Goat Meat', price: 6500, image: '/images/drink1.jpg' },
    { id: 45, name: 'White Rice Stew and Chicken', price: 8500,  image: '/images/dish2.jpg' },
    { id: 46, name: 'White Rice Stew and Turkey', price: 11500, image: '/images/dish3.jpg' },

  ];


const addToCart = (item: MenuItem): void => {
    setCart([...cart, item]);
};

const removeFromCart = (index: number): void => {
  const newCart = [...cart];
  newCart.splice(index, 1);
  setCart(newCart);
};

const calculateTotal = (): number => {
  return cart.reduce((total, item) => total + item.price, 0);
};

const handleCheckout = () => {
  if (cart.length === 0) {
    alert('Please add items to your cart before checking out');
    return;
  }
  
  if (!roomNumber) {
    alert('Please enter your room number');
    return;
  }
  
  alert(`Order placed for ${menuType} in Room ${roomNumber}`);
  setCart([]);
};

  return (
    <div className="restaurant-page">
      <div className="tabs">
        <button onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'active' : ''}>View Our Restaurant</button>
        <button onClick={() => setActiveTab('order')} className={activeTab === 'order' ? 'active' : ''}>Place Order</button>
      </div>
      
      {activeTab === 'description' && (
        <div className="description-section">
          <h2>Welcome to Our Restaurant</h2>
          <p>Experience the finest dining with a wide selection of African meals and refreshing beverages in a clean and comfortable environment.</p>
          <Image src="/images/restaurant/restaurant-cover.jpg" alt="Restaurant Interior" width={800} height={400} className="cover-image" />
          <div className="thumbnail-gallery">
          <Image src="/images/restaurant/DSC_8119.jpg" alt="Thumbnail 3" width={250} height={200} className="thumbnail-image" />
          <Image src="/images/restaurant/DSC_8115.jpg" alt="Thumbnail 1" width={250} height={200} className="thumbnail-image" />
          <Image src="/images/restaurant/DSC_8116.jpg" alt="Thumbnail 2" width={250} height={200} className="thumbnail-image" />
          </div>
        </div>
      )}
      
      {activeTab === 'order' && (
  <div>
    <h2 className="section-title">Our Menu</h2>
    <div className="menu-list">
      {menuItems.map((item) => (
        <div key={item.id} className="menu-row">
          {/* <Image src={item.image} alt={item.name} width={80} height={80} className="menu-image" /> */}
          <div className="menu-details">
            <h4>{item.name}</h4>
            <p className="menu-price">{formatPrice(item.price, currency)}</p>
          </div>
          <button className="add-btn" onClick={() => addToCart(item)}>Add</button>
        </div>
      ))}
    </div>
    
    {/* Cart Section */}
    <div className="cart-section">
      <h3>Your Order</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add items from the menu.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{formatPrice(item.price, currency)}</span>
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
    <div className="checkout-section">
      <h3>Checkout</h3>
      <label>Menu Type:
        <select value={menuType} onChange={(e) => setMenuType(e.target.value)}>
          <option>Lunch</option>
          <option>Dinner</option>
        </select>
      </label>
      <label>Room Number:
        <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Enter room number" />
      </label>
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