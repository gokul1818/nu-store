import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
          <p className="text-gray-700 mb-4">We're here to help. Reach us anytime!</p>

          <p className="flex items-center gap-3 mb-3">
            <FaPhone /> +91 98765 43210
          </p>
          <p className="flex items-center gap-3 mb-3">
            <FaEnvelope /> support@nustore.com
          </p>
          <p className="flex items-center gap-3">
            <FaMapMarkerAlt /> Chennai, Tamil Nadu
          </p>
        </div>

        <form className="bg-white shadow p-6 rounded-lg">
          <input type="text" placeholder="Your Name" className="w-full border p-2 rounded mb-3" />
          <input type="email" placeholder="Your Email" className="w-full border p-2 rounded mb-3" />
          <textarea placeholder="Message" rows="4" className="w-full border p-2 rounded mb-3"></textarea>
          <button className="bg-black text-white px-4 py-2 rounded w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
