import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    wishlist: ["Red T-Shirt", "Blue Jeans"],
    cart: ["Black Shoes"],
    addresses: [
      {
        label: "Home",
        address: "123 Main Street, City, Country",
      },
      {
        label: "Work",
        address: "456 Office Road, City, Country",
      },
    ],
    orders: [
      { id: "O1001", date: "2025-11-01", total: 2500, status: "Delivered" },
      { id: "O1005", date: "2025-11-15", total: 1500, status: "Pending" },
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

  if (!customer) return <p className="p-6">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Customer Profile: {customer.name}</h2>

      {/* Personal Details */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Status:</strong> {customer.status}</p>
        <p><strong>Registered On:</strong> {customer.registered}</p>
      </div>

      {/* Order History */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Order History</h3>
        {customer.orders.map((o) => (
          <div key={o.id} className="flex justify-between border-b py-2">
            <span>{o.id}</span>
            <span>{o.date}</span>
            <span>{o.total}</span>
            <span>{o.status}</span>
          </div>
        ))}
      </div>

      {/* Wishlist */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
        <ul className="list-disc pl-5">
          {customer.wishlist.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Cart */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
        <ul className="list-disc pl-5">
          {customer.cart.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Address Book */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Address Book</h3>
        {customer.addresses.map((a, idx) => (
          <p key={idx}><strong>{a.label}:</strong> {a.address}</p>
        ))}
      </div>

      {/* Communication Preferences */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Communication Preferences</h3>
        <p>Email: {customer.communication.email ? "Enabled" : "Disabled"}</p>
        <p>SMS: {customer.communication.sms ? "Enabled" : "Disabled"}</p>
        <p>Marketing: {customer.communication.marketing ? "Enabled" : "Disabled"}</p>
      </div>
    </div>
  );
}
