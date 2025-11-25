import { useEffect, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import SpinLoader from "../../components/SpinLoader";
import { AdminAPI } from "../../services/api";
import { showError } from "../../components/AppToast";

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Load customer data by ID
  // ---------------------------
  useEffect(() => {
    const loadCustomer = async () => {
      setLoading(true);
      try {
        const res = await AdminAPI.getUserById(id); // Call API with id
        setCustomer(res.data); // Set user data in state
      } catch (err) {
        console.error(err);
        showError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadCustomer();
  }, [id]);

  if (loading) return <SpinLoader />;

  if (!customer) return <div className="p-6 text-center">No customer found.</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-4 text-gray-800">{customer.name}</h2>

      {/* Personal Details */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="mb-4 md:mb-0">
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
          <span>Registered On: {new Date(customer.registeredAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Address Book */}
      {customer.addresses && customer.addresses.length > 0 && (
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
      )}
    </div>
  );
}
