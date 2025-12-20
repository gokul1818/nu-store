import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import { formatCurrency, safeParse } from "../utils/helpers";
import { useOrderStore } from "../stores/useOrderStore";
import AppLoader from "../components/AppLoader";
import { sizeOptions } from "../constants/constant";
import { FaStar } from "react-icons/fa";

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
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      await fetchProductById(id);
      setLoading(false);
    }
    if (id) loadProduct();
  }, [id, fetchProductById]);

  const images = selectedProduct?.images?.length
    ? safeParse(selectedProduct.images)
    : ["/placeholder.png"];
  const variants = selectedProduct?.variants ? safeParse(selectedProduct?.variants) : [];
  console.log('variants: ', variants);

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

  const selectedVariant = useMemo(() => {
    return variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [variants, selectedColor, selectedSize]);

  const stock = selectedVariant?.stock || 0;

  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  if (!selectedProduct || loading) return <AppLoader />;

  const handleAddToCart = () => {
    const variant = variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (!variant) return;

    addItem({
      ...selectedProduct,
      qty,
      selectedOptions: variant,
    });
  };

  const handleBuyNow = () => {
    const variant = variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (!variant) return;

    const buyNowItem = {
      ...selectedProduct,
      qty,
      selectedOptions: variant,
    };

    navigate("/checkout", { state: { buyNowItem } });
  };

  /** StarRating Component */
  const StarRating = ({
    rating = 0,
    maxStars = 5,
    showCount = false,
    count = 0,
  }) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 mt-1">
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-400 text-lg">
            <FaStar />

          </span>
        ))}
        {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-lg">
            <FaStar />

          </span>
        ))}
        {showCount && (
          <span className="ml-2 text-sm text-gray-500">({count})</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen relative">

      {/* Background dashed grid */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-30 -z-10">
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ------------------ Thumbnails ------------------ */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-14 h-14 rounded-xl border cursor-pointer transition-all shadow-sm ${idx === currentImage
                      ? "border-v shadow-md scale-105"
                      : "border-gray-200 hover:border-v"
                    }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ------------------ Main Image ------------------ */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-4">
              <div className="rounded-2xl overflow-hidden shadow-xl border bg-white">
                <div className="relative w-full h-[420px] lg:h-[520px] flex items-center justify-center bg-gray-50">
                  <img
                    src={images[currentImage]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold shadow-md transition ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    }`}
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={stock === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold shadow-md transition ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-v hover:bg-v/90 text-white"
                    }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* ------------------ Product Details ------------------ */}
          <div className="lg:col-span-6 order-3 space-y-6">

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {selectedProduct.title}
            </h1>

            {/* Ratings */}
            <StarRating
              rating={selectedProduct.average_rating}
              showCount={true}
              count={selectedProduct.rating_count}
            />

            {/* Price */}
            <div className="flex items-end gap-3 mt-3">
              {selectedProduct.discount > 0 ? (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatCurrency(selectedProduct.mrp)}
                  </span>
                  <span className="text-4xl text-v font-bold">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                  <span className="text-md text-v font-semibold">
                    {selectedProduct.discount}% OFF
                  </span>
                </>
              ) : (
                <span className="text-4xl text-red-700 font-bold">
                  {formatCurrency(selectedProduct.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            {selectedVariant && (
              <div className="mt-1">
                {stock === 0 ? (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                ) : stock < 10 ? (
                  <span className="text-v font-semibold">
                    Limited Stock ({stock} left)
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    In Stock ({stock})
                  </span>
                )}
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-gray-700">
                  Color: <span className="text-gray-900">{selectedColor}</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {colors.map((color, idx) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColorIndex(idx)}
                      style={{ backgroundColor: color }}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition ${idx === safeColorIndex
                          ? "border-v shadow-lg scale-105"
                          : "border-gray-300 hover:border-v"
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <div className="font-medium text-gray-700">
                  Size: <span className="text-gray-900">{selectedSize}</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {sizeOptions.map((size) => {
                    const isAvailable = availableSizes.includes(size.value);
                    const isSelected = selectedSize === size.value;

                    return (
                      <button
                        key={size.id}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setSelectedSize(size.value)}
                        className={`px-5 py-2 rounded-xl border text-sm font-semibold transition ${isSelected
                            ? "border-v bg-v-100 text-v-800 shadow"
                            : isAvailable
                              ? "border-gray-300 hover:bg-gray-50"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="font-bold text-xl mb-1">About this item</h2>
              <p className="text-gray-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-700">Quantity:</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-v"
              />
            </div>

            {/* Reviews */}
            {safeParse(selectedProduct.reviews)?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-bold text-xl mb-3">Customer Reviews</h2>
                <div className="space-y-4">
                  {safeParse(selectedProduct.reviews).map((r) => (
                    <div key={r.id} className="bg-gray-50 p-4 rounded-xl shadow-sm border">
                      <StarRating rating={r.rating} />
                      <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
