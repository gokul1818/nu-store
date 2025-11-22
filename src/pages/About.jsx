export default function About() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">About Nueloot</h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        Welcome to <strong>Nueloot</strong> — a brand built with passion, creativity, and a mission
        to redefine streetwear. We believe fashion should be bold, expressive, and accessible to
        everyone. Our journey started with a simple idea: create high-quality apparel that looks
        premium without the premium price tag.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">✨ What We Stand For</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li><strong>Quality First:</strong> Every product is crafted with care and attention to detail.</li>
        <li><strong>Modern Designs:</strong> We blend streetwear style with comfort for everyday wear.</li>
        <li><strong>Affordable Fashion:</strong> Premium look, honest pricing.</li>
        <li><strong>Customer Satisfaction:</strong> We’re committed to delivering a smooth and reliable experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">🚚 Fast & Reliable Delivery</h2>
      <p className="text-gray-700 mb-6">
        We know you can’t wait to rock your new fit. That’s why we dispatch most orders within{" "}
        <strong>24 hours</strong>. Your style shouldn’t wait!
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">🤝 Our Mission</h2>
      <p className="text-gray-700 mb-6">
        Our mission is simple — to make streetwear exciting, affordable, and accessible.  
        Every collection we drop reflects our passion for creativity and customer love.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">📩 Contact Us</h2>
      <p className="text-gray-700">
        Got questions, feedback, or collaboration ideas?  
        We’re always here to talk!  
        <br />
        <span className="font-semibold">Email:</span>{" "}
        <a href="mailto:Info@nueloot.com" className="text-blue-600 underline">
          Info@nueloot.com
        </a>
        <br />
        <span className="font-semibold">WhatsApp:</span> +91-9100015419
      </p>
    </div>
  );
}
