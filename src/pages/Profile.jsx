import useAuthStore from "../stores/useAuthStore";
import ProtectedRoute from "../components/ProtectedRoute";

function ProfileView() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-4 rounded">
        <div><strong>Name:</strong> {user?.firstName || user?.name}</div>
        <div><strong>Email:</strong> {user?.email}</div>
      </div>
    </div>
  );
}

export default function Profile() { return <ProtectedRoute><ProfileView /></ProtectedRoute>; }
