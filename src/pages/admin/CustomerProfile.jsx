import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { useParams } from "react-router-dom";
import SpinLoader from "../../components/SpinLoader";

export default function CustomerProfile() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  const dummyCustomer = {
    id: "U1001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    status: "Active",
    registered: "2025-01-10",
    addresses: [
      {
        label: "Home",
        address: "123 Main Street, City, Country",
      },
    ],
    communication: {
      email: true,
      sms: false,
      marketing: true,
    },
  };

  useEffect(() => {
    // Simulate API call
    setCustomer(dummyCustomer);
  }, [id]);

  if (!customer) return <SpinLoader />

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Customer Profile
      </h2>

      {/* Personal Details */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {customer.name}
          </h3>
          <p className="text-gray-600 flex items-center gap-2">
            <HiOutlineMail className="text-primary w-5 h-5" /> {customer.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <HiOutlinePhone className="text-primary w-5 h-5" /> {customer.phone}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-gray-600">
          <span className="flex items-center gap-2">
            <HiOutlineCheckCircle
              className={`w-5 h-5 ${
                customer.status === "Active" ? "text-green-500" : "text-red-500"
              }`}
            />
            Status: {customer.status}
          </span>
          <span>Registered On: {customer.registered}</span>
        </div>
      </div>

      {/* Address Book */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Address Book
        </h3>
        <div className="space-y-2">
          {customer.addresses.map((a, idx) => (
            <div
              key={idx}
              className="border-l-4 border-primary pl-3 bg-gray-50 p-2 rounded"
            >
              <p className="font-medium">{a.label}</p>
              <p className="text-gray-600">{a.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Communication Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                customer.communication.email ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            Email
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                customer.communication.sms ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            SMS
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                customer.communication.marketing
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></span>
            Marketing
          </div>
        </div>
      </div>
    </div>
  );
}
