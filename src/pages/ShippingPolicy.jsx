export default function ShippingPolicy() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

            <p className="text-gray-700 mb-4">
                At <strong>Nueloot</strong>, we strive to deliver your order as quickly and
                efficiently as possible while maintaining the quality of our products.
            </p>

            <h3 className="font-semibold mt-6 mb-2">Delivery Timeline</h3>
            <p className="text-gray-700 mb-4">
                Orders are typically processed within <strong>1–2 business days</strong>.
                Delivery may take <strong>3–7 business days</strong> depending on your location.
                Please note that delays may occur due to unforeseen circumstances.
            </p>

            <h3 className="font-semibold mt-6 mb-2">Shipping Areas</h3>
            <p className="text-gray-700 mb-4">
                We currently ship <strong>in and around Thirupathi</strong>.
                If your area is not serviceable, we will contact you to arrange an
                alternative delivery option or issue a full refund.
            </p>

            <h3 className="font-semibold mt-6 mb-2">Shipping Charges</h3>
            <p className="text-gray-700 mb-4">
                Shipping charges are standard within Thirupathi and may vary based on your order value.
                Any applicable charges will always be displayed clearly at checkout.
            </p>

            <h3 className="font-semibold mt-6 mb-2">Contact Us</h3>
            <p className="text-gray-700">
                For any shipping-related questions or order status updates,
                feel free to email us at:
                <a href="mailto:Info@nueloot.com" className="text-blue-600 underline">
                    Info@nueloot.com
                </a>
            </p>
        </div>
    );
}
