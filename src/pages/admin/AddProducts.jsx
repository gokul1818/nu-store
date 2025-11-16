import { useState, useEffect } from "react";
import { ProductAPI, CategoryAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    mrp: "",
    price: "",
    gender: "Men",
    description: "",
    thumbnail: "",
    category: "",
    variants: [{ size: "M", color: "Black", sku: "", stock: 0 }]
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const res = await CategoryAPI.getAll();
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  // Update variant fields
  const updateVariant = (index, key, value) => {
    const updated = [...form.variants];
    updated[index][key] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { size: "", color: "", sku: "", stock: 0 }]
    });
  };

  const submit = async () => {
    try {
      await ProductAPI.create(form);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      alert(err?.response?.data?.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>

      {/* Title */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Product Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* MRP Price */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="MRP Price"
        type="number"
        value={form.mrp}
        onChange={(e) => setForm({ ...form, mrp: e.target.value })}
      />

      {/* Selling Price */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Selling Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      {/* Gender */}
      <select
        className="border p-2 w-full mb-3"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        <option>Men</option>
        <option>Women</option>
        <option>Kids</option>
        <option>Unisex</option>
      </select>

      {/* Category */}
      <label className="block mb-1 font-semibold">Category</label>
      <select
        className="border p-2 w-full mb-3"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option value={cat._id} key={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Thumbnail URL */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Thumbnail Image URL"
        value={form.thumbnail}
        onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
      />

      {/* Variants */}
      <h3 className="font-semibold mt-4 mb-2">Variants</h3>

      {form.variants.map((v, i) => (
        <div
          key={i}
          className="border p-3 rounded mb-3 grid md:grid-cols-4 gap-3"
        >
          <input
            className="border p-2"
            placeholder="Size"
            value={v.size}
            onChange={(e) => updateVariant(i, "size", e.target.value)}
          />

          <input
            className="border p-2"
            placeholder="Color"
            value={v.color}
            onChange={(e) => updateVariant(i, "color", e.target.value)}
          />

          <input
            className="border p-2"
            placeholder="SKU"
            value={v.sku}
            onChange={(e) => updateVariant(i, "sku", e.target.value)}
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Stock"
            value={v.stock}
            onChange={(e) => updateVariant(i, "stock", e.target.value)}
          />
        </div>
      ))}

      <button className="px-4 py-2 border rounded mb-4" onClick={addVariant}>
        + Add Variant
      </button>

      {/* Save Button */}
      <button
        className="w-full bg-black text-white py-2 rounded"
        onClick={submit}
      >
        Save Product
      </button>
    </div>
  );
}
