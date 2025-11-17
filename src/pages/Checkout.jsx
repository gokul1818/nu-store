import { useState, useEffect } from "react";
import useCartStore from "../stores/useCartStore";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../components/AppToast";
import AppInput from "../components/AppInput";
import { AuthAPI } from "../services/api";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const createOrder = useCartStore((s) => s.createOrder);
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [loading, setLoading] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [address, setAddress] = useState({
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const navigate = useNavigate();

  // Load initial address from user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await AuthAPI.getProfile();
        const addressData =
          res.addresses?.length > 0
            ? res.addresses.map((addr) => ({
                house: addr.house || "",
                street: addr.street || "",
                city: addr.city || "",
                state: addr.state || "",
              }))
            : [{ house: "", street: "", city: "", state: "" }];
        console.log("addressData: ", addressData);
        setAddress(addressData);
      } catch (err) {
        showError("Failed to fetch profile");
      }
    }
    fetchProfile();
  }, []);

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

    if (!validateAddress()) return;

    setLoading(true);
    try {
      if (editAddress) {
        await updateProfile({
          ...user,
          addresses: [address],
        });
        showSuccess("Address updated successfully");
      }

      const order = {
        items,
        shippingAddress: address,
        userId: user._id,
        paymentMethod: "online",
      };
      await createOrder(order);
      navigate("/orders");
    } catch (err) {
      console.log(err);
      showError("Order failed");
    } finally {
      setLoading(false);
    }
  };

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
                onChange={(e) => handleAddressChange("pincode", e.target.value)}
              />
              <button
                type="button"
                className="text-secondary text-sm"
                onClick={() => setEditAddress(false)}
              >
                Cancel
              </button>
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
