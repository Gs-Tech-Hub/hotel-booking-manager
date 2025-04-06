'use client'
import React from 'react';
import Image from 'next/image';

export default function Club() {
  return (
    <>
      <div className="back_re">
        <div className="title">
          <h2>F-MM1 NIGHT Club</h2>
        </div>
      </div>

      <div className="my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {/* Relative wrapper for image and overlay */}
              <div className="position-relative bg-white border rounded shadow overflow-hidden" style={{ height: '500px' }}>
                <Image  
                  src="/images/club-bg.jpg" 
                  alt="Club background"
                  fill
                  className="w-150 h-150 object-fit-cover opacity-75"
                />

                {/* Overlay with text */}
                <div className="overlay-container">
                  <div className="overlay-content">
                    <h1 className="mb-3">Coming Soon</h1>
                    <p className=" text">
                      We are working hard to bring you something amazing! Stay tuned for updates about our exclusive club experience.
                    </p>
                  </div>
                </div>                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
