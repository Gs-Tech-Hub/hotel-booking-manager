// 'use client'
// import { useState } from 'react';
// import { updateMenuItemsToAPI } from '../../utils/menuApiUtils';
// import { div } from 'framer-motion/client';

// export default function UploadMenuPage() {
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<string | null>(null);

//   const handleUpload = async () => {
//     setLoading(true);
//     setStatus(null);

//     try {
//       // Call the upload function without a token
//       await updateMenuItemsToAPI('https://hotel-booking-manager-api.onrender.com/api/food-items');
//       setStatus('Menu items uploaded successfully!');
//     } catch (error) {
//       console.error(error);
//       setStatus('Upload failed. Check console for errors.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//         <div className="our_room">
//             <div className="container py-5 text-center">
//                 <h1 className="mb-4">Upload Menu to API</h1>
//                 <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
//                     {loading ? 'Uploading...' : 'Upload Menu'}
//                 </button>
//                 {status && <p className="mt-3">{status}</p>}
//                 </div>
//         </div>
    
//   );
// }
