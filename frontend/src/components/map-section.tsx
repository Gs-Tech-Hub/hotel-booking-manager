import Image from 'next/image';

export default function MapSection() {
    return (
      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="titlepage">
                <h2>Our Location</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12 p-6 bg-white border rounded-lg shadow-md">
                  <div className="mt-4">
                    <Image  
                      src="/images/whole-view.jpg" 
                      alt="Front Bar"
                      width={600}
                      height={400}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map_main">
                <div className="map-responsive">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.11705294998!2d6.173744073724462!3d6.248302993740096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10414f15320a2e67%3A0xc6a7c33445c3c728!2sF-MMM1%20HOTEL%20%26%20SUITES!5e0!3m2!1sen!2sng!4v1742076724421!5m2!1sen!2sng" 
                    width="600" 
                    height="400" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
