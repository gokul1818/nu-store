import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppInput from "../components/AppInput";
import { showError, showSuccess } from "../components/AppToast";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";
import { formatCurrencyINR } from "../utils/helpers";

export default function Checkout() {
  const { state } = useLocation();
  const buyNowItem = state?.buyNowItem || null;
  const cartItems = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);

  const { user, getProfile, updateProfile } = useAuthStore();
  const createOrder = useOrderStore((s) => s.createOrder);

  const items = buyNowItem ? [buyNowItem] : cartItems;
  console.log('items: ', items);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const [address, setAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Load profile address
  useEffect(() => {
    if (!user) return;

    async function loadUserProfile() {
      try {
        const profile = await getProfile();
        const addr = profile?.addresses?.[0];

        if (addr) {
          setAddress({
            label: addr.label || addr.house || "",
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            zipcode: addr.zipcode || addr.pincode || "",
            country: addr.country || "",
            phone: addr.phone || "",
          });
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadUserProfile();
  }, []);

  // If not logged in → redirect
  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = [
      "label",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];

    for (let f of required) {
      if (!address[f]?.trim()) {
        showError(`Please fill ${f}`);
        return false;
      }
    }

    if (!/^[0-9]{5,6}$/.test(address.zipcode.trim())) {
      showError("Invalid zipcode");
      return false;
    }

    if (!/^[0-9]{10}$/.test(address.phone.trim())) {
      showError("Invalid phone number");
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    if (!items.length) {
      showError("Cart is empty!");
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        addresses: [{ ...address }],
      });

      const orderPayload = {
        shipping_address: address,
        payment_method: "Online",
        items,
      };

      await createOrder(orderPayload);

      showSuccess("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      showError("Order failed");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* RIGHT — Order Summary */}
        <div className="bg-white p-5 rounded-lg shadow-lg h-fit">
          <h3 className="font-semibold text-xl">Order Summary</h3>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b pb-3"
              >
                <img
                  src={item.thumbnail || item.images?.[0]}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  <p className="font-semibold">
                    {formatCurrencyINR(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrencyINR(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrencyINR(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrencyINR(tax)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrencyINR(total)}</span>
            </div>
          </div>
        </div>
        {/* LEFT — Address Card */}
        <form
          onSubmit={submit}
          className="bg-white p-5 rounded-lg shadow-md space-y-4"
        >
          <h3 className="text-xl font-semibold">Shipping Address</h3>

          {!editAddress ? (
            <div className="bg-gray-100 p-4 rounded-lg space-y-1">
              <div className="font-medium">{user.first_name}</div>
              <div>{address.label}</div>
              <div>{address.street}</div>
              <div>
                {address.city}, {address.state}
              </div>
              <div>{address.zipcode}</div>
              <div>{address.country}</div>
              <div>📞 {address.phone}</div>

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
                placeholder="Label (Home/Work)"
                value={address.label}
                onChange={(e) => handleAddressChange("label", e.target.value)}
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
                placeholder="Zipcode"
                value={address.zipcode}
                onChange={(e) => handleAddressChange("zipcode", e.target.value)}
              />

              <AppInput
                placeholder="Country"
                value={address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
              />

              <AppInput
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
              />

              <button
                type="button"
                className="text-primary text-sm"
                onClick={() => setEditAddress(false)}
              >
                Save Address
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-2 px-4 rounded shadow-md hover:bg-orange-600 w-full"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>


      </div>
    </div>
  );
}
