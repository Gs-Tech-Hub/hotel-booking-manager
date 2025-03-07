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
                <div className="col-md-12">
                  <h3>Driving Directions</h3>
                  <p><strong>Address:</strong> FMMM1 CLOSE, Off Board Road, Alihame, Agbor, Delta State.</p>
                  <p><strong>Directions:</strong></p>
                  <p>From UniDEL gate, turn right to Board Road, turn left into Faculty of Science compound, drive to the end of the road to FIND F-MMM1 Hotel & Suite.</p>
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
