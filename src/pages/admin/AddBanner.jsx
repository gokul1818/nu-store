import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import { BannerAPI } from "../../services/api";

export default function BannerForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // if exists -> edit mode

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        link: "",
        imageUrl: "",
    });

    // -------------------------
    // LOAD BANNER (Edit Mode)
    // -------------------------
    useEffect(() => {
        const loadBanner = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const res = await BannerAPI.getOne(id);
                const b = res.data;

                setForm({
                    title: b.title,
                    link: b.link || "",
                    imageUrl: b.imageUrl,
                });

            } catch (err) {
                console.error(err);
                alert("Failed to load banner");
            } finally {
                setLoading(false);
            }
        };

        loadBanner();
    }, [id]);

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // -------------------------
    // SUBMIT HANDLER
    // -------------------------
    const handleSubmit = async () => {
        if (!form.title) {
            alert("Title is required!");
            return;
        }

        try {
            const payload = {
                title: form.title, link: form.link, imageUrl: form.imageUrl
            }

            if (isEdit) {
                await BannerAPI.update(id, payload);
                alert("Banner updated successfully!");
            } else {
                await BannerAPI.create(payload);
                alert("Banner created successfully!");
            }

            navigate("/admin/banner");

        } catch (err) {
            console.error(err);
            alert("Failed to save banner");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold mb-5">
                {isEdit ? "Edit Banner" : "Add Banner"}
            </h2>

            {/* Title */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                />
            </div>

            {/* Link */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Link (optional)</label>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={form.link}
                    placeholder="/products/tees"
                    onChange={(e) => updateField("link", e.target.value)}
                />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
                <FileUpload
                    label="Banner Image"
                    mode="single"
                    value={form.imageUrl}
                    onChange={(url) => {
                        updateField("imageUrl", url);
                    }}
                />
            </div>

            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded"
            >
                {isEdit ? "Update Banner" : "Save Banner"}
            </button>
        </div>
    );
}
