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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const [address, setAddress] = useState({
    doorNo: "",
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
            doorNo: addr.doorNo || addr.house || "",
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
      "doorNo",
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
  const total = subtotal + shipping ;

  if (!user) return null;

return (
  <div className="container mx-auto px-4 py-16 relative">

    <h2 className="text-4xl font-bold mb-12 text-center">Checkout</h2>

    <div className="grid md:grid-cols-2 gap-10">

      {/* ORDER SUMMARY */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit">
        <h3 className="font-semibold text-2xl mb-4 text-gray-900">
          Order Summary
        </h3>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.thumbnail || JSON.parse(item.images)[0]}
                className="w-20 h-20 rounded-xl object-cover border"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                <p className="font-bold text-v">
                  {formatCurrencyINR(item.price * item.qty)}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>{formatCurrencyINR(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>{formatCurrencyINR(shipping)}</span>
          </div>

          {/* <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>{formatCurrencyINR(tax)}</span>
          </div> */}

          <div className="flex justify-between font-bold text-2xl pt-4 border-t">
            <span>Total</span>
            <span className="text-v">{formatCurrencyINR(total)}</span>
          </div>
        </div>
      </div>

      {/* ADDRESS CARD */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6"
      >
        <h3 className="text-2xl font-semibold text-gray-900">
          Shipping Address
        </h3>

        {/* VIEW MODE */}
        {!editAddress ? (
          <div className="bg-gray-50 p-5 rounded-xl border space-y-1">
            <p className="font-semibold text-lg">{user.first_name}</p>
            <p>{address.doorNo}</p>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state}
            </p>
            <p>{address.zipcode}</p>
            <p>{address.country}</p>
            <p>📞 {address.phone}</p>

            <button
              type="button"
              className="text-v text-sm font-semibold mt-3"
              onClick={() => setEditAddress(true)}
            >
              Edit Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* INPUT FIELDS */}
            {["doorNo", "street", "city", "state", "zipcode", "country", "phone"].map(
              (field) => (
                <input
                  key={field}
                  className="w-full border rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-v outline-none text-sm"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={address[field]}
                  onChange={(e) => handleAddressChange(field, e.target.value)}
                />
              )
            )}

            <button
              type="button"
              className="text-v font-semibold text-sm"
              onClick={() => setEditAddress(false)}
            >
              Save Address
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-v text-white py-3 w-full rounded-xl font-semibold text-lg shadow hover:bg-v/90 transition"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  </div>
);

}
