import { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import ProtectedRoute from "../components/ProtectedRoute";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { showError, showSuccess } from "../components/AppToast";
import { AuthAPI } from "../services/api";
import { safeParse } from "../utils/helpers";

function ProfileView() {
  const authStore = useAuthStore();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    addresses: [
      {
        label: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load profile from API on page load
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await AuthAPI.getProfile();

        // Parse addresses safely
        const parsedAddresses = Array.isArray(safeParse(res.addresses))
          ? safeParse(res.addresses)
          : [];

        setForm({
          first_name: res.first_name || "",
          last_name: res.last_name || "",
          phone: res.phone || "",
          addresses:
            parsedAddresses.length > 0
              ? parsedAddresses.map((addr) => ({
                  label: addr.label || "",
                  street: addr.street || "",
                  city: addr.city || "",
                  state: addr.state || "",
                  zipcode: addr.zipcode || "",
                  country: addr.country || "",
                  phone: addr.phone || "",
                }))
              : [
                  {
                    label: "",
                    street: "",
                    city: "",
                    state: "",
                    zipcode: "",
                    country: "",
                    phone: "",
                  },
                ],
        });
      } catch (err) {
        showError("Failed to load profile");
      }
    }

    fetchProfile();
  }, []);

  // Input handler
  const handleChange = (field, value, index = null, subfield = null) => {
    if (field === "addresses") {
      const updated = [...form.addresses];
      updated[index][subfield] = value;
      setForm({ ...form, addresses: updated });
      return;
    }
    setForm({ ...form, [field]: value });
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";

    if (!form.phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(form.phone.trim()))
      newErrors.phone = "Enter valid 10-digit number";

    const addr = form.addresses?.[0] || {};
    const addrErrors = {};

    if (!addr.label?.trim()) addrErrors.label = "Label is required";
    if (!addr.street?.trim()) addrErrors.street = "Street is required";
    if (!addr.city?.trim()) addrErrors.city = "City is required";
    if (!addr.state?.trim()) addrErrors.state = "State is required";

    if (!addr.zipcode?.trim()) addrErrors.zipcode = "Zipcode is required";
    else if (!/^[0-9]{5,6}$/.test(addr.zipcode.trim()))
      addrErrors.zipcode = "Enter valid zipcode";

    if (!addr.country?.trim()) addrErrors.country = "Country is required";

    if (!addr.phone?.trim()) addrErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(addr.phone.trim()))
      addrErrors.phone = "Enter valid 10-digit phone";

    if (Object.keys(addrErrors).length > 0) newErrors.addresses = [addrErrors];

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update profile
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await authStore.updateProfile(form);
      showSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      showError(err?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // Ensure we always have an address to display
  const address = form.addresses?.[0] || {
    label: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  };

  return (
    <div className="container mx-auto px-4 py-16 relative">
      {/* Background dashed grid */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-30 -z-10">
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

          {!editMode && (
            <button
              className="text-orange font-semibold text-sm hover:underline"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* VIEW MODE */}
        {!editMode && (
          <div className="space-y-4 text-gray-800">
            <div className="bg-gray-50 p-4 rounded-xl border space-y-1">
              <p>
                <strong>First Name:</strong> {form.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {form.last_name}
              </p>
              <p>
                <strong>Mobile:</strong> {form.phone}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border space-y-1">
              <p className="font-semibold text-lg">Address</p>

              <div className="ml-2 text-gray-700 space-y-1">
                <p>
                  <strong>No:</strong> {address.label}
                </p>
                <p>
                  <strong>Street:</strong> {address.street}
                </p>
                <p>
                  <strong>City:</strong> {address.city}
                </p>
                <p>
                  <strong>State:</strong> {address.state}
                </p>
                <p>
                  <strong>Zipcode:</strong> {address.zipcode}
                </p>
                <p>
                  <strong>Country:</strong> {address.country}
                </p>
                <p>
                  <strong>Phone:</strong> {address.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div className="space-y-5">
            {/* Basic Fields */}
            <AppInput
              label="First Name"
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              error={errors.first_name}
            />

            <AppInput
              label="Last Name"
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              error={errors.last_name}
            />

            <AppInput
              label="Mobile Number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
            />

            {/* Address */}
            <div className="pt-3">
              <label className="block font-semibold text-gray-900 text-lg mb-2">
                Address
              </label>

              <div className="space-y-3">
                <AppInput
                  placeholder="Label (Home / Work)"
                  value={address.label}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "label")
                  }
                  error={errors.addresses?.[0]?.label}
                />

                <AppInput
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "street")
                  }
                  error={errors.addresses?.[0]?.street}
                />

                <AppInput
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "city")
                  }
                  error={errors.addresses?.[0]?.city}
                />

                <AppInput
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "state")
                  }
                  error={errors.addresses?.[0]?.state}
                />

                <AppInput
                  placeholder="Zipcode"
                  value={address.zipcode}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "zipcode")
                  }
                  error={errors.addresses?.[0]?.zipcode}
                />

                <AppInput
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "country")
                  }
                  error={errors.addresses?.[0]?.country}
                />

                <AppInput
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    handleChange("addresses", e.target.value, 0, "phone")
                  }
                  error={errors.addresses?.[0]?.phone}
                />
              </div>
            </div>

            {/* Save Button */}
            <AppButton loading={loading} onClick={handleSubmit} className="w-full">
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
