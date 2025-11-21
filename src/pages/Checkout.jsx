import { useState, useEffect } from "react";
import useCartStore from "../stores/useCartStore";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../components/AppToast";
import AppInput from "../components/AppInput";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const createOrder = useCartStore((s) => s.createOrder);
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [address, setAddress] = useState({
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load initial address from store
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setAddress({
        ...user.addresses[0],
        pincode: user.addresses[0].pincode || "",
      });
    }
  }, [user]);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const requiredFields = ["house", "street", "city", "state", "pincode"];
    for (let field of requiredFields) {
      if (!address[field]?.trim()) {
        showError(`Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const order = {
        items,
        shippingAddress: address,
        userId: user._id,
        paymentMethod: "online",
      };

      await createOrder(order);
      showSuccess("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      showError("Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Redirect to login if user is not logged in
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <form onSubmit={submit} className="bg-white p-4 rounded space-y-4">
        <div className="mb-3">
          <label className="block font-medium">Address</label>

          {!editAddress ? (
            <div className="bg-gray-100 p-5 mt-3 rounded-lg space-y-1">
              <div>Name: {user?.firstName || user?.name}</div>
              <div>House/Flat: {address.house}</div>
              <div>Street: {address.street}</div>
              <div>City: {address.city}</div>
              <div>State: {address.state}</div>
              <div>Pincode: {address.pincode}</div>
              <button
                type="button"
                className="text-primary text-sm mt-2"
                onClick={() => setEditAddress(true)}
              >
                Edit Address
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <AppInput
                placeholder="House/Flat No"
                value={address.house}
                onChange={(e) => handleAddressChange("house", e.target.value)}
              />
              <AppInput
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
              />
              <AppInput
                placeholder="City"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
              />
              <AppInput
                placeholder="State"
                value={address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
              />
              <AppInput
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) =>
                  handleAddressChange("pincode", e.target.value)
                }
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="text-secondary text-sm"
                  onClick={() => setEditAddress(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-primary text-sm"
                  onClick={() => setEditAddress(false)}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Placing..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
