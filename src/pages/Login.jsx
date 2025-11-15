import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login({ emailOrPhone:email, password });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded">
        <input className="border p-2 w-full rounded mb-3" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="border p-2 w-full rounded mb-3" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded w-full" disabled={loading}>Sign in</button>
      </form>
      <div className="mt-4 text-sm">
        <Link to="/register" className="text-blue-600">Create an account</Link>
      </div>
    </div>
  );
}
