'use client';

export default function Overlay() {
  return (
     <div className="home_banner_area banner_inner d-flex align-items-center justify-content-center position-absolute w-100 h-100 top-0 start-0 z-1" style={{ transform: 'translateY(-50px)' }}>
     <div className="container text-center z-1">
       <div className="banner_content text-white">
         <p className="top-text">Welcome to</p>
         <h1 className="display-1 font-weight-bold">F-MMM1</h1>
         <p className="text">Enjoy your stay at our luxury hotel</p>
       </div>
     </div>
   </div>
  );
}
