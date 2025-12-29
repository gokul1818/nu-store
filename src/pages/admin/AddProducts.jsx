import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import { showError, showSuccess } from "../../components/AppToast";
import FileUpload from "../../components/FileUpload";
import { CategoryAPI, ProductAPI } from "../../services/api";
import {
  colorOptions,
  genderOptions,
  sizeOptions,
} from "../../constants/constant";

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
    reviews: [],
  });

  /* ===========================
     SAFE JSON PARSER
  ============================ */
  const parseJSON = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") { 
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("JSON parse failed:", e, data);
        return data;
      }
    }
    return [];
  };

  /* ===========================
     LOAD DATA
  ============================ */
  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await CategoryAPI.getAll();
        setCategories(catRes.data || []);

        if (!isEdit) return;

        const productRes = await ProductAPI.getOne(id);
        const product = productRes.data;

        const images = parseJSON(product?.images).map((url) => ( url ));
        const variants = parseJSON(product?.variants).map((v) => ({
          size: v.size?.toUpperCase() || "",
          color: v.color?.toLowerCase() || "",
          sku: v.sku || "",
          stock:
            v.stock !== undefined && v.stock !== null
              ? String(v.stock)
              : "",
        }));

        setForm({
          title: product?.title || "",
          mrp: product?.mrp || "",
          price: product?.price || "",
          discount: product?.discount || "",
          gender: product?.gender?.replace("gender_", "") || "",
          description: product?.description || "",
          thumbnail: product?.thumbnail || "",
          images,
          category: String(product?.category || ""),
          variants: variants.length
            ? variants
            : [{ size: "", color: "", sku: "", stock: "" }],
          reviews: parseJSON(product?.reviews),
        });
      } catch (err) {
        console.error(err);
        showError("Failed to load data");
      }
    };

    loadData();
  }, [id, isEdit]);

  /* ===========================
     AUTO PRICE CALCULATION
  ============================ */
  useEffect(() => {
    const mrp = Number(form.mrp);
    const discount = Number(form.discount);

    if (!isNaN(mrp) && !isNaN(discount)) {
      const price = mrp - (mrp * discount) / 100;
      setForm((f) => ({ ...f, price: price.toFixed(2) }));
    }
  }, [form.mrp, form.discount]);

  /* ===========================
     SKU GENERATOR
  ============================ */
  const generateSKU = (title, size, color) => {
    if (!title || !size || !color) return "";
    const code = title
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("");
    return `${code}-${size.toUpperCase()}-${color
      .slice(0, 3)
      .toUpperCase()}`;
  };

  /* ===========================
     UPDATE VARIANT
  ============================ */
  const updateVariant = (index, key, value) => {
    const updated = [...form.variants];
    updated[index][key] = value;

    const size = key === "size" ? value : updated[index].size;
    const color = key === "color" ? value : updated[index].color;

    if (!updated[index].sku && form.title && size && color) {
      updated[index].sku = generateSKU(form.title, size, color);
    }

    setErrors((e) => {
      const n = { ...e };
      delete n[`${key}-${index}`];
      delete n[`sku-${index}`];
      return n;
    });

    setForm({ ...form, variants: updated });
  };

  /* ===========================
     ADD VARIANT
  ============================ */
  const addVariant = () => {
    const last = form.variants[form.variants.length - 1];
    const stock = Number(last.stock);
    const temp = {};

    if (!last.size) temp[`size-${form.variants.length - 1}`] = "Required";
    if (!last.color) temp[`color-${form.variants.length - 1}`] = "Required";
    if (!last.sku) temp[`sku-${form.variants.length - 1}`] = "Required";
    if (isNaN(stock) || stock < 0)
      temp[`stock-${form.variants.length - 1}`] = "Invalid stock";

    if (Object.keys(temp).length) {
      setErrors((e) => ({ ...e, ...temp }));
      return;
    }

    setForm((f) => ({
      ...f,
      variants: [...f.variants, { size: "", color: "", sku: "", stock: "" }],
    }));
  };

  /* ===========================
     VALIDATION
  ============================ */
  const validate = () => {
    const e = {};

    if (!form.title.trim()) e.title = "Required";
    if (Number(form.mrp) <= 0) e.mrp = "Invalid MRP";
    if (Number(form.discount) < 0 || Number(form.discount) > 100)
      e.discount = "Invalid discount";
    if (!form.gender) e.gender = "Required";
    if (!form.category) e.category = "Required";
    if (!form.images.length) e.images = "Images required";
    if (!form.description.trim()) e.description = "Required";

    form.variants.forEach((v, i) => {
      if (!v.size) e[`size-${i}`] = "Required";
      if (!v.color) e[`color-${i}`] = "Required";
      if (!v.sku) e[`sku-${i}`] = "Required";
      if (isNaN(Number(v.stock)) || Number(v.stock) < 0)
        e[`stock-${i}`] = "Invalid stock";
    });

    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ===========================
     SUBMIT
  ============================ */
  const submit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      images: form.images.map((i) => i),
      mrp: Number(form.mrp),
      price: Number(form.price),
      discount: Number(form.discount),
      gender: `gender_${form.gender}`,
      variants: form.variants.map((v) => ({
        ...v,
        size: v.size.toUpperCase(),
        color: v.color.toLowerCase(),
        stock: Number(v.stock),
      })),
    };

    setLoading(true);
    try {
      isEdit
        ? await ProductAPI.updateProduct(id, payload)
        : await ProductAPI.create(payload);

      showSuccess("Product saved");
      navigate("/admin/products");
    } catch (e) {
      console.error(e);
      showError("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     UI
  ============================ */


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
            {genderOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
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
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </AppSelect>

          <FileUpload
            id="gallery-upload"
            label="Gallery Images"
            mode="multiple"
            value={form.images}
            onChange={(urls) => {
              setForm((prev) => ({ ...prev, images: urls }));
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.images;
                return newErrors;
              });
            }}
            error={errors.images}
          />

          {/* Description */}
          <AppInput
            label="Description"
            placeholder="Product Description"
            type="textarea"
            rows={4}
            value={form.description}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.description;
                return newErrors;
              });
            }}
            className="md:col-span-2"
            error={errors.description}
          />
        </div>

        {/* Variants */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Variants</h3>
          {Array.isArray(form.variants) &&
            form.variants.map((v, i) => (
              <div
                key={i}
                className="relative grid md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50 items-end"
              >
                {/* Size */}
                <AppSelect
                  label="Size"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  error={errors[`size-${i}`]}
                >
                  <option value="" disabled>
                    Select Size
                  </option>
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </AppSelect>

                {/* Color */}
                <AppSelect
                  label="Color"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                  error={errors[`color-${i}`]}
                >
                  <option value="" disabled>
                    Select Color
                  </option>
                  {colorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
            <AppButton className="w-40" loading={loading} onClick={() => submit()}>
              Save Product
            </AppButton>
          </div>
        </div>

        {/* Product Reviews List */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>

          {form?.reviews?.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}

          <div className="space-y-3">
            {Array.isArray(form.reviews) &&
              form?.reviews?.map((review, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      ⭐ {review.rating} / 5
                    </p>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => deleteReview(index, review)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}