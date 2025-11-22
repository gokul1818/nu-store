export default function TermsConditions() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

            <p className="text-gray-700 mb-4">
                Welcome to <strong>Nueloot</strong>. By accessing or using our website, products, or
                services, you agree to comply with the following terms and conditions.
            </p>

            {/* Use of Site */}
            <h3 className="font-semibold mt-6 mb-2">1. Use of Site</h3>
            <p className="text-gray-700 mb-4">
                You may browse and make purchases on our platform in accordance with these Terms &
                Conditions. Any unlawful or unauthorized use of the site is strictly prohibited.
            </p>

            {/* Payments */}
            <h3 className="font-semibold mt-6 mb-2">2. Payments</h3>
            <p className="text-gray-700 mb-4">
                All payments are processed securely through <strong>Razorpay</strong>.
                Prices displayed on our website are in <strong>INR</strong> and include applicable taxes unless stated otherwise.
            </p>

            {/* User Obligations */}
            <h3 className="font-semibold mt-6 mb-2">3. User Obligations</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                <li>You agree not to misuse our services or website functionalities.</li>
                <li>You must not engage in fraudulent activities or attempt to breach website security.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            </ul>

            {/* Intellectual Property */}
            <h3 className="font-semibold mt-6 mb-2">4. Intellectual Property</h3>
            <p className="text-gray-700 mb-4">
                All content on this site—including text, graphics, logos, designs, and images—is the
                intellectual property of <strong>Nueloot</strong>.
                It may not be copied, reproduced, or used without written permission.
            </p>

            {/* Modifications */}
            <h3 className="font-semibold mt-6 mb-2">5. Modification of Terms</h3>
            <p className="text-gray-700 mb-4">
                Nueloot reserves the right to update or modify these Terms & Conditions at any time
                without prior notice. Continued use of the site indicates acceptance of updated terms.
            </p>

            {/* Contact */}
            <h3 className="font-semibold mt-6 mb-2">6. Contact Us</h3>
            <p className="text-gray-700">
                If you have any questions or concerns about these terms, feel free to contact us:
                <br />
                📧 Email:{" "}
                <a href="mailto:Info@nueloot.com" className="text-blue-600 underline">
                    Info@nueloot.com
                </a>
            </p>
        </div>
    );
}
