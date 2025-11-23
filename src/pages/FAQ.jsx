export default function FAQ() {
    const faqs = [
        {
            q: "How long does delivery take?",
            a: "Orders are processed within 1–2 business days and delivered in 3–7 days depending on your location.",
        },
        {
            q: "Do you ship outside city or state?",
            a: "Currently we ship in and around all state. If your area is not serviceable, we will reach out to arrange alternatives or provide a full refund.",
        },
        {
            q: "Can I return or exchange a product?",
            a: "Yes, within 3 days of delivery. The product must be unused with tags, and a full unboxing video is required.",
        },
        {
            q: "What items are non-returnable?",
            a: "Customized items, gift cards, and sale products are non-returnable.",
        },
        {
            q: "Is there a return shipping fee?",
            a: "Yes, a flat ₹100 return shipping fee applies to all eligible return or exchange requests.",
        },
        {
            q: "Can I cancel my order?",
            a: "You can cancel before the order is shipped by contacting us on email or WhatsApp.",
        },
        {
            q: "How do I request a return or exchange?",
            a: "Email Info@nueloot.com or WhatsApp +91-9666407676 with your order ID, reason, and unboxing video.",
        },
        {
            q: "How are refunds processed?",
            a: "Refunds are issued within 3–5 working days after the returned product is verified.",
        },
        {
            q: "Do you offer Cash on Delivery (COD)?",
            a: "Yes! COD is available for most serviceable locations.",
        },
        {
            q: "Are your products original?",
            a: "Yes, all products are designed and quality-checked by our team before dispatch.",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-8">
                Find answers to the most common questions about shopping with Raw Shades.
            </p>

            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition"
                    >
                        <h3 className="text-lg font-semibold">{faq.q}</h3>
                        <p className="text-gray-700 mt-2">{faq.a}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-gray-700">
                Still need help?
                <br />
                Email:{" "}
                <a href="mailto:Info@nueloot.com" className="text-blue-600 underline">
                    Info@nueloot.com
                </a>{" "}
                <br />
                WhatsApp: <span className="font-semibold">+91-9100015419</span>
            </div>
        </div>
    );
}
