"use client"
import { useEffect, useState } from 'react';
import ApiHandler from '@/utils/apiHandler';
import BannerCarousel from '@/components/Banner/Carousel'
import BookingForm from '@/components/booking-form'
import AboutSection from '@/components/about-section'
import RoomSection from '@/components/room-section'
import BlogSection from '@/components/blog-section'
import ContactForm from '@/components/contact-form'

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
  
  const apiHandler = ApiHandler({ baseUrl: process.env.NEXT_PUBLIC_API_URL || '' });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await apiHandler.fetchData('about?populate=*');
        setAboutData({
          title: data.data.title,
          description: data.data.blocks[1].body,
          image: data.data.blocks[0].url
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
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
        console.error('Error fetching gallery images:', error);
      }
    };

    const fetchRoomsData = async () => {
      try {
        const data = await apiHandler.fetchData('rooms?populate=*'); // Fetching from the correct endpoint
        const formattedRooms = data.data.map((room: any) => ({
          id: room.id,
          title: room.title,
          imgUrl: room.imgUrl,
          description: renderDescription(room.description), // Use renderDescription to format the description
          price: room.price,
          amenities: room.amenities.map((amenity: any) => ({
            id: amenity.id,
            name: amenity.name,
            icon: amenity.icon ? amenity.icon.formats.thumbnail.url : '', // Get the icon URL from the amenity data
          })) || [], // Default to an empty array if no amenities
        }));
        setRoomsData(formattedRooms); // Update state with formatted room data
        console.log('Formatted rooms data:', formattedRooms); // Log the formatted rooms data
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchAboutData();
    fetchCarrouselImages();
    fetchRoomsData();
  }, [apiHandler]);

  return (
    <>
      {/* Banner Section with Carousel */}
      <section className="banner_main">
        <BannerCarousel images={carrouselImages} />
        <div className="booking_ocline">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {aboutData && typeof aboutData === 'object' && !Array.isArray(aboutData) && <AboutSection title={aboutData.title} description={renderDescription(aboutData.description)} image={aboutData.image} />}

      {/* Room Section */}
      <RoomSection rooms={roomsData} />

      {/* Gallery Section */}
      {/* <Gallery images={galleryImages} /> */}

      {/* Blog Section */}
      <BlogSection posts={[]} />

      {/* Contact Section */}
      <ContactForm />
    </>
  );
}
 