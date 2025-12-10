import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import FileUpload from "../../components/FileUpload";
import { BannerAPI } from "../../services/api";
import { showError, showSuccess } from "../../components/AppToast";

export default function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    image_url: "",
  });
  const [error, setError] = useState({ title: "", image_url: "" });

  // -------------------------
  // LOAD BANNER (Edit Mode)
  // -------------------------
  useEffect(() => {
    const loadBanner = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await BannerAPI.getOne(id);
        const b = res.data;

        setForm({
          title: b.title,
          link: b.link || "",
          image_url: b.image_url,
        });
      } catch (err) {
        showError("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, [id]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error[key]) setError({ ...error, [key]: "" });
  };

  // -------------------------
  // SUBMIT HANDLER
  // -------------------------
  const handleSubmit = async () => {
    let hasError = false;
    const newError = { title: "", image_url: "" };

    if (!form.title.trim()) {
      newError.title = "Title is required";
      hasError = true;
    }

    if (!form.image_url) {
      newError.image_url = "Please upload a banner image";
      hasError = true;
    }

    setError(newError);
    if (hasError) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        link: form.link,
        image_url: form.image_url,
      };

      if (isEdit) await BannerAPI.update(id, payload);
      else await BannerAPI.create(payload);

      showSuccess(`Banner ${isEdit ? "updated" : "created"} successfully!`);
      navigate("/admin/banner");
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isEdit ? "Edit Banner" : "Add Banner"}
      </h2>

      <AppInput
        label="Title"
        placeholder="Enter banner title"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
        error={error.title}
      />

      <AppInput
        label="Link (optional)"
        placeholder="/products/tees"
        value={form.link}
        onChange={(e) => updateField("link", e.target.value)}
      />

      <FileUpload
        id="banner-upload"
        label="Banner Image"
        mode="single"
        maxSize={5}
        value={form.image_url}
        onChange={(url) => updateField("image_url", url)}
        error={error.image_url}
      />

      <div className="flex justify-center mt-4">
        <AppButton loading={loading} onClick={handleSubmit} className="w-60">
          {isEdit ? "Update Banner" : "Save Banner"}
        </AppButton>
      </div>
    </div>
  );
}
