"use client";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AboutData {
   title: string;
   description: string;
   image: string;
}


export default function AboutSection() {
   const [aboutData, setAboutData] = useState<AboutData | null>(null);

   const apiHandler = ApiHandler({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });

   useEffect(() => {
      const fetchAboutData = async () => {
         try {
            const data = await apiHandler.fetchData("about?populate=*");
            setAboutData({
               title: data.data.title,
               description: data.data.blocks[2].body,
               image: data.data.blocks[3].url,
            });
         } catch (error) {
            console.error("Error fetching about data:", error);
         }
      };
      fetchAboutData();
   });

   return (
      <div className="about">
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-5">
                  <div className="titlepage">
                     {/* <h2>{title}</h2> */}
                     <h2>{aboutData?.description.split("\n")[0]}</h2>
                     <p>
                        {aboutData?.description.split("\n").slice(1).join("\n")}
                     </p>
                     <a className="read_more" href="/about">
                        EXPLORE MORE
                     </a>
                  </div>
               </div>
               <div className="col-md-7">
                  <div className="about_img">
                     {aboutData && (
                        <figure>
                           <Image
                              src={aboutData?.image}
                              alt={aboutData?.title}
                              layout="responsive"
                              width={500}
                              height={300}
                           />
                        </figure>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
