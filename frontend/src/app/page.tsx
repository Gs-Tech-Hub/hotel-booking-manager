"use client"
import { useEffect, useState } from 'react';
import ApiHandler from '@/utils/apiHandler';
import BannerCarousel from '@/components/Banner/Carousel'
import BookingForm from '@/components/booking-form'
import AboutSection from '@/components/about-section'
import RoomSection from '@/components/room-section'
import ServiceSection from '@/components/service-section'
import HotelInfo from '@/components/hotel-info';
import Restaurant from '@/components/restaurant-section';
import HotelFacilities from '@/components/facilities';
import MapSection from '@/components/map-section';
import ShortStayPromo from '@/components/short-stay';

interface AboutData {
  title: string;
  description: string;
  image: string;
}

interface CarrouselImage {
  id: number;
  src: string;
  alt: string;
}

const renderDescription = (description: any) => {
  if (typeof description === 'string') {
    return description; // If it's a string, return it directly
  }

  if (description && Array.isArray(description.children)) {
    return description.children.map((child: any, index: number) => (
      <span key={index}>{child.text}</span> // Render each child text
    ));
  }

  return null; // Fallback if the structure is unexpected
};

export default function Home() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [carrouselImages, setCarrouselImages] = useState<CarrouselImage[]>([]);
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '' });

  useEffect(() => {
    const fetchAboutData = async () => {
      let aboutData: AboutData = {
        title: "About Us",
        description: "FMMM-1 HOTEL, Your top choice for a memorable stay.",
        image: "/facilities/bar.jpg", // Provide a placeholder image
      };
  
      try {
        const data = await apiHandler.fetchData("about?populate=*");
        aboutData = {
          title: data.data.title || "Default Title",
          description: data.data.blocks[2].body || "Default description.",
          image: data.data.blocks[3].url || "/default-image.jpg",
        };
      } catch (error) {
        setError((error as Error).message);
      }
  
      setAboutData(aboutData);
    };

    const fetchCarrouselImages = async () => {
      try {
        const data = await apiHandler.fetchData('carrousel?populate=*'); // Fetching from the correct endpoint
        const bannerSlider = data.data.BannerSlider; // Accessing the BannerSlider array
        console.log('BannerSlider data:', bannerSlider); // Log the bannerSlider data
        const formattedImages = bannerSlider.map((item: any) => {
          return {
            src: item.url, // Use the correct URL from the BannerSlider
            alt: `Gallery image ${item.id}` // Use extracted alt text or default
          };
        });
        console.log('Formatted images data:', formattedImages); // Log the formatted images data
        setCarrouselImages(formattedImages);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    const fetchRoomsData = async () => {
      try {
        const data = await apiHandler.fetchData('rooms?populate[amenities][populate]=*&populate[bed][populate]=*'); // Fetching from the correct endpoint
        const formattedRooms = data.data.map((room: any) => ({
          id: room.id,
          documentId: room.documentId,
          title: room.title,
          imgUrl: room.imgUrl,
          description: renderDescription(room.description), // Use renderDescription to format the description
          price: room.price,
          amenities: room.amenities.map((amenity: any) => ({
            id: amenity.id,
            name: amenity.name,
            icon: amenity.icon ? amenity.icon.url : '', // Get the icon URL from the amenity data
          })) || [], // Default to an empty array if no amenities
          bed: room.bed ? `${room.bed.type} (Size: ${room.bed.size} cm)` : 'No bed information', // Extract bed information
        }));
        setRoomsData(formattedRooms); // Update state with formatted room data
        console.log('Formatted rooms data:', formattedRooms); // Log the formatted rooms data
      } catch (error) {
        setError((error as Error).message);
      }
    };

    const fetchServices = async () => {
      try {
        const data = await apiHandler.fetchData('service?populate=*');
        const serviceInfo = data.data.serviceInfo;

        const formattedServices = [];
        
        // Loop through the serviceInfo array
        for (let i = 0; i < serviceInfo.length && formattedServices.length < 6; i++) { // Limit to first 4 services
          const service = serviceInfo[i];

          // Check if the current block is a rich-text block
          if (service.__component === "shared.rich-text" && service.body) {
            const [titleLine, descriptionLine] = service.body.split('\n\n').length > 1 
                ? service.body.split('\n\n') 
                : service.body.split('\n'); // Handle single newline case
            const title = titleLine.split(': ')[1].trim();
            console.log('Service Title:', title); // Log the extracted title
            const description = descriptionLine.split(': ')[1].trim();
            console.log('Service Description:', description); // Log the extracted description

            // The next block should be a media block containing the URL
            const nextService = serviceInfo[i + 1];
            const iconUrl = nextService && nextService.__component === "shared.media" ? nextService.url : '';

            formattedServices.push({
              id: formattedServices.length + 1, // Assigning a unique ID
              icon: iconUrl, // Use the URL from the next block as the icon
              title,
              description
            });
          }
        }

        setServices(formattedServices);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    // Check if data is already set before fetching
    if (!aboutData) {
      fetchAboutData();
    }
    if (carrouselImages.length === 0) {
      fetchCarrouselImages();
    }
    if (roomsData.length === 0) {
      fetchRoomsData();
    } 
    if (services.length === 0) {
      fetchServices();
    }
  }, [apiHandler, aboutData, carrouselImages, roomsData, services]);

  return (
    <>
      {/* Banner Section with Carousel
      and only display the booking form 
      when roomsData is available */}
       {error && <p className="error-message">Error: Could Not Get Data, Please try again</p>}
      
      <section className="banner_main">
  <BannerCarousel images={carrouselImages} />  
  <div className="container">
    {roomsData.length > 0 && <BookingForm />}
  </div>      
</section>

      <section className="content_main">
          {/* About Section */}
      <AboutSection aboutData={aboutData} />
      {/* Room Section */}
      <RoomSection rooms={roomsData} />

      {/* Hotel information section */}
      <HotelInfo />

      {/* Restaurant Section */}
      <Restaurant />
      
      {/* Gallery Section */}
      {/* <Gallery images={galleryImages} /> */}

        {/* facilities section */}
        <HotelFacilities /> 
      {/* Blog Section */}
      {/* <BlogSection posts={[]} /> */}

      {/* Service Section */}
      <ServiceSection services={services} />

      {/* Short Stay Section */}
      <ShortStayPromo />

      {/*  Map view section  */}
      <MapSection />

      {/* Contact Section */}
      {/* <ContactForm /> */}
      </section>

    
    </>
  );
}
 