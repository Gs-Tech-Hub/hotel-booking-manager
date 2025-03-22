"use client";
import ApiHandler from "@/utils/apiHandler";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MediaBlock {
   __component: "shared.media";
   id: number;
   url: string;
}

interface RichTextBlock {
   __component: "shared.rich-text";
   id: number;
   body: string;
}

interface AboutData {
   title: string;
   blocks: (MediaBlock | RichTextBlock)[];
}

export default function AboutPage() {
   const [aboutData, setAboutData] = useState<AboutData | null>(null);

   const apiHandler = ApiHandler({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });

   useEffect(() => {
      const fetchAboutData = async () => {
         try {
            const data = await apiHandler.fetchData("about?populate=*");
            setAboutData(data.data);
         } catch (error) {
            console.error("Error fetching about data:", error);
         }
      };
      fetchAboutData();
   }, [apiHandler, ]);

   return (
      <div className="about titlepage text-center container-fluid">
         {aboutData && (
            <>
               <div className="">
                  <h2>{aboutData.title}</h2> 
               </div>

               {aboutData.blocks.map((block, index) => (
                  <div key={index} className={`row align-items-center m-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                     {block.__component === "shared.media" ? (
                        <div className="col-md-6 about-img">
                           <Image src={(block as MediaBlock).url} alt="About Us" layout="responsive" width={500} height={300} />
                        </div>
                     ) : block.__component === "shared.rich-text" ? (
                        <div className="col-md-4 about-text">
                           {(() => {
                              const lines = (block as RichTextBlock).body.split("\n");
                              return (
                                 <>
                                    <h3>{lines[0]}</h3>
                                    <p>{lines.slice(1).join(" ")}</p>
                                 </>
                              );
                           })()}
                        </div>
                     ) : null}
                  </div>
               ))}
            </>
         )}
         
      </div>
   );
}
