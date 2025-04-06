"use client";
import Image from "next/image";
import Link from "next/link";

export default function ShortStayPromo() {
   return (
      <div className="about">
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-5">
                  <div className="titlepage">
                     <h2>Book your short stay today!</h2>
                     <p>
                        Do you only plan to spend a few hours?
                        You can use our special booking offer—book your short rest&nbsp;
                        <Link href="/short-stay-booking" className="mt-4 book-btn premise">
                           Book Here
                        </Link>
                     </p>
                  </div>
               </div>
               <div className="col-md-5">
                  <div className="about_img">
                     <figure>
                        <Image
                           src="/images/short-stay-room.jpg" // Ensure this image exists in your /public folder
                           alt="Short stay booking"
                           layout="responsive"
                           width={200}
                           height={100}
                        />
                     </figure>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
