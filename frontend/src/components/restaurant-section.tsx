import Image from 'next/image';

export default function Restaurant() {
  return (
    <section className="restaurant-section">
      <div className="container">
        <div className="titlepage">
          <h2>Our Restaurant</h2>
          <p>Experience fine dining with a blend of exquisite flavors and elegant ambiance.</p>
        </div>
        <div className="restaurant-content">
          <div className="restaurant-image">
            <Image src="/images/restaurant.jpg" alt="Restaurant Interior" width={600} height={400} className="rounded-lg" />
          </div>
          <div className="restaurant-info">
            <h3>Luxury Dining Experience</h3>
            <p>Our hotel restaurant offers a diverse menu crafted by top chefs, featuring gourmet dishes made from fresh, locally sourced ingredients.</p>
            <ul className="restaurant-features">
              <li><i className="fas fa-utensils"></i> International Cuisine</li>
              <li><i className="fas fa-wine-glass-alt"></i> Premium Wine Selection</li>
              <li><i className="fas fa-music"></i> Live Music & Entertainment</li>
            </ul>
            <a href="/restaurant" className="book-btn">Reserve a Table</a>
          </div>
        </div>
      </div>
    </section>
  );
}
