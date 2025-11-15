import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded">
        <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border p-2 w-full rounded mb-3" placeholder="First name" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 w-full rounded mb-3" placeholder="Email" />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 w-full rounded mb-3" placeholder="Password" type="password" />
        <button className="bg-black text-white px-4 py-2 rounded w-full">Create</button>
      </form>
    </div>
  );
}
