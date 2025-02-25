import Image from 'next/image'
import BannerCarousel from '@/components/Banner/Carousel'
import BookingForm from '@/components/booking-form'
import AboutSection from '@/components/about-section'
import RoomSection from '@/components/room-section'
import Gallery from '@/components/Gallery'
import BlogSection from '@/components/blog-section'
import ContactForm from '@/components/contact-form'

export default function Home() {
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
      <AboutSection />

      {/* Room Section */}
      <RoomSection />

      {/* Gallery Section */}
      <Gallery />

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <ContactForm />
    </>
  );
}
 