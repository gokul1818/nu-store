export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

      <p className="text-gray-700 mb-4">
        At <strong>Nueloot</strong>, your satisfaction is our priority. If
        something is not right, we’re here to help. Please read the policy
        carefully before initiating a return or exchange.
      </p>

      {/* Return Window */}
      <h3 className="font-semibold mt-6 mb-2">🍀 Return Window</h3>
      <p className="text-gray-700 mb-4">
        You have <strong>3 days</strong> from the date of delivery to request a
        return or exchange.
      </p>

      {/* Eligibility */}
      <h3 className="font-semibold mt-6 mb-2">✅ Return Eligibility</h3>
      <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
        <li>
          The product must be unused, unworn, unwashed, and in original
          packaging.
        </li>
        <li>All tags and labels must be intact.</li>
        <li>
          A <strong>mandatory unboxing video</strong> is required (from opening
          the parcel to showing the product fully).
        </li>
      </ul>

      {/* Non-Returnable */}
      <h3 className="font-semibold mt-6 mb-2">🚫 Non-Returnable Items</h3>
      <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
        <li>Customized products.</li>
        <li>Sale items.</li>
        <li>Gift cards.</li>
      </ul>

      {/* Exchange */}
      <h3 className="font-semibold mt-6 mb-2">🔁 Exchanges</h3>
      <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
        <li>You received a wrong or damaged product.</li>
        <li>The unboxing video clearly shows the issue.</li>
        <li>The request is made within the 3-day window.</li>
      </ul>

      {/* Shipping Cost */}
      <h3 className="font-semibold mt-6 mb-2">💸 Return Shipping Cost</h3>
      <p className="text-gray-700 mb-4">
        For all eligible returns/exchanges, the customer must pay a flat{" "}
        <strong>₹100 return shipping fee</strong>.
      </p>

      {/* Order Cancellation */}
      <h3 className="font-semibold mt-6 mb-2">❌ Order Cancellations</h3>
      <p className="text-gray-700 mb-4">
        Orders can be cancelled <strong>before they are shipped</strong>. To
        cancel, contact us via email or WhatsApp (details below).
      </p>

      {/* Request Return / Exchange */}
      <h3 className="font-semibold mt-6 mb-2">
        📩 How to Request a Return or Exchange
      </h3>
      <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
        <li>
          Email us at <strong>Info@nueloot.com</strong> or WhatsApp{" "}
          <strong>+91-9100015419</strong>.
        </li>
        <li>Send your order number, reason, and unboxing video.</li>
        <li>Once approved, we’ll guide you through the return process.</li>
      </ul>

      {/* Refund */}
      <h3 className="font-semibold mt-6 mb-2">💰 Refunds</h3>
      <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
        <li>
          Refunds are processed within <strong>3–5 working days</strong> after
          we receive the returned product.
        </li>
        <li>Prepaid orders: refunded to the original payment method.</li>
        <li>
          COD orders: refunded to your bank account (we’ll collect details
          during the process).
        </li>
      </ul>

      {/* Disputes */}
      <h3 className="font-semibold mt-6 mb-2">📍 Dispute Resolution</h3>
      <p className="text-gray-700 mb-4">
        In case of dispute, the jurisdiction will be{" "}
        <strong>
          #12-15, Sri Sai Upadhyaya Nagar, J K Nagar Extension, Pichatoor road,
          Srikalahasthi- 517644
        </strong>
        .
      </p>

      {/* Contact */}
      <h3 className="font-semibold mt-6 mb-2">☎️ Contact Us</h3>
      <p className="text-gray-700">
        Available every day from <strong>10 AM – 8 PM (IST)</strong>
        <br />
        Email:{" "}
        <a href="mailto:Info@nueloot.com" className="text-blue-600 underline">
          Info@nueloot.com
        </a>
        <br />
        <span className="font-semibold">WhatsApp:</span>{" "}
        <a
          href="https://wa.me/919100015419"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 underline"
        >
          +91-9100015419
        </a>
      </p>
    </div>
  );
}
