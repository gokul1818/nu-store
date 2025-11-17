import { useState, useEffect } from "react";
import { ProductAPI, CategoryAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import AppButton from "../../components/AppButton";
import { showSuccess, showError } from "../../components/AppToast";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    mrp: "",
    price: "",
    gender: "Men",
    description: "",
    thumbnail: "",
    category: "",
    variants: [{ size: "", color: "", sku: "", stock: 0 }],
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await CategoryAPI.getAll();
        setCategories(res.data);
      } catch (err) {
        showError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Validate all fields
  const validate = () => {
    const temp = {};

    // Product fields
    if (!form.title.trim()) temp.title = "Title is required";
    if (!form.mrp) temp.mrp = "MRP is required";
    if (!form.price) temp.price = "Price is required";
    if (!form.gender) temp.gender = "Gender is required";
    if (!form.category) temp.category = "Category is required";
    if (!form.thumbnail.trim()) temp.thumbnail = "Thumbnail is required";
    if (!form.description.trim()) temp.description = "Description is required";

    // Variants
    form.variants.forEach((v, i) => {
      if (!v.size.trim()) temp[`size-${i}`] = "Size is required";
      if (!v.color.trim()) temp[`color-${i}`] = "Color is required";
      if (!v.sku.trim()) temp[`sku-${i}`] = "SKU is required";
      if (v.stock === "" || v.stock === null) temp[`stock-${i}`] = "Stock is required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Generate SKU from Title + Size + Color
  const generateSKU = (title, size, color) => {
    if (!title || !size || !color) return "";
    const words = title.split(" ");
    const code = words.map((w) => w[0].toUpperCase()).join("");
    return `${code}-${size.toUpperCase()}-${color.slice(0, 3).toUpperCase()}`;
  };

  // Update variant and auto-generate SKU
  const updateVariant = (index, key, value) => {
    const updated = [...form.variants];
    updated[index][key] = value;

    if (form.title && updated[index].size && updated[index].color) {
      updated[index].sku = generateSKU(form.title, updated[index].size, updated[index].color);
    }

    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { size: "", color: "", sku: "", stock: 0 }],
    });
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await ProductAPI.create(form);
      setLoading(false);
      showSuccess("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.message || "Failed to add product";
      showError(message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Product
        </h2>

        {/* Product Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <AppInput
            label="Title"
            placeholder="Product Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
          />

          <AppInput
            label="MRP Price"
            placeholder="MRP Price"
            type="number"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            error={errors.mrp}
          />

          <AppInput
            label="Selling Price"
            placeholder="Selling Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            error={errors.price}
          />

          <AppSelect
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            error={errors.gender}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </AppSelect>

          <AppSelect
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            error={errors.category}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </AppSelect>
 <FileUpload
        label="Gallery Images"
        mode="multiple"
        value={form.images}
        onChange={(urls) => setForm({ ...form, images: urls })}
      />
          {/* <AppInput
            label="Thumbnail URL"
            placeholder="Thumbnail Image URL"
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            className="md:col-span-2"
            error={errors.thumbnail}
          /> */}

          <AppInput
            label="Description"
            placeholder="Product Description"
            type="textarea"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="md:col-span-2"
            error={errors.description}
          />
        </div>

        {/* Variants */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Variants</h3>
          {form.variants.map((v, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50"
            >
              <AppInput
                placeholder="Size"
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                error={errors[`size-${i}`]}
              />
              <AppInput
                placeholder="Color"
                value={v.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
                error={errors[`color-${i}`]}
              />
              <AppInput
                placeholder="SKU"
                value={v.sku}
                disabled
                error={errors[`sku-${i}`]}
              />
              <AppInput
                placeholder="Stock"
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", e.target.value)}
                error={errors[`stock-${i}`]}
              />
            </div>
          ))}

          <div className="flex flex-col md:flex-row mt-5 items-center justify-between gap-4">
            <AppButton
              className="border border-primary text-primary hover:bg-primary hover:text-white transition"
              onClick={addVariant}
            >
              + Add Variant
            </AppButton>

            <AppButton
              className="w-40"
              loading={loading}
              onClick={submit}
            >
              Save Product
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
