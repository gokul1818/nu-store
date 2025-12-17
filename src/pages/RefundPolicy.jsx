export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-16">

      {/* PAGE TITLE */}
      <div className="border-l-4 border-orange pl-4 mb-10">
        <h1 className="text-4xl font-bold text-black">
          <span className="text-orange-500 text-6xl">*</span>
          Refund & Cancellation Policy</h1>
      </div>

      {/* INTRO */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
        <p className="text-gray-700 leading-relaxed">
          At <strong>Nueloot</strong>, your satisfaction is our priority. If something is not right,
          we’re here to help. Please read the policy carefully before initiating a return or exchange.
        </p>
      </div>

      {/* SECTION WRAPPER */}
      <div className="space-y-10 text-gray-700">

        {/* Return Window */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-2">🍀 Return Window</h3>
          <p>You have <strong>3 days</strong> from the date of delivery to request a return or exchange.</p>
        </section>

        {/* Eligibility */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">✅ Return Eligibility</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>The product must be unused, unworn, unwashed, and in original packaging.</li>
            <li>All tags and labels must be intact.</li>
            <li>
              A <strong>mandatory unboxing video</strong> is required (from opening the parcel to
              showing the product fully).
            </li>
          </ul>
        </section>

        {/* Non-Returnable */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🚫 Non-Returnable Items</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Customized products.</li>
            <li>Sale items.</li>
            <li>Gift cards.</li>
          </ul>
        </section>

        {/* Exchange */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🔁 Exchanges</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You received a wrong or damaged product.</li>
            <li>The unboxing video clearly shows the issue.</li>
            <li>The request is made within the 3-day window.</li>
          </ul>
        </section>

        {/* Shipping Cost */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">💸 Return Shipping Cost</h3>
          <p>
            For all eligible returns/exchanges, the customer must pay a flat{" "}
            <strong>₹100 return shipping fee</strong>.
          </p>
        </section>

        {/* Order Cancellation */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">❌ Order Cancellations</h3>
          <p>
            Orders can be cancelled <strong>before they are shipped</strong>. To cancel, contact us via
            email or WhatsApp (details below).
          </p>
        </section>

        {/* How to Request */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">📩 How to Request a Return or Exchange</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email us at <strong>Info@nueloot.com</strong> or WhatsApp <strong>+91-9100015419</strong>.</li>
            <li>Send your order number, reason, and unboxing video.</li>
            <li>Once approved, we’ll guide you through the return process.</li>
          </ul>
        </section>

        {/* Refund */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">💰 Refunds</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Refunds are processed within <strong>3–5 working days</strong> after we receive the returned product.
            </li>
            <li>Prepaid orders: refunded to the original payment method.</li>
            <li>
              COD orders: refunded to your bank account (we’ll collect details during the process).
            </li>
          </ul>
        </section>

        {/* Disputes */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">📍 Dispute Resolution</h3>
          <p>
            In case of dispute, the jurisdiction will be{" "}
            <strong>
              1-289, Pathaveerapuram (V), Yerpedu (M), Tirupati (D), Andhra Pradesh, 517619
            </strong>.
          </p>
        </section>

        {/* Contact */}
        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-2xl font-semibold text-black mb-3">☎️ Contact Us</h3>

          <p className="leading-relaxed">
            Available every day from <strong>10 AM – 8 PM (IST)</strong>
            <br />
            Email:{" "}
            <a href="mailto:Info@nueloot.com" className="text-orange underline">
              Info@nueloot.com
            </a>
            <br />
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a
              href="https://wa.me/919100015419"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange underline"
            >
              +91-9100015419
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
