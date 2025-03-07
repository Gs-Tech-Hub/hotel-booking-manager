import React from "react";
import { 
  FaSmokingBan, FaHandPaper, FaKey, 
  FaExclamationTriangle, FaGavel, FaDoorOpen 
} from "react-icons/fa";

const rules = [
  // {
  //   icon: FaDoorOpen, 
  //   title: "Check-in & Check-out", 
  //   description: "Check-in: 3:00 pm | Check-out: 12:00 pm"
  // },
  {
    icon: FaSmokingBan, 
    title: "Smoke-Free Property", 
    description: "Smoking inside the rooms is strictly prohibited and attracts a fine of 100,000 Naira."
  },
  {
    icon: FaHandPaper, 
    title: "No Fighting or Abuse", 
    description: "Fighting or any form of abuse will result in immediate eviction without a refund."
  },
  {
    icon: FaKey, 
    title: "Loss of Key", 
    description: "Losing your sensor card key attracts a fine of N20,000. Locking it inside the room attracts a fine of N1,000. Deposit your key at reception when going out or checking out."
  },
  {
    icon: FaExclamationTriangle, 
    title: "Constituting Nuisance", 
    description: "Using the room for offensive, noisy, dangerous, illegal, or improper purposes is not allowed. Violators will be evicted without refunds."
  },
  {
    icon: FaGavel, 
    title: "Damage of Property", 
    description: "Any damage incurred during your stay will be assessed, and fines will be applied accordingly."
  },
  {
    icon: FaDoorOpen, 
    title: "Room Inspection", 
    description: "The room condition must be inspected before check-out."
  }
];

const HotelInfo = () => {
  return (
    <section className="hotel-info">
      <div className="container">

        <h2 className="section-title">Hotel Policies</h2>
        <div className="row">
          {rules.map((rule, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="hotel-card">
                <div className="hotel-card-body">
                  <rule.icon className="hotel-icon" />
                  <div>
                    <h5 className="hotel-card-title">{rule.title}</h5>
                    <p className="hotel-card-text">{rule.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelInfo;
