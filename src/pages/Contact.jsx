import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaPinterestP,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* LEFT SIDE */}
        <div>
          {/* Title */}
          <div className="flex items-center gap-2">
            <span className="text-v text-6xl">*</span>
            <h1 className="text-5xl font-extrabold leading-tight">
              connect with <br /> our team
            </h1>
          </div>

          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
            luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>

          {/* Contact Details */}
          <div className="mt-8 grid grid-cols-2 gap-6">

            {/* Phone */}
            <div>
              <p className="flex items-center gap-2 text-lg font-bold">
                <FaPhone className="text-v" /> Phone Number
              </p>
              <p className="text-v font-semibold mt-1">
                +91 98765 43210
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="flex items-center gap-2 text-lg font-bold">
                <FaMapMarkerAlt className="text-v" /> Address
              </p>
              <p className="text-v font-semibold mt-1">
                1-289, Pathaveerapuram (V), Yerpedu (M), Tirupati (D), Andhra Pradesh, 517619.
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-lg font-bold">
              <FaEnvelope className="text-v" /> Email
            </p>
            <p className="text-v font-semibold mt-1">
              info@nueloot.com
            </p>
          </div>
       
          {/* WhatsApp */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-lg font-bold">
              <FaWhatsapp className="text-green-600" /> WhatsApp
            </p>
            <p className="text-v font-semibold mt-1">
              +91-9100015419
            </p>
          </div>

          {/* Social Icons */}
          <div className="mt-10 flex gap-4">
            {[
              {
                icon: <FaInstagram className="text-white" />,
                link: "https://instagram.com",
              },

              {
                icon: <FaFacebookF className="text-white" />,
                link: "https://www.facebook.com/share/1MuwbgQbEn/",
              },
              {
                icon: <FaYoutube className="text-white" />,
                link: "https://youtube.com/@nueloot_official?si=YX71-yedaiPTOv1X",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-v flex items-center justify-center hover:bg-v transition"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <form className="bg-gray-50 p-8 rounded-3xl shadow-md">

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-gray-800 font-semibold">First Name</label>
              <input
                type="text"
                placeholder="Enter First Name"
                className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-800 font-semibold">Last Name</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your official email address"
              className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold">Message</label>
            <textarea
              placeholder="Share why you are contacting"
              rows="5"
              className="w-full mt-2 p-4 rounded-3xl bg-gray-200 outline-none"
            />
          </div>

          {/* Button */}
          <button className="w-full bg-v text-white py-4 rounded-full text-lg font-semibold hover:bg-v transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
