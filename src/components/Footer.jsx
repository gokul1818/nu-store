import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import nueloot from "../assets/nueLoot.png";

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 relative">


      {/* Content */}
      <div className="container relative mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* LOGO + TEXT */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={Logo} className="h-12 w-auto" />
            <img src={nueloot} className="h-12 w-auto" />
          </div>

          <p className="text-gray-600 leading-relaxed max-w-xs">
            Designed for those who value timeless style,
            comfort and confidence.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-4">Quick link</h3>

          <ul className="space-y-3 text-gray-700 font-medium">
            <li><Link to="/about" className="hover:text-orange transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-orange transition">Contact Us</Link></li>
            <li><Link to="/products?gender=gender_men" className="hover:text-orange transition">Men Loot</Link></li>
            <li><Link to="/products?gender=gender_women" className="hover:text-orange transition">Women Loot</Link></li>
            <li><Link to="/products?gender=gender_kids" className="hover:text-orange transition">Kids Loot</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-4">Customer Services</h3>

          <ul className="space-y-3 text-gray-700 font-medium">
            <li><Link to="/refund-policy" className="hover:text-orange transition">Refund Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-orange transition">Shipping Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-orange transition">Privacy Policy</Link></li>
            <li><Link to="/terms-condition" className="hover:text-orange transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-4">Social media</h3>

          <ul className="space-y-4 text-gray-700 text-sm font-medium">
            <li className="flex items-center gap-3">
              <FaPhone className="text-orange" /> (+91) 9573312206
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-orange" /> info@nueloot.com
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-orange" />
              1-289, Pathaveerapuram (V), Yerpedu (M), Tirupati (D), Andhra Pradesh, 517619

            </li>
          </ul>
          {/* Icons */}
          <div className="flex gap-4 mt-5">
            {[
              { icon: <FaFacebookF className="text-white" />, link: "https://www.facebook.com/share/1MuwbgQbEn/" },
              { icon: <FaInstagram className="text-white" />, link: "https://www.instagram.com/nueloot_official" },
              { icon: <FaYoutube className="text-white" />, link: "https://youtube.com/@nueloot_official" }
            ].map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-v hover:bg-v/90 transition"
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="bg-v text-white text-center text-sm py-4 mt-12">
        <p>© {new Date().getFullYear()} NueLoot. All Rights Reserved</p>

      </div>
    </footer>
  );
}
