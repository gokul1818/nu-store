import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpinLoader from "../../components/SpinLoader";
import { CategoryAPI, ProductAPI } from "../../services/api";
import { formatCurrencyINR } from "../../utils/helpers";

export default function ProductDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await ProductAPI.getOne(id); // fetch product
        setProduct(res.data);
        setCategoryName(res.data.category)
       
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <SpinLoader />;
  if (!product) return <div className="p-6 text-center text-gray-500">Product not found</div>;

  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

  return (
    <div className="container mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6">
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-48 h-48 object-cover rounded-lg"
            />
          )}
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p><strong>Category:</strong> {categoryName || "-"}</p>
            <p><strong>Gender:</strong> {product.gender}</p>
            <p>
              <strong>MRP:</strong> {formatCurrencyINR(product.mrp)} |{" "}
              <strong>Selling Price:</strong> {formatCurrencyINR(product.price)} |{" "}
              <strong>Discount:</strong> {product.discount || 0}% |{" "}
              <strong>Sale Price:</strong> {formatCurrencyINR(product.salePrice || product.price)}
            </p>
            <p><strong>Total Stock:</strong> {totalStock}</p>
          </div>
        </div>

        {/* Gallery Images */}
        {product.images?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Gallery</h3>
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title}-${idx}`}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Variants */}
        {product.variants?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Variants</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {product.variants.map((v, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded-lg bg-gray-50 flex flex-col gap-2"
                >
                  <p><strong>Size:</strong> {v.size || "-"}</p>
                  <p><strong>Color:</strong> {v.color || "-"}</p>
                  <p><strong>SKU:</strong> {v.sku || "-"}</p>
                  <p><strong>Stock:</strong> {v.stock || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
