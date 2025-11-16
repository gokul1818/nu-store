import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import { formatCurrency } from "../utils/helpers";
import { useOrderStore } from "../stores/useOrderStore";
import AppLoader from "../components/AppLoader";

export default function ProductDetails() {
  const { id } = useParams();
  const { selectedProduct, fetchProductById } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const createOrder = useOrderStore((s) => s.createOrder);

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      await fetchProductById(id);
      setLoading(false);
    }
    if (id) loadProduct();
  }, [id, fetchProductById]);

  const images = selectedProduct?.images?.length
    ? selectedProduct.images
    : ["/placeholder.png"];
  const variants = selectedProduct?.variants || [];

  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants]
  );

  const safeColorIndex = Math.min(selectedColorIndex, colors.length - 1);
  const selectedColor = colors[safeColorIndex] || "";

  const availableSizes = useMemo(
    () => variants.filter((v) => v.color === selectedColor).map((v) => v.size),
    [variants, selectedColor]
  );

  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  if (loading || !selectedProduct) return <AppLoader />;

  const handleAddToCart = () => {
    const variant = variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (!variant) return;

    addItem({
      productId: selectedProduct._id,
      qty,
      variant,
    });
  };

  const handleBuyNow = async () => {
    const variant = variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (!variant) return;

    await createOrder({
      items: [
        {
          productId: selectedProduct._id,
          qty,
          variant,
        },
      ],
      paymentMethod: "COD",
      shippingAddress: { street: "Default", city: "Default" },
    });
  };

  const allSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Thumbnails */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 cursor-pointer transition-all ${
                    idx === currentImage
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center: Main image */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-4">
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center bg-gray-50">
                  <img
                    src={images[currentImage]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg shadow-sm transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product details */}
          <div className="lg:col-span-6 order-3 space-y-4">
            <h1 className="text-2xl font-normal text-gray-900 mb-1">
              {selectedProduct.title}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-700">Price:</span>
              <span className="text-3xl font-normal text-red-700">
                {formatCurrency(selectedProduct.price)}
              </span>
            </div>

            {/* Color selection */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <div className="font-medium text-sm">
                  Color: <span className="font-normal">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, idx) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`relative cursor-pointer border-2 rounded-lg p-1 transition-all ${
                        idx === safeColorIndex
                          ? "border-orange-500 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-center p-1">
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <div className="font-medium text-sm">
                  Size: <span className="font-normal">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-100 text-orange-800"
                            : isAvailable
                            ? "border-gray-300 hover:bg-gray-50 cursor-pointer"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <h2 className="font-bold text-lg">About this item</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Quantity input */}
            <div className="mt-4 flex items-center gap-4">
              <label className="font-medium text-sm">Quantity:</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value)))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
