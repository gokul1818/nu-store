export default function FAQ() {
  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Orders are dispatched within 24 hours and delivered within 3–5 working days.",
    },
    {
      q: "Can I return a product?",
      a: "Yes! You can return eligible products within 7 days of delivery.",
    },
    {
      q: "Do you offer Cash on Delivery?",
      a: "Yes, COD is available for most locations.",
    },
    {
      q: "How do I track my order?",
      a: "You will receive tracking details via SMS and email once your order is shipped.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white shadow p-4 rounded border">
            <h3 className="font-semibold mb-2">{f.q}</h3>
            <p className="text-gray-700">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
