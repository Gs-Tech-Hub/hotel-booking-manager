"use client";
import AboutSection from "@/components/about-section";
import BannerCarousel from "@/components/Banner/Carousel";
import BlogSection from "@/components/blog-section";
import BookingForm from "@/components/booking-form";
import ContactForm from "@/components/contact-form";
import HotelInfo from "@/components/hotel-info";
import RoomSection from "@/components/room-section";
import ServiceSection from "@/components/service-section";
import ApiHandler from "@/utils/apiHandler";
import { useEffect, useState } from "react";

export interface AboutData {
   title: string;
   description: string;
   image: string;
}

interface CarrouselImage {
   id: number;
   src: string;
   alt: string;
}

export default function Home() {
   const [carrouselImages, setCarrouselImages] = useState<CarrouselImage[]>([]);
   const [services, setServices] = useState<any[]>([]);

   const apiHandler = ApiHandler({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });

   useEffect(() => {
      const fetchCarrouselImages = async () => {
         try {
            const data = await apiHandler.fetchData("carrousel?populate=*");
            const bannerSlider = data.data.BannerSlider;

            const formattedImages = bannerSlider.map((item: any) => {
               return {
                  src: item.url,
                  alt: `Gallery image ${item.id}`,
               };
            });

            setCarrouselImages(formattedImages);
         } catch (error) {
            console.error("Error fetching gallery images:", error);
         }
      };

      const fetchServices = async () => {
         try {
            const data = await apiHandler.fetchData("service?populate=*");
            const serviceInfo = data.data.serviceInfo;

            const formattedServices = [];

            for (
               let i = 0;
               i < serviceInfo.length && formattedServices.length < 6;
               i++
            ) {
               // Limit to first 4 services
               const service = serviceInfo[i];

               // Check if the current block is a rich-text block
               if (service.__component === "shared.rich-text" && service.body) {
                  const [titleLine, descriptionLine] =
                     service.body.split("\n\n").length > 1
                        ? service.body.split("\n\n")
                        : service.body.split("\n"); // Handle single newline case
                  const title = titleLine.split(": ")[1].trim();
                  console.log("Service Title:", title); // Log the extracted title
                  const description = descriptionLine.split(": ")[1].trim();
                  console.log("Service Description:", description); // Log the extracted description

                  // The next block should be a media block containing the URL
                  const nextService = serviceInfo[i + 1];
                  const iconUrl =
                     nextService && nextService.__component === "shared.media"
                        ? nextService.url
                        : "";

                  formattedServices.push({
                     id: formattedServices.length + 1, // Assigning a unique ID
                     icon: iconUrl, // Use the URL from the next block as the icon
                     title,
                     description,
                  });
               }
            }

            setServices(formattedServices);
         } catch (error) {
            console.error("Error fetching services:", error);
         }
      };
      if (carrouselImages.length === 0) {
         fetchCarrouselImages();
      }
      if (services.length === 0) {
         fetchServices();
      }
   }, [apiHandler, carrouselImages, services]);

   return (
      <>
         <section className="banner_main">
            <BannerCarousel images={carrouselImages} />
            <div className="container">
               <BookingForm />
            </div>
         </section>

         <AboutSection />
         <RoomSection />
         <HotelInfo />
         {/* <Gallery images={galleryImages} /> */}
         <BlogSection posts={[]} />
         <ServiceSection services={services} />
         <ContactForm />
      </>
   );
}
