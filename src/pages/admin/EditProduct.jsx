import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductAPI, CategoryAPI } from "../../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  /** ================================
   *  LOAD PRODUCT + CATEGORY DATA
   *  ================================ */
  const loadData = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        ProductAPI.getOne(id),
        CategoryAPI.getAll()
      ]);

      setProduct(productRes.data);
      setCategories(categoryRes.data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /** ================================
   *  FORM UPDATING FUNCTIONS
   *  ================================ */
  const updateField = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...product.variants];
    updated[index][field] = value;
    setProduct(prev => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", sku: "", stock: 0 }]
    }));
  };

  const removeVariant = (idx) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx)
    }));
  };

  /** ================================
   *  SAVE PRODUCT
   *  ================================ */
  const handleSave = async () => {
    try {
      await ProductAPI.updateProduct(product._id, product);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product Not Found</div>;

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
          <label className="block font-semibold mb-1">Selling Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* MRP */}
        <div>
          <label className="block font-semibold mb-1">MRP Price</label>
          <input
            type="number"
            value={product.mrp || ""}
            onChange={(e) => updateField("mrp", Number(e.target.value))}
            className="border p-2 rounded w-full"
            placeholder="Enter MRP price"
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

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            className="border p-2 rounded w-full"
            value={product.category || ""}
            onChange={(e) => updateField("category", e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
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

      {/* VARIANTS TABLE */}
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
