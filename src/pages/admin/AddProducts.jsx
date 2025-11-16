import { useState } from "react";
import { ProductAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    gender: "Men",
    description: "",
    thumbnail: "",
    variants: [
      { size: "M", color: "Black", sku: "", stock: 0 }
    ]
  });

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

      {/* Price */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        type="number"
      />

      {/* Gender */}
      <select
        className="border p-2 w-full mb-3"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        <option>Men</option>
        <option>Women</option>
        <option>Couple</option>
      </select>

      {/* Thumbnail URL */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Thumbnail Image URL"
        value={form.thumbnail}
        onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
      />

      <h3 className="font-semibold mt-4 mb-2">Variants</h3>

      {form.variants.map((v, i) => (
        <div key={i} className="border p-3 rounded mb-3 grid md:grid-cols-4 gap-3">
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

      <button
        className="px-4 py-2 border rounded mb-4"
        onClick={addVariant}
      >
        + Add Variant
      </button>

      <button
        className="w-full bg-black text-white py-2 rounded"
        onClick={submit}
      >
        Save Product
      </button>
    </div>
  );
}
