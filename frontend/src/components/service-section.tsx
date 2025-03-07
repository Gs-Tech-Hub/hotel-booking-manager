import React from "react";
import Image from "next/image";

// Define the type for services
interface Service {
  id: number;
  icon: string; // Consider using a more structured approach if using SVGs or icons
  title: string;
  description: string;
}

// Define the props type
interface ServiceSectionProps {
  services: Service[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ services }) => {
  return (
    <section className="services-section spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="titlepage">
              <span>What We Do</span>
              <h2>Discover Our Services</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-lg-4 col-sm-6">
              <div className="service-item">
                <Image src={service.icon} alt={service.title} width={50} height={50} />
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
