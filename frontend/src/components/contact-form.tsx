export default function ContactForm() {
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
  <h3 className="text-xl font-semibold text-gray-800">Driving Directions</h3>
  <div className="flex items-center space-x-2">
    <span className="text-lg text-gray-600">⏱️</span>
    <span className="text-md text-gray-600">Estimated Travel Time: <strong>5 mins</strong></span>
  </div>
  <div className="mt-4">
    <p><strong>📍 Address:</strong> FMMM1 CLOSE, Off Board Road, Alihame, Agbor, Delta State.</p>
    <p className="mt-2"><strong>🛣️ Directions:</strong></p>
    <ol className="list-none pl-6 space-y-2 text-gray-700">
      <li>🚦 From UniDEL gate, head straight towards Board Road.</li>
      <li>➡️ Turn <strong>right</strong> onto Board Road.</li>
      <li>⬅️ Turn <strong>left</strong> into the Faculty of Science compound.</li>
      <li>🚗 Drive to the end of the road to find <strong>F-MMM1 Hotel & Suite</strong>.</li>
    </ol>
  </div>
</div>

              </div>
          </div>
          <div className="col-md-6">
            <div className="map_main">
              <div className="map-responsive">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.11705294998!2d6.173744073724462!3d6.248302993740096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10414f15320a2e67%3A0xc6a7c33445c3c728!2sF-MMM1%20HOTEL%20%26%20SUITES!5e0!3m2!1sen!2sng!4v1742076724421!5m2!1sen!2sng" width="800" height="600" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
