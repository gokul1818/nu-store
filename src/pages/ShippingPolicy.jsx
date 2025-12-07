export default function ShippingPolicy() {
    return (
        <div className="container mx-auto px-4 py-16">

            {/* Page Title */}
            <div className="border-l-4 border-orange pl-4 mb-10">

                <h1 className="text-4xl font-bold text-black">
                    <span className="text-orange-500 text-6xl">*</span>
                    Shipping Policy</h1>
            </div>

            {/* Intro Section */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
                <p className="text-gray-700 leading-relaxed">
                    At <strong>Nueloot</strong>, we strive to deliver your order as quickly and efficiently as possible
                    while maintaining the quality of our products.
                </p>
            </section>

            {/* Content Sections */}
            <div className="space-y-10 text-gray-700">

                {/* Delivery Timeline */}
                <section>
                    <h3 className="text-2xl font-semibold text-black mb-3">Delivery Timeline</h3>
                    <p className="leading-relaxed">
                        Orders are typically processed within <strong>1–2 business days</strong>. Delivery may take{" "}
                        <strong>3–7 business days</strong> depending on your location.
                        Please note that delays may occur due to unforeseen circumstances.
                    </p>
                </section>

                {/* Shipping Areas */}
                <section>
                    <h3 className="text-2xl font-semibold text-black mb-3">Shipping Areas</h3>
                    <p className="leading-relaxed">
                        We currently ship <strong>in and around Thirupathi</strong>.
                        If your area is not serviceable, we will contact you to arrange an alternative delivery option
                        or issue a full refund.
                    </p>
                </section>

                {/* Shipping Charges */}
                <section>
                    <h3 className="text-2xl font-semibold text-black mb-3">Shipping Charges</h3>
                    <p className="leading-relaxed">
                        Shipping charges are standard within Thirupathi and may vary based on your order value.
                        Any applicable charges will always be displayed clearly at checkout.
                    </p>
                </section>

                {/* Contact */}
                <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-2xl font-semibold text-black mb-3">Contact Us</h3>
                    <p className="leading-relaxed">
                        For any shipping-related questions or order status updates, feel free to email us at:{" "}
                        <a href="mailto:Info@nueloot.com" className="text-orange underline hover:text-orange/80">
                            Info@nueloot.com
                        </a>
                    </p>
                </section>

            </div>
        </div>
    );
}
