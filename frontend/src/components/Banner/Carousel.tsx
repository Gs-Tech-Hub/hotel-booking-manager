"use client";

import Image from "next/image";
import Overlay from "./overlay";

interface BannerCarouselProps {
   images: { src: string; alt: string }[];
}

export default function BannerCarousel({ images }: BannerCarouselProps) {
   return (
      <div
         id="myCarousel"
         className="carousel slide home_banner_area position-relative"
         data-ride="carousel"
      >
         {/* Move Overlay outside container to cover the entire carousel */}
         <Overlay />

         <ol className="carousel-indicators">
            {images.map((_, index) => (
               <li
                  key={index}
                  data-target="#myCarousel"
                  data-slide-to={index}
                  className={index === 0 ? "active" : ""}
               ></li>
            ))}
         </ol>

         <div className="carousel-inner">
            {images.map((image, index) => (
               <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
               >
                  <Image
                     className="w-100"
                     src={image.src}
                     alt={image.alt}
                     layout="responsive"
                     width={400}
                     height={200}
                  />
               </div>
            ))}
         </div>

         <a
            className="carousel-control-prev"
            href="#myCarousel"
            role="button"
            data-slide="prev"
         >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
         </a>

         <a
            className="carousel-control-next"
            href="#myCarousel"
            role="button"
            data-slide="next"
         >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
         </a>
      </div>
   );
}
