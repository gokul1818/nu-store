import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import { showError, showSuccess } from "../../components/AppToast";
import FileUpload from "../../components/FileUpload";
import { CategoryAPI, ProductAPI } from "../../services/api";

const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Yellow",
  "Pink",
  "Orange",
];

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
    discount: "",
    gender: "",
    description: "",
    thumbnail: "",
    images: [],
    category: "",
    variants: [{ size: "", color: "", sku: "", stock: "" }],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await CategoryAPI.getAll();
        setCategories(res.data);

        if (isEdit) {
          const product = await ProductAPI.getOne(id);
          setForm({
            title: product.data.title || "",
            mrp: product.data.mrp || "",
            price: product.data.price || "",
            discount: product.data.discount || "",
            gender: product.data.gender || "men",
            description: product.data.description || "",
            thumbnail: product.data.thumbnail || "",
            images: product.data.images || [],
            category: product.data.category?._id || "",
            variants:
              product.data.variants.length > 0
                ? product.data.variants.map((v) => ({
                    ...v,
                    stock: v.stock !== undefined ? v.stock : "",
                  }))
                : [{ size: "", color: COLORS[0], sku: "", stock: "" }],
          });
        }
      } catch (err) {
        showError("Failed to load data");
      }
    };
    loadData();
  }, [id, isEdit]);

  // Auto-calculate price
  useEffect(() => {
    if (form.mrp !== "" && form.discount !== "") {
      const discountedPrice = form.mrp - (form.mrp * form.discount) / 100;
      setForm((f) => ({ ...f, price: discountedPrice.toFixed(2) }));
    }
  }, [form.mrp, form.discount]);

  // Update SKU when title changes for all variants
  useEffect(() => {
    if (!form.title) return;
    const updatedVariants = form.variants.map((v) => ({
      ...v,
      sku: v.size && v.color ? generateSKU(form.title, v.size, v.color) : v.sku,
    }));
    setForm((f) => ({ ...f, variants: updatedVariants }));
  }, [form.title]);

  const generateSKU = (title, size, color) => {
    if (!title || !size || !color) return "";
    const code = title
      .split(" ")
      .map((w) => w[0].toUpperCase())
      .join("");
    return `${code}-${size.toUpperCase()}-${color.slice(0, 3).toUpperCase()}`;
  };

  const updateVariant = (index, key, value) => {
    const updated = [...form.variants];
    updated[index][key] = value;

    // Clear respective error
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${key}-${index}`];
      delete newErrors[`sku-${index}`]; // also clear SKU error
      return newErrors;
    });

    // Update SKU if possible
    const size = key === "size" ? value : updated[index].size;
    const color = key === "color" ? value : updated[index].color;
    if (form.title && size && color) {
      updated[index].sku = generateSKU(form.title, size, color);
    }

    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    const lastVariant = form.variants[form.variants.length - 1];
    const tempErrors = {};

    if (!lastVariant.size.trim())
      tempErrors[`size-${form.variants.length - 1}`] = "Size is required";
    if (!lastVariant.color.trim())
      tempErrors[`color-${form.variants.length - 1}`] = "Color is required";
    if (!lastVariant.sku.trim())
      tempErrors[`sku-${form.variants.length - 1}`] = "SKU is required";
    if (lastVariant.stock === "" || lastVariant.stock < 0)
      tempErrors[`stock-${form.variants.length - 1}`] =
        "Stock must be zero or greater";

    if (Object.keys(tempErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...tempErrors }));
      return;
    }

    setForm({
      ...form,
      variants: [
        ...form.variants,
        { size: "", color: COLORS[0], sku: "", stock: "" },
      ],
    });
  };

  const validate = () => {
    const temp = {};
    if (!form.title.trim()) temp.title = "Title is required";
    if (form.mrp === "" || form.mrp < 0)
      temp.mrp = "MRP must be greater than 0";
    if (form.price > form.mrp) temp.price = "Price cannot exceed MRP";
    if (form.discount < 0 || form.discount > 100)
      temp.discount = "Discount must be between 0 and 100";
    if (!form.gender) temp.gender = "Gender is required";
    if (!form.category) temp.category = "Category is required";
    if (!form.thumbnail.trim()) temp.thumbnail = "Thumbnail is required";
    if (form.images.length === 0) temp.images = "Gallery images are required";
    if (!form.description.trim()) temp.description = "Description is required";

    form.variants.forEach((v, i) => {
      if (!v.size.trim()) temp[`size-${i}`] = "Size is required";
      if (!v.color.trim()) temp[`color-${i}`] = "Color is required";
      if (!v.sku.trim()) temp[`sku-${i}`] = "SKU is required";
      if (v.stock === "" || v.stock < 0)
        temp[`stock-${i}`] = "Stock must be zero or greater";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      mrp: Number(form.mrp),
      price: Number(form.price),
      discount: Number(form.discount),
      variants: form.variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
      })),
    };

    setLoading(true);
    try {
      if (isEdit) await ProductAPI.updateProduct(id, payload);
      else await ProductAPI.create(payload);

      showSuccess(`Product ${isEdit ? "updated" : "added"} successfully!`);
      navigate("/admin/products");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save product";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Title */}
          <AppInput
            label="Title"
            placeholder="Product Title"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.title;
                return newErrors;
              });
            }}
            error={errors.title}
          />

          {/* MRP */}
          <AppInput
            label="MRP Price"
            placeholder="MRP Price"
            type="number"
            value={form.mrp}
            onChange={(e) => {
              setForm({ ...form, mrp: e.target.value });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.mrp;
                return newErrors;
              });
            }}
            error={errors.mrp}
          />

          {/* Discount */}
          <AppInput
            label="Discount %"
            placeholder="Discount"
            type="number"
            value={form.discount}
            onChange={(e) => {
              setForm({ ...form, discount: e.target.value });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.discount;
                return newErrors;
              });
            }}
            error={errors.discount}
          />

          {/* Sale Price */}
          <AppInput
            label="Sale Price"
            placeholder="Sale Price"
            type="number"
            value={form.price}
            disabled
          />

          {/* Gender */}
          <AppSelect
            label="Gender"
            value={form.gender}
            onChange={(e) => {
              setForm({ ...form, gender: e.target.value });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.gender;
                return newErrors;
              });
            }}
            error={errors.gender}
          >
            <option value="" disabled className="text-gray-400">
              Select Gender
            </option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </AppSelect>

          {/* Category */}
          <AppSelect
            label="Category"
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.category;
                return newErrors;
              });
            }}
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
            id="thumbnail-upload"
            label="Thumbnail Image"
            mode="single"
            value={form.thumbnail}
            onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))}
            error={errors.thumbnail}
          />

          <FileUpload
            id="gallery-upload"
            label="Gallery Images"
            mode="multiple"
            value={form.images}
            onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
            error={errors.images}
          />

          {/* Description */}
          <AppInput
            label="Description"
            placeholder="Product Description"
            type="textarea"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
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
              className="relative grid md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50"
            >
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
                <option value="" disabled className="text-gray-400">
                  Select Color
                </option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </AppSelect>
              <AppInput
                placeholder="SKU"
                value={v.sku}
                disabled
                error={errors[`sku-${i}`]}
              />
              <div className="flex flex-row items-center">
                <AppInput
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  error={errors[`stock-${i}`]}
                  className="w-[95%]"
                />

                {i > 0 && (
                  <button
                    onClick={() => {
                      const updated = form.variants.filter(
                        (_, idx) => idx !== i
                      );
                      setForm({ ...form, variants: updated });
                    }}
                    className="text-l text-red-600 hover:text-red-800 ml-2"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row mt-5 items-center justify-between gap-4">
            <AppButton
              className="border border-primary text-primary hover:bg-primary hover:text-white transition"
              onClick={addVariant}
            >
              + Add Variant
            </AppButton>
            <AppButton className="w-40" loading={loading} onClick={submit}>
              Save Product
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
