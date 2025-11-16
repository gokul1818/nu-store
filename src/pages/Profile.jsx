import { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import ProtectedRoute from "../components/ProtectedRoute";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { showError, showSuccess } from "../components/AppToast";
import { AuthAPI } from "../services/api";

function ProfileView() {
  const authStore = useAuthStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    addresses: [
      {
        house: "",
        street: "",
        city: "",
        state: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch profile details
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await AuthAPI.getProfile();
        setForm({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          addresses:
            res.addresses?.length > 0
              ? res.addresses.map((addr) => ({
                  house: addr.house || "",
                  street: addr.street || "",
                  city: addr.city || "",
                  state: addr.state || "",
                }))
              : [{ house: "", street: "", city: "", state: "" }],
        });
      } catch (err) {
        showError("Failed to fetch profile");
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (field, value, index = null, subfield = null) => {
    if (field === "addresses") {
      const updated = [...form.addresses];
      if (subfield) updated[index][subfield] = value;
      setForm({ ...form, addresses: updated });
      setErrors((prev) => ({ ...prev, addresses: null }));
    } else {
      setForm({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    const addr = form.addresses[0];
    const addrErrors = {};
    if (!addr.house.trim()) addrErrors.house = "House/Flat no is required";
    if (!addr.street.trim()) addrErrors.street = "Street is required";
    if (!addr.city.trim()) addrErrors.city = "City is required";
    if (!addr.state.trim()) addrErrors.state = "State is required";

    if (Object.keys(addrErrors).length > 0) newErrors.addresses = [addrErrors];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        addresses: form.addresses,
      };
      await authStore.updateProfile(payload); // use store method that updates localStorage
      showSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.log('err: ', err);
      showError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Profile</h2>
          {!editMode && (
            <button
              className="text-secondary text-sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* Display mode */}
        {!editMode && (
          <div className="space-y-3">
            <div>
              <strong>First Name:</strong> {form.firstName}
            </div>
            <div>
              <strong>Last Name:</strong> {form.lastName}
            </div>
            <div>
              <strong>Address:</strong>
              <div className="ml-4 mt-1 space-y-1">
                <div>House/Flat No: {form.addresses[0].house}</div>
                <div>Street: {form.addresses[0].street}</div>
                <div>City: {form.addresses[0].city}</div>
                <div>State: {form.addresses[0].state}</div>
              </div>
            </div>
          </div>
        )}

        {/* Edit mode */}
        {editMode && (
          <div className="space-y-3">
            <AppInput
              label="First Name"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors.firstName}
            />
            <AppInput
              label="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors.lastName}
            />
            <div>
              <label className="block font-medium mb-2">Address</label>
              <div className="space-y-2">
                <AppInput
                  placeholder="House/Flat No"
                  value={form.addresses[0].house}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "house")
                  }
                  error={errors.addresses?.[0]?.house}
                />
                <AppInput
                  placeholder="Street"
                  value={form.addresses[0].street}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "street")
                  }
                  error={errors.addresses?.[0]?.street}
                />
                <AppInput
                  placeholder="City"
                  value={form.addresses[0].city}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "city")
                  }
                  error={errors.addresses?.[0]?.city}
                />
                <AppInput
                  placeholder="State"
                  value={form.addresses[0].state}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "state")
                  }
                  error={errors.addresses?.[0]?.state}
                />
              </div>
            </div>

            <AppButton
              loading={loading}
              onClick={handleSubmit}
              className="w-full"
            >
              Save Changes
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}
