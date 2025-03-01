// import Image from 'next/image' // Removed unused import
import BannerCarousel from '@/components/Banner/Carousel'
import BookingForm from '@/components/booking-form'
import AboutSection from '@/components/about-section'
import RoomSection from '@/components/room-section'
import Gallery from '@/components/Gallery'
import BlogSection from '@/components/blog-section'
import ContactForm from '@/components/contact-form'

export default function Home() {
  const aboutData = {
    title: "About Us",
    description: "The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software.",
    image: "/images/about.png"
  };

  const galleryImages = [
    { id: 1, image: 'gallery1.jpg', alt: 'Gallery image 1' },
    { id: 2, image: 'gallery2.jpg', alt: 'Gallery image 2' },
    { id: 3, image: 'gallery3.jpg', alt: 'Gallery image 3' },
    { id: 4, image: 'gallery4.jpg', alt: 'Gallery image 4' },
    // Add more images as needed
  ];

  return (
    <>
      {/* Banner Section with Carousel */}
      <section className="banner_main">
        <BannerCarousel />
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
      <AboutSection {...aboutData} />

      {/* Room Section */}
      <RoomSection rooms={[]} />

      {/* Gallery Section */}
      <Gallery images={galleryImages} />

      {/* Blog Section */}
      <BlogSection posts={[]} />

      {/* Contact Section */}
      <ContactForm />
    </>
  );
}
 