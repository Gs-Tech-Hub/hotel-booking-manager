'use client'
import { useState } from 'react';
import Image from 'next/image';

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

  const menuItems = [
    { id: 1, name: 'Grilled Salmon', price: 15.99, image: '/images/dish1.jpg' },
    { id: 2, name: 'Beef Steak', price: 19.99, image: '/images/dish2.jpg' },
    { id: 3, name: 'Vegetarian Pasta', price: 12.99, image: '/images/dish3.jpg' },
    { id: 4, name: 'Premium Red Wine', price: 9.99, image: '/images/drink1.jpg' },
    { id: 5, name: 'Fresh Orange Juice', price: 4.99, image: '/images/drink2.jpg' },
    { id: 6, name: 'Signature Cocktail', price: 8.99, image: '/images/drink3.jpg' },
  ];


const addToCart = (item: MenuItem): void => {
    setCart([...cart, item]);
};

  const handleCheckout = () => {
    alert(`Order placed for ${menuType} in Room ${roomNumber}`);
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
                <Image src={item.image} alt={item.name} width={80} height={80} className="menu-image" />
                <div className="menu-details">
                  <h4>{item.name}</h4>
                  <p className="menu-price">${item.price.toFixed(2)}</p>
                </div>
                <button className="add-btn" onClick={() => addToCart(item)}>Add</button>
              </div>
            ))}
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
            <button className="checkout-btn" onClick={handleCheckout}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}