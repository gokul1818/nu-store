export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">

      {/* HEADER TITLE */}
      <div className="border-l-4 border-orange pl-4 mb-12">
        <h1 className="text-4xl font-bold text-black mb-2">
          <span className="text-orange-500 text-6xl">*</span>

          About Us – <span className="text-orange">NueLoot</span>
        </h1>
        <p className="text-gray-600 text-lg">Bold Fashion. Confident Living.</p>
      </div>

      {/* INTRO */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-black mb-4">Dress Bold. Be Stylish.</h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          At <strong className="text-black">NUELOOT</strong>, fashion isn’t just clothing —
          it’s confidence, attitude, and self-expression.
          Founded in 2025, our mission is simple:
          <span className="font-semibold text-orange"> inspire people to dress boldly and live stylishly.</span>
        </p>
      </section>

      {/* OUR STORY */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-3">Our Story</h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          NueLoot was created to break the idea that fashion has to be ordinary.
          We design clothing that stands out — pieces that feel
          <span className="font-semibold text-orange"> expressive, modern, and bold.</span>
        </p>

        <p className="text-gray-700 leading-relaxed">
          What began as a creative spark has grown into a movement for people who
          dress with purpose and personality.
        </p>
      </section>

      {/* OUR MISSION */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-3">Our Mission</h2>

        <ul className="space-y-3 text-gray-700 pl-6 list-disc">
          <li>Empower everyone to express their identity through bold, stylish fashion.</li>
          <li>Design clothing that blends comfort with strong personality.</li>
        </ul>
      </section>

      {/* OUR VISION */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-3">Our Vision</h2>

        <ul className="space-y-3 text-gray-700 pl-6 list-disc">
          <li>To become a global fashion brand that inspires confidence.</li>
          <li>A world where people dress not to blend in — but to stand out.</li>
        </ul>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-3">What Makes Us Different</h2>

        <ul className="space-y-3 text-gray-700 pl-6 list-disc">
          <li><span className="font-semibold text-orange">Bold Signature Designs</span> – reflect attitude & individuality</li>
          <li><span className="font-semibold text-orange">Premium Fabrics</span> – stylish yet comfortable for daily wear</li>
          <li>Modern Aesthetic – clean, strong, and expressive</li>
          <li>Limited Releases – exclusive designs for a unique wardrobe</li>
          <li>Built for Confidence – every piece makes you feel your best</li>
        </ul>
      </section>

      {/* OUR VALUES */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-3">Our Values</h2>

        <ul className="space-y-3 text-gray-700 pl-6 list-disc">
          <li><strong className="text-black">Creativity</strong> – fashion inspired by personality</li>
          <li><strong className="text-black">Quality</strong> – clothing made to last</li>
          <li><strong className="text-black">Confidence</strong> – style that empowers</li>
          <li><strong className="text-black">Authenticity</strong> – be true to who you are</li>
          <li><strong className="text-black">Community</strong> – fashion that connects people</li>
        </ul>
      </section>

      {/* DELIVERY */}
      <section className="mb-12 p-6 bg-gray-100 rounded-xl border-l-4 border-orange">
        <h2 className="text-2xl font-bold text-black mb-3">🚚 Fast & Reliable Delivery</h2>
        <p className="text-gray-700 leading-relaxed">
          Most orders are dispatched within <strong className="text-black">24 hours</strong>.
          Your style shouldn’t wait!
        </p>
      </section>

      {/* CONTACT US */}
      <section className="p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-black mb-3">📩 Contact Us</h2>

        <p className="text-gray-700 leading-relaxed">
          Got questions or collaboration ideas? We’d love to hear from you!
        </p>

        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a
              href="mailto:Info@nueloot.com"
              className="text-orange underline hover:text-orange/80"
            >
              Info@nueloot.com
            </a>
          </p>

          <p>
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a
              href="https://wa.me/919100015419"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange underline hover:text-orange/80"
            >
              +91-9100015419
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
