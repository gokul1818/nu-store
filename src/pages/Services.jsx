import { FaTruck, FaUndo, FaHeadset, FaShieldAlt } from "react-icons/fa";

export default function Services() {
  const items = [
    {
      icon: <FaTruck size={34} />,
      title: "Fast & Secure Delivery",
      desc: "Orders are shipped with trusted couriers to ensure safe delivery.",
    },
    {
      icon: <FaShieldAlt size={34} />,
      title: "Order Dispatched in 24 Hours",
      desc: "We guarantee dispatch within 24 working hours.",
    },
    {
      icon: <FaUndo size={34} />,
      title: "Easy Returns",
      desc: "Hassle-free return process on all eligible items.",
    },
    {
      icon: <FaHeadset size={34} />,
      title: "24/7 Customer Support",
      desc: "Need help? Our support team is available anytime.",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Our Services</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow-lg p-6 rounded-xl text-center border hover:shadow-2xl transition"
          >
            <div className="flex justify-center mb-4 text-black">{item.icon}</div>
            <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
