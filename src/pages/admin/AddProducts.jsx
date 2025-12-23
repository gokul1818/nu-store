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

  // Robust JSON parser
  const parseJSON = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('JSON parse error:', e);
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await CategoryAPI.getAll();
        setCategories(res.data || []);

        if (isEdit) {
          const productRes = await ProductAPI.getOne(id);
          const product = productRes.data;

          console.log('Raw product data:', product);
          console.log('Raw images:', product?.images);
          console.log('Raw variants:', product?.variants);

          // Parse JSON strings from database using robust parser
          const parsedImages = parseJSON(product?.images);
          const parsedVariants = parseJSON(product?.variants);
          const parsedReviews = parseJSON(product?.reviews);

          console.log('Parsed images:', parsedImages);
          console.log('Parsed variants:', parsedVariants);

          // Format images - convert to objects with url property for FileUpload
          const formattedImages = parsedImages.map(url => ({ url: url }));

          // Format variants - ensure proper format
          const formattedVariants = parsedVariants.map(v => ({
            size: v.size?.toUpperCase() || "", // Convert to uppercase (XL, L, S)
            color: v.color?.toLowerCase() || "", // Convert to lowercase (black, navy_blue, white)
            sku: v.sku || "",
            stock: v.stock !== undefined && v.stock !== null ? String(v.stock) : ""
          }));

          console.log('Formatted images:', formattedImages);
          console.log('Formatted variants:', formattedVariants);

          // Remove "gender_" prefix from gender
          const formattedGender = product?.gender?.replace("gender_", "") || "";

          const newFormData = {
            title: product?.title || "",
            mrp: product?.mrp || "",
            price: product?.price || "",
            discount: product?.discount || "",
            gender: formattedGender,
            description: product?.description || "",
            thumbnail: product?.thumbnail || "",
            images: formattedImages,
            category: String(product?.category || ""),
            variants: formattedVariants.length > 0
              ? formattedVariants
              : [{ size: "", color: "", sku: "", stock: "" }],
            reviews: parsedReviews
          };

          console.log('Final form state:', newFormData);
          setForm(newFormData);
        }
      } catch (err) {
        console.error('Load data error:', err);
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
      delete newErrors[`sku-${index}`];
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

  const deleteReview = async (index, review) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await ProductAPI.deleteReview(id, review.user);

      const updatedReviews = form.reviews.filter((_, i) => i !== index);

      setForm((prev) => ({ ...prev, reviews: updatedReviews }));

      showSuccess("Review deleted successfully");
    } catch (err) {
      console.error(err);
      showError("Failed to delete review");
    }
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
        { size: "", color: colorOptions[0].value, sku: "", stock: "" },
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

    // Extract URLs from image objects for submission
    const imageUrls = form.images.map(img => img.url || img);

    const payload = {
      ...form,
      images: imageUrls,
      mrp: Number(form.mrp),
      price: Number(form.price),
      discount: Number(form.discount),
      gender: `gender_${form.gender}`, // Add gender_ prefix back
      variants: form.variants.map((v) => ({
        ...v,
        size: v.size.toUpperCase(),
        color: v.color.toLowerCase(),
        stock: Number(v.stock),
      })),
    };

    console.log('Submit payload:', payload);

    setLoading(true);
    try {
      if (isEdit) await ProductAPI.updateProduct(id, payload);
      else await ProductAPI.create(payload);

      showSuccess(`Product ${isEdit ? "updated" : "added"} successfully!`);
      navigate("/admin/products");
    } catch (err) {
      console.error('Submit error:', err);
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
            <AppButton className="w-40" loading={loading} onClick={submit}>
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