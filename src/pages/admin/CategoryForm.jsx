import { useEffect, useState } from "react";
import { CategoryAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { showSuccess, showError } from "../../components/AppToast";

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      if (isEdit) {
        const res = await CategoryAPI.getOne(id);
        setName(res.data.name);
      }
    } catch (err) {
      showError("Failed to load category");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    try {
      const body = { name };

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

      <AppInput
        label="Category Name"
        placeholder="Enter category name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        error={error}
      />

      <div className="mt-4 flex justify-center">
        <AppButton loading={loading} onClick={save} className="w-40">
          Save
        </AppButton>
      </div>
    </div>
  );
}
