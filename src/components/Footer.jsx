import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../assets/logo1.png";
export default function Footer() {
  return (
    <footer className="bg-black/50 text-gray-300 pt-10 pb-6 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <div>
          <img src={Logo} alt="Logo" className="h-12 w-auto" />
          <p className="text-sm">
            #12-15, Sri Sai Upadhyaya Nagar, J K Nagar Extension, Pichatoor road, Srikalahasthi- 517644
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            {/* <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li> */}
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="https://www.instagram.com/nueloot_official?igsh=bGEyamR0dnc1Z3Ji" className="hover:text-white"><FaInstagram /></a>
            {/* <a href="#" className="hover:text-white"><FaTwitter /></a> */}
            {/* <a href="#" className="hover:text-white"><FaYoutube /></a> */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} NU Store — All Rights Reserved.
      </div>
    </footer>
  );
}
