import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT SIDE */}
        <div>
          {/* Title */}
          <div className="flex items-start gap-3">
            <span className="text-v text-4xl sm:text-6xl">*</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              connect with <br /> our team
            </h1>
          </div>

          {/* Contact Details */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Phone */}
            <div>
              <p className="flex items-center gap-2 text-base sm:text-lg font-bold">
                <FaPhone className="text-v" /> Phone Number
              </p>
              <p className="text-v font-semibold mt-1 text-sm sm:text-base">
                +91 9573312206
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="flex items-center gap-2 text-base sm:text-lg font-bold">
                <FaMapMarkerAlt className="text-v" /> Address
              </p>
              <p className="text-v font-semibold mt-1 text-sm sm:text-base">
                1-289, Pathaveerapuram (V), Yerpedu (M), Tirupati (D),
                Andhra Pradesh, 517619.
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-base sm:text-lg font-bold">
              <FaEnvelope className="text-v" /> Email
            </p>
            <p className="text-v font-semibold mt-1 text-sm sm:text-base">
              info@nueloot.com
            </p>
          </div>

          {/* WhatsApp */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-base sm:text-lg font-bold">
              <FaWhatsapp className="text-green-600" /> WhatsApp
            </p>
            <p className="text-v font-semibold mt-1 text-sm sm:text-base">
              +91-9100015419
            </p>
          </div>

          {/* Social Icons */}
          <div className="mt-10 flex flex-wrap gap-4">
            {[
              {
                icon: <FaInstagram className="text-white text-lg" />,
                link: "https://instagram.com",
              },
              {
                icon: <FaFacebookF className="text-white text-lg" />,
                link: "https://www.facebook.com/share/1MuwbgQbEn/",
              },
              {
                icon: <FaYoutube className="text-white text-lg" />,
                link: "https://youtube.com/@nueloot_official",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-v flex items-center justify-center hover:scale-110 transition"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <form className="bg-gray-50 p-6 sm:p-8 rounded-3xl shadow-md w-full">

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-gray-800 font-semibold text-sm sm:text-base">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-800 font-semibold text-sm sm:text-base">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold text-sm sm:text-base">
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
            <label className="text-gray-800 font-semibold text-sm sm:text-base">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              className="w-full mt-2 p-4 rounded-full bg-gray-200 outline-none"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="text-gray-800 font-semibold text-sm sm:text-base">
              Message
            </label>
            <textarea
              placeholder="Share why you are contacting"
              rows="5"
              className="w-full mt-2 p-4 rounded-3xl bg-gray-200 outline-none resize-none"
            />
          </div>

          {/* Button */}
          <button className="w-full bg-v text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:opacity-90 transition">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
