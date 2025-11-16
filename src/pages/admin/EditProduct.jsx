import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductAPI } from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const res = await ProductAPI.getOne(id);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const updateField = (field, value) => {
    setProduct((p) => ({ ...p, [field]: value }));
  };

  const updateVariant = (index, field, value) => {
    const copy = [...product.variants];
    copy[index][field] = value;
    setProduct((p) => ({ ...p, variants: copy }));
  };

  const addVariant = () => {
    setProduct((p) => ({
      ...p,
      variants: [...p.variants, { size: "", color: "", sku: "", stock: 0 }],
    }));
  };

  const removeVariant = (idx) => {
    const copy = product.variants.filter((_, i) => i !== idx);
    setProduct((p) => ({ ...p, variants: copy }));
  };

  const handleSave = async () => {
    try {
      await ProductAPI.updateProduct(product._id, product);
      alert("Product updated");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-5">Edit Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={product.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select
            value={product.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
            <option>Unisex</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-semibold mb-1">Thumbnail URL</label>
          <input
            type="text"
            value={product.thumbnail}
            onChange={(e) => updateField("thumbnail", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={product.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows="3"
          className="border p-2 rounded w-full"
        ></textarea>
      </div>

      {/* VARIANTS */}
      <h3 className="text-lg font-semibold mt-6">Variants</h3>

      <table className="w-full border mt-2 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Size</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {product.variants.map((v, idx) => (
            <tr key={idx}>
              <td className="border p-2">
                <input
                  value={v.size}
                  onChange={(e) => updateVariant(idx, "size", e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="border p-2">
                <input
                  value={v.color}
                  onChange={(e) => updateVariant(idx, "color", e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="border p-2">
                <input
                  value={v.sku}
                  onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(idx, "stock", Number(e.target.value))
                  }
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="border p-2">
                <button
                  onClick={() => removeVariant(idx)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addVariant}
        className="mt-3 px-3 py-1 bg-gray-800 text-white rounded"
      >
        + Add Variant
      </button>

      {/* SAVE BUTTON */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
