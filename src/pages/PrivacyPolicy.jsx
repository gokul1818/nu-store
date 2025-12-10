export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16">

      {/* PAGE TITLE */}
      <div className="border-l-4 border-orange pl-4 mb-10">
        <h1 className="text-4xl font-bold text-black">
          <span className="text-orange-500 text-6xl">*</span>
          Privacy Policy
        </h1>
      </div>

      {/* INTRO */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
        <p className="text-gray-700 leading-relaxed">
          At <strong>Nueloot</strong>, we are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your data when you use our website or services.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-10 text-gray-700">

        {/* Information We Collect */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">📌 1. Information We Collect</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Details:</strong> Name, email address, phone number, delivery address.</li>
            <li><strong>Payment Details:</strong> Processed securely by Razorpay (we do not store card details).</li>
            <li><strong>Order Information:</strong> Product preferences, order history, support messages.</li>
            <li><strong>Technical Data:</strong> Device info, IP address, browser type, cookies.</li>
          </ul>
        </section>

        {/* How We Use the Information */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">📍 2. How We Use Your Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and deliver your orders.</li>
            <li>To provide customer support.</li>
            <li>To improve website experience and product offerings.</li>
            <li>To send updates, promotions, or order-related notifications.</li>
            <li>To detect and prevent fraudulent or illegal activities.</li>
          </ul>
        </section>

        {/* Sharing of Information */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🤝 3. Sharing Your Information</h3>
          <p className="leading-relaxed mb-3">
            We do <strong>not</strong> sell or rent your personal data. We may share information only with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Trusted partners (delivery, payment gateways, customer support tools).</li>
            <li>Legal authorities if required by law.</li>
            <li>Service providers who help operate our platform.</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🍪 4. Cookies & Tracking</h3>
          <p className="leading-relaxed">
            We use cookies to enhance browsing experience, analyze traffic, and personalize content.
            You can disable cookies anytime through your browser settings.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🔐 5. Data Security</h3>
          <p className="leading-relaxed">
            We employ advanced security measures to safeguard your data. However, no online platform
            is 100% secure; therefore, we cannot guarantee absolute protection.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🧾 6. Your Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we store.</li>
            <li>Request corrections or updates to your information.</li>
            <li>Request deletion of your data (where legally applicable).</li>
            <li>Opt out of marketing communications anytime.</li>
          </ul>
        </section>

        {/* Third-party Links */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🔗 7. Third-Party Links</h3>
          <p className="leading-relaxed">
            Our website may contain links to external sites. We are not responsible for the privacy
            practices or content of those websites.
          </p>
        </section>

        {/* Policy Updates */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">⚙️ 8. Policy Updates</h3>
          <p className="leading-relaxed">
            We may update this Privacy Policy periodically. Continued use of our website indicates
            acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-2xl font-semibold text-black mb-3">☎️ 9. Contact Us</h3>

          <p className="leading-relaxed">
            For questions regarding this Privacy Policy, contact us:
            <br />
            Email:{" "}
            <a href="mailto:Info@nueloot.com" className="text-orange underline">
              Info@nueloot.com
            </a>
            <br />
            WhatsApp:{" "}
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
