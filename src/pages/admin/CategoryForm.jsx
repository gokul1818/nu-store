import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import { showError, showSuccess } from "../../components/AppToast";
import FileUpload from "../../components/FileUpload";
import { CategoryAPI } from "../../services/api";

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ name: "", parent: "", image: "" });

  // Load existing category for editing
  const loadCategory = async () => {
    try {
      if (isEdit) {
        const res = await CategoryAPI.getOne(id);
        setName(res.data.name);
        setDescription(res.data.description || "");
        setImage(res.data.image || null);
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
    const newError = { name: "", parent: "", image: "" };

    if (!name.trim()) {
      newError.name = "Category name is required";
      hasError = true;
    }

    if (!parent) {
      newError.parent = "Please select a parent category";
      hasError = true;
    }

    if (!image) {
      newError.image = "Please upload category image";
      hasError = true;
    }
    setError(newError);
    if (hasError) return;

    setLoading(true);

    try {
      const body = { name, description, parent, image };
      console.log("body: ", body);
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg flex flex-col gap-3">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "Edit Category" : "Add Category"}
      </h2>

      <AppSelect
        label="Gender"
        value={parent}
        error={error.parent}
        onChange={(e) => {
          setParent(e.target.value);
          if (error.parent) setError({ ...error, parent: "" });
        }}
      >
        <option value="" disabled className="text-gray-400">
          Select Gender
        </option>
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="kids">Kids</option>
      </AppSelect>

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
      <FileUpload
        label="Category Image"
        id="category-upload"
        mode="single"
        value={image}
        onChange={(url) => {
          setImage(url);
        }}
        error={error.image}
      />
      <AppInput
        label="Description"
        type="textarea"
        placeholder="Enter category description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <div className="flex justify-center">
        <AppButton loading={loading} onClick={saveCategory} className="w-60">
          Save
        </AppButton>
      </div>
    </div>
  );
}
