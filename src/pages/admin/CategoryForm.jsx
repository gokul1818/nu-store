import { useEffect, useState } from "react";
import { CategoryAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const load = async () => {
    const res = await CategoryAPI.getAll();
    setCategories(res.data);

    if (isEdit) {
      const res2 = await CategoryAPI.getOne(id);
      setName(res2.data.name);
      setParent(res2.data.parent || "");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const body = { name, };

    if (isEdit) await CategoryAPI.update(id, body);
    else await CategoryAPI.create(body);

    navigate("/admin/categories");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Category" : "Add Category"}
      </h2>

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

    

      <button
        onClick={save}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
