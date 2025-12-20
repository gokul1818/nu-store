import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../components/AppToast";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";
import { formatCurrencyINR, safeParse } from "../utils/helpers";

export default function Checkout() {
  const { state } = useLocation();
  const buyNowItem = state?.buyNowItem || null;

  const cartItems = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);

  const { user, getProfile, updateProfile } = useAuthStore();
  const { createOrder, verifyPayment } = useOrderStore();

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

  // ============================
  // LOAD PROFILE ADDRESS
  // ============================
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const profile = await getProfile();
        const addr = profile?.addresses?.[0];
        if (!addr) return;

        setAddress({
          doorNo: addr.doorNo || "",
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zipcode: addr.zipcode || "",
          country: addr.country || "",
          phone: addr.phone || "",
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

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

    if (!/^[0-9]{5,6}$/.test(address.zipcode)) {
      showError("Invalid zipcode");
      return false;
    }

    if (!/^[0-9]{10}$/.test(address.phone)) {
      showError("Invalid phone number");
      return false;
    }

    return true;
  };

  // ============================
  // PLACE ORDER + PAY
  // ============================
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateAddress()) return;
    if (!items.length) return showError("Cart is empty");

    if (!window.Razorpay) {
      showError("Payment service not loaded. Please refresh.");
      return;
    }

    try {
      setLoading(true);

      // Save address
      await updateProfile({ addresses: [address] });

      // 1️⃣ Create order
      const res = await createOrder({
        shipping_address: address,
        payment_method: "RAZORPAY",
        items,
      });

      // 2️⃣ Razorpay options
      const options = {
        key: res.key,
        amount: res.razorpayOrder.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: res.razorpayOrder.id,

        handler: async (response) => {
          try {
            await verifyPayment({
              ...response,
              orderId: res.orderId,
            });

            showSuccess("Payment successful 🎉");
            clearCart();
            navigate("/orders");
          } catch (e) {
            showError("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => showError("Payment cancelled"),
        },

        prefill: {
          name: user.first_name,
          email: user.email,
          contact: address.phone,
        },

        theme: { color: "#6d28d9" },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      showError("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (!user) return null;

  // ============================
  // UI
  // ============================
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold mb-12 text-center">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>

          {items.map((item) => {
            const imgs =
              typeof item.images === "string"
                ? safeParse(item.images)
                : item.images;

            return (
              <div key={item.id} className="flex gap-4 border-b pb-4 mb-4">
                <img
                  src={item.thumbnail || imgs?.[0]}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm">Qty: {item.qty || 1}</p>
                  <p className="font-bold text-v">
                    {formatCurrencyINR(item.price * (item.qty || 1))}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrencyINR(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrencyINR(shipping)}</span>
          </div>

          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span className="text-v">{formatCurrencyINR(total)}</span>
          </div>
        </div>

        {/* ADDRESS */}
        <form
          onSubmit={submit}
          className="bg-white p-6 rounded-2xl shadow-lg border space-y-6"
        >
          <h3 className="text-2xl font-semibold">Shipping Address</h3>

          {!editAddress ? (
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p>{address.doorNo}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.zipcode}</p>
              <p>{address.country}</p>
              <p>📞 {address.phone}</p>

              <button
                type="button"
                className="text-v font-semibold mt-3"
                onClick={() => setEditAddress(true)}
              >
                Edit Address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(address).map((key) => (
                <input
                  key={key}
                  value={address[key]}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  placeholder={key}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              ))}

              <button
                type="button"
                className="text-v font-semibold"
                onClick={() => setEditAddress(false)}
              >
                Save Address
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-v text-white w-full py-3 rounded-xl font-semibold"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
