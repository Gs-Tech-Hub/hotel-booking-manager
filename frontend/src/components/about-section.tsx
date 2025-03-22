"use client";
import Image from "next/image";

interface AboutData {
   title: string;
   description: string;
   image: string;
}

interface AboutSectionProps {
   aboutData?: AboutData | null;
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
   if (!aboutData) {
      return <p>Loading...</p>; // Fallback when data is null
   }

   return (
      <div className="about">
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-5">
                  <div className="titlepage">
                     <h2>{aboutData.description.split("\n")[0]}</h2>
                     <p>
                        {aboutData.description.split("\n").slice(1).join("\n")}
                     </p>
                     <a className="read_more" href="/about">
                        EXPLORE MORE
                     </a>
                  </div>
               </div>
               <div className="col-md-7">
                  <div className="about_img">
                     <figure>
                        <Image
                           src={aboutData.image}
                           alt={aboutData.title}
                           layout="responsive"
                           width={500}
                           height={300}
                        />
                     </figure>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
