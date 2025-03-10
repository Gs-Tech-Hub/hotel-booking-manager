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
                <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA0s1a7phLN0iaD6-UE7m4qP-z21pH0eSc&q=Eiffel+Tower+Paris+France" width="600" height="400" frameBorder="0" style={{border: 0, width: '100%'}} allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
