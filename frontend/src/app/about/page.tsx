   'use client'
import Loader from "@/components/loader";
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
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   const apiHandler = ApiHandler({
     baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
   });
 
   useEffect(() => {
     const fetchAboutData = async () => {
       try {
         const data = await apiHandler.fetchData("about?populate=*");
         setAboutData(data.data);
       } catch (error) {
         setError((error as Error).message);
       } finally {
         setLoading(false);
       }
     };
     fetchAboutData();
   }, [apiHandler]);
 
   if (loading) return <Loader />;
   if (error) return <p>Error: Could Not Get About Data</p>;
   if (!aboutData) return null;
 
   const mediaBlocks = aboutData.blocks.filter(b => b.__component === "shared.media") as MediaBlock[];
   const textBlocks = aboutData.blocks.filter(b => b.__component === "shared.rich-text") as RichTextBlock[];
   const coverImage = mediaBlocks[0];
   const sideImage = mediaBlocks[1];
 
   return (
     <div className="about-container">
       {/* Cover Image */}
       {coverImage && (
         <div className="cover-image-wrapper">
           <Image
             src={coverImage.url}
             alt="Cover"
             layout="fill"
             objectFit="cover"
             className="cover-image"
           />
           <div className="cover-overlay">
             <h1 className="cover-title">{aboutData.title}</h1>
           </div>
         </div>
       )}
 
       {/* Side Image + Text Content */}
       <div className="content-section">
         <div className="text-stack">
           {textBlocks.map((block, index) => {
             const lines = block.body.split("\n");
             return (
               <div key={index} className="text-block">
                 <h3>{lines[0]}</h3>
                 <p>{lines.slice(1).join(" ")}</p>
               </div>
             );
           })}
         </div>
         {sideImage && (
           <div className="side-image">
             <Image
               src={sideImage.url}
               alt="Side Visual"
               width={600}
               height={400}
               className="media-image"
             />
           </div>
         )}
       </div>
     </div>
   );
 }
 