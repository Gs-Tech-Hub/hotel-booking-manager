'use client'
import { FormEvent, useState } from 'react'
import Image from 'next/image';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert('All fields are required!')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Something went wrong')
      alert('Message sent successfully!')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="back_re">
        <div className="title">
          <h2>Contact Us</h2>
        </div>
      </div>

      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <form id="request" className="main_form" onSubmit={handleSubmit}>
                <div className="row">
                  {['name', 'email', 'phone'].map((field) => (
                    <div key={field} className="col-md-12">
                      <input 
                        className="contactus" 
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} 
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                  <div className="col-md-12">
                    <textarea 
                      className="textarea" 
                      placeholder="Message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <button className="send_btn" type="submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <div className="contact-info-text modern-contact-info">
                <h3>GET IN TOUCH</h3>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <span>FMMM1 CLOSE, off Board Road, 
                    Alihame, Agbor.
                     Delta State. 
                     Nigeria
                  </span>
                </div>
                <div className="info-item">
                  <FaPhoneAlt className="info-icon" />
                  <span>+234 704 523 2697</span>
                </div>
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <span> fmmm1hotel@gmail.com</span>
                </div>
                <p>We are here to answer any questions or help with reservations. Feel free to reach out using the form or the details above!</p>
              </div>
            </div>
          </div>

          <div className="mt-5 row">
            <div className="col-md-6">
              <div className="p-6 bg-white border rounded-lg shadow-md">
                <Image  
                  src="/images/whole-view.jpg" 
                  alt="Front Bar"
                  width={600}
                  height={400}
                  className="w-full rounded-lg shadow-md"
                />
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
    </>
  )
}
