'use client'
import { FormEvent, useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <>
      <div className="back_re">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title">
                <h2>Contact Us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <form id="request" className="main_form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <input 
                      className="contactus" 
                      placeholder="Name" 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <input 
                      className="contactus" 
                      placeholder="Email" 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <input 
                      className="contactus" 
                      placeholder="Phone Number" 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <textarea 
                      className="textarea" 
                      placeholder="Message" 
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <button className="send_btn" type="submit">Send</button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <div className="map_main">
                <div className="map-responsive">
                  <iframe 
                    src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Eiffel+Tower+Paris+France" 
                    width="600" 
                    height="400" 
                    style={{ border: 0, width: '100%' }} 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
  