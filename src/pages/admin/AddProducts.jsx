import { useState, useEffect } from "react";
import { ProductAPI, CategoryAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import AppButton from "../../components/AppButton";
import { showSuccess, showError } from "../../components/AppToast";

const COLORS = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Pink", "Orange"];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    mrp: "",
    price: "",
    discount: 0, // New
    salePrice: "", // New
    gender: "Men",
    description: "",
    thumbnail: "",
    images: [],
    category: "",
    variants: [{ size: "", color: COLORS[0], sku: "", stock: 0 }],
  });

  // Load categories and existing product
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await CategoryAPI.getAll();
        setCategories(res.data);

        if (isEdit) {
          const product = await ProductAPI.getOne(id);
          setForm({
            title: product.data.title,
            mrp: product.data.mrp,
            price: product.data.price,
            discount: product.data.discount || 0,
            salePrice: product.data.salePrice || product.data.price,
            gender: product.data.gender || "Men",
            description: product.data.description,
            thumbnail: product.data.thumbnail || "",
            images: product.data.images || [],
            category: product.data.category?._id || "",
            variants:
              product.data.variants.length > 0
                ? product.data.variants
                : [{ size: "", color: COLORS[0], sku: "", stock: 0 }],
          });
        }
      } catch (err) {
        showError("Failed to load data");
      }
    };
    loadData();
  }, [id]);

  // Auto-calculate salePrice from MRP and discount
  useEffect(() => {
    if (form.mrp && form.discount >= 0) {
      const discountedPrice = form.mrp - (form.mrp * form.discount) / 100;
      setForm((f) => ({ ...f, salePrice: discountedPrice.toFixed(2) }));
    }
  }, [form.mrp, form.discount]);

  const validate = () => {
    const temp = {};
    if (!form.title.trim()) temp.title = "Title is required";
    if (!form.mrp || form.mrp < 0) temp.mrp = "MRP must be ≥ 0";
    if (!form.price || form.price < 0) temp.price = "Price must be ≥ 0";
    if (form.price > form.mrp) temp.price = "Price cannot exceed MRP";
    if (form.discount < 0 || form.discount > 100) temp.discount = "Discount must be 0-100";
    if (!form.gender) temp.gender = "Gender is required";
    if (!form.category) temp.category = "Category is required";
    if (!form.thumbnail.trim()) temp.thumbnail = "Thumbnail is required";
    if (!form.description.trim()) temp.description = "Description is required";

    form.variants.forEach((v, i) => {
      if (!v.size.trim()) temp[`size-${i}`] = "Size is required";
      if (!v.color.trim()) temp[`color-${i}`] = "Color is required";
      if (!v.sku.trim()) temp[`sku-${i}`] = "SKU is required";
      if (v.stock === "" || v.stock === null || v.stock < 0) temp[`stock-${i}`] = "Stock must be ≥ 0";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const generateSKU = (title, size, color) => {
    if (!title || !size || !color) return "";
    const code = title.split(" ").map((w) => w[0].toUpperCase()).join("");
    return `${code}-${size.toUpperCase()}-${color.slice(0, 3).toUpperCase()}`;
  };

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
      variants: [...form.variants, { size: "", color: COLORS[0], sku: "", stock: 0 }],
    });
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) await ProductAPI.update(id, form);
      else await ProductAPI.create(form);

      setLoading(false);
      showSuccess(`Product ${isEdit ? "updated" : "added"} successfully!`);
      navigate("/admin/products");
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.message || "Failed to save product";
      showError(message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

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
            onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
            error={errors.mrp}
          />
          <AppInput
            label="Selling Price"
            placeholder="Selling Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            error={errors.price}
          />
          <AppInput
            label="Discount %"
            placeholder="Discount"
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            error={errors.discount}
          />
          <AppInput
            label="Sale Price"
            placeholder="Sale Price"
            type="number"
            value={form.salePrice}
            disabled
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
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </AppSelect>
          <FileUpload
            label="Gallery Images"
            mode="multiple"
            value={form.images}
            onChange={(urls) => setForm({ ...form, images: urls })}
          />
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
            <div key={i} className="grid md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
              <AppInput
                placeholder="Size"
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                error={errors[`size-${i}`]}
              />
              <AppSelect
                value={v.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
                error={errors[`color-${i}`]}
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </AppSelect>
              <AppInput placeholder="SKU" value={v.sku} disabled error={errors[`sku-${i}`]} />
              <AppInput
                placeholder="Stock"
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", Number(e.target.value))}
                error={errors[`stock-${i}`]}
              />
            </div>
          ))}
          <div className="flex flex-col md:flex-row mt-5 items-center justify-between gap-4">
            <AppButton className="border border-primary text-primary hover:bg-primary hover:text-white transition" onClick={addVariant}>+ Add Variant</AppButton>
            <AppButton className="w-40" loading={loading} onClick={submit}>Save Product</AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
