import React from "react";
import Image from "next/image";

const facilities = [
  { image: "/images/facilities/room.jpg", title: "Rooms", count: 30 },
  { image: "/images/facilities/suite.jpg", title: "Suites", count: 5 },
  { image: "/images/facilities/pool.Jpeg", title: "Swimming Pools", count: 1 },
  { image: "/images/facilities/games.jpg", title: "Games Area", count: 1 },
  { image: "/images/facilities/club.jpg", title: "Night Club", count: 1 },
  { image: "/images/facilities/bar.jpg", title: "Bars", count: 2 },
];

const HotelFacilities: React.FC = () => {
  return (
    <section className="hotel-info">
      <div className="container">
        <h2 className="section-title">Our Facilities & Stats</h2>
        <div className="hotel-grid">
          {facilities.map((facility, index) => (
            <div key={index} className="hotel-card">
              <div className="hotel-image-wrapper">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  width={150}
                  height={150}
                  className="hotel-image"
                />
              </div>
              <div className="hotel-card-body">
                <h3 className="hotel-card-title">{facility.title}</h3>
                <p className="hotel-card-text">{facility.count} Available</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelFacilities;
