"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Service {
  name: string;
  price: number;
}

const additionalServices: Service[] = [
  { name: "Meals", price: 20 },
  { name: "Pool Access", price: 15 },
  { name: "Laundry", price: 10 },
];

export default function BookingSummary() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") || "N/A";
  const image = searchParams.get("image") || "";
  const amenities = searchParams.get("amenities")?.split(", ") || [];
  const priceOnline = searchParams.get("priceOnline") || "0";

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(parseFloat(priceOnline));

  const toggleService = (service: string) => {
    const isSelected = selectedServices.includes(service);
    const updatedServices = isSelected
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];

    setSelectedServices(updatedServices);

    const servicePrice = additionalServices.find((s) => s.name === service)?.price || 0;
    setTotalPrice((prevTotal) =>
      isSelected ? prevTotal - servicePrice : prevTotal + servicePrice
    );
  };

  const handleConfirmBooking = () => {
    alert(`Booking Confirmed! Total: $${totalPrice}`);
  };

  return (
    <div className="booking-container">
      <h1 className="booking-header">Booking Summary</h1>
      <div className="room-card">
        <div className="room-info">
          {image && <Image src={image} width={350} height={200} className="rounded-lg" alt={name} />}
          <div className="room-details">
            <h2 className="room-name">{name}</h2>
            <p className="room-availability">Amenities: {amenities.join(", ")}</p>
            <p className="price price-online">Online Price: ${totalPrice}</p>
          </div>
        </div>
      </div>

      <h2 className="booking-header mt-4">Additional Services</h2>
      <div className="space-y-2">
        {additionalServices.map((service) => (
          <label key={service.name} className="service-item">
            <span>{service.name} (+${service.price})</span>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.name)}
              onChange={() => toggleService(service.name)}
              className="service-checkbox"
            />
          </label>
        ))}
      </div>

      <div className="total-price">
        <h3>Total Price: <span className="price price-online">${totalPrice}</span></h3>
      </div>

      <button className="book-btn" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
}
