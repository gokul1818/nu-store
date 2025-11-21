import { useEffect, useState } from "react";
import { CategoryAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import FileUpload from "../../components/FileUpload";
import { showSuccess, showError } from "../../components/AppToast";

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ name: "", parent: "" });

  // Load existing category for editing
  const loadCategory = async () => {
    try {
      if (isEdit) {
        const res = await CategoryAPI.getOne(id);
        setName(res.data.name);
        setDescription(res.data.description || "");
        setIcon(res.data.icon || null);
        setParent(res.data.parent || "");
      }
    } catch (err) {
      showError("Failed to load category");
    }
  };

  useEffect(() => {
    loadCategory();
  }, [id]);

  const saveCategory = async () => {
    let hasError = false;
    const newError = { name: "", parent: "" };

    if (!name.trim()) {
      newError.name = "Category name is required";
      hasError = true;
    }

    if (!parent) {
      newError.parent = "Please select a parent category";
      hasError = true;
    }

    setError(newError);
    if (hasError) return;

    setLoading(true);

    try {
      const body = { name, description, parent };
      console.log('body: ', body);
      if (isEdit) await CategoryAPI.update(id, body);
      else await CategoryAPI.create(body);

      setLoading(false);
      showSuccess(`Category ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/admin/categories");
    } catch (err) {
      setLoading(false);
      const message = err?.response?.data?.message || "Failed to save category";
      showError(message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Category" : "Add Category"}
      </h2>

      {/* Parent Category Selector */}
      <div className="my-4">
        <label className="block font-semibold mb-1">Gender</label>
        <select
          value={parent}
          onChange={(e) => {
            setParent(e.target.value);
            if (error.parent) setError({ ...error, parent: "" });
          }}
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
            error.parent ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Gender</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
        {error.parent && <p className="text-red-500 text-sm mt-1">{error.parent}</p>}
      </div>

      {/* Category Name */}
      <AppInput
        label="Category Name"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error.name) setError({ ...error, name: "" });
        }}
        error={error.name}
      />

      {/* Description */}
      <div className="my-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter category description"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring border-gray-300"
          rows={4}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <AppButton loading={loading} onClick={saveCategory} className="w-80">
          Save
        </AppButton>
      </div>
    </div>
  );
}
