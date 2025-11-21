import { useState, useEffect } from "react";
import useCartStore from "../stores/useCartStore";
import useAuthStore from "../stores/useAuthStore";
import { useOrderStore } from "../stores/useOrderStore";  // ⬅️ Correct import
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../components/AppToast";
import AppInput from "../components/AppInput";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const createOrder = useOrderStore((s) => s.createOrder); // ⬅️ Correct
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

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setAddress({ ...user.addresses[0] });
    }
  }, [user]);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const fields = ["house", "street", "city", "state", "pincode"];
    for (let f of fields) {
      if (!address[f]?.trim()) {
        showError(`Please fill ${f}`);
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
      await updateProfile({ ...user, addresses: [address] });

      await createOrder({
        items,
        shippingAddress: address,
        userId: user._id,
        paymentMethod: "online",
      });

      clearCart();
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
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <form onSubmit={submit} className="bg-white p-4 rounded space-y-4">
        <label className="block font-medium">Address</label>

        {!editAddress ? (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <div>House: {address.house}</div>
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
            <AppInput value={address.house} placeholder="House" onChange={(e) => handleAddressChange("house", e.target.value)} />
            <AppInput value={address.street} placeholder="Street" onChange={(e) => handleAddressChange("street", e.target.value)} />
            <AppInput value={address.city} placeholder="City" onChange={(e) => handleAddressChange("city", e.target.value)} />
            <AppInput value={address.state} placeholder="State" onChange={(e) => handleAddressChange("state", e.target.value)} />
            <AppInput value={address.pincode} placeholder="Pincode" onChange={(e) => handleAddressChange("pincode", e.target.value)} />

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
                onClick={async () => {
                  try {
                    await updateProfile({ ...user, addresses: [address] });
                    showSuccess("Address updated");
                  } catch (err) {
                    showError("Failed to update address");
                  }
                  setEditAddress(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
