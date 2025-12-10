export default function TermsConditions() {
  return (
    <div className="container mx-auto px-4 py-16">

      {/* PAGE TITLE */}
      <div className="border-l-4 border-orange pl-4 mb-10">
        <h1 className="text-4xl font-bold text-black">
          <span className="text-orange-500 text-6xl">*</span>
          Terms & Conditions
        </h1>
      </div>

      {/* INTRO */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
        <p className="text-gray-700 leading-relaxed">
          Welcome to <strong>Nueloot</strong>. By using our website, products, or services,
          you agree to follow the terms and conditions outlined below.
        </p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-10 text-gray-700">

        {/* Use of Site */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🌐 1. Use of Site</h3>
          <p className="leading-relaxed">
            You may browse and make purchases on our platform in accordance with these Terms &
            Conditions. Any misuse, unauthorized access, or harmful activity on the website is strictly 
            prohibited.
          </p>
        </section>

        {/* Payments */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">💳 2. Payments</h3>
          <p className="leading-relaxed">
            All payments made on Nueloot are securely processed through 
            <strong> Razorpay</strong>. Prices shown on the website are in 
            <strong> INR</strong> and include applicable taxes unless mentioned otherwise.
          </p>
        </section>

        {/* User Obligations */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">🧾 3. User Obligations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the platform responsibly and lawfully.</li>
            <li>Avoid fraudulent activities or attempts to breach website security.</li>
            <li>Maintain the confidentiality of your login and account details.</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">📚 4. Intellectual Property</h3>
          <p className="leading-relaxed">
            All content on this website—including text, images, designs, logos, and graphics—is the 
            exclusive intellectual property of <strong>Nueloot</strong>. Reproduction or distribution 
            without written permission is strictly prohibited.
          </p>
        </section>

        {/* Modification */}
        <section>
          <h3 className="text-2xl font-semibold text-black mb-3">⚙️ 5. Modification of Terms</h3>
          <p className="leading-relaxed">
            Nueloot reserves the right to modify, update, or change these Terms & Conditions at any 
            time. Continued use of the website signifies your acceptance of the updated terms.
          </p>
        </section>

        {/* Contact Section */}
        <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-2xl font-semibold text-black mb-3">📩 6. Contact Us</h3>
          <p className="leading-relaxed">
            If you have any questions regarding these Terms & Conditions, feel free to reach out:
            <br />
            Email:{" "}
            <a href="mailto:Info@nueloot.com" className="text-orange underline">
              Info@nueloot.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
