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

        setForm({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          phone: res.phone || "",
          addresses:
            res.addresses?.length > 0
              ? res.addresses.map((addr) => ({
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

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(form.phone.trim()))
      newErrors.phone = "Enter valid 10-digit number";

    const addr = form.addresses[0];
    const addrErrors = {};

    if (!addr.label.trim()) addrErrors.label = "Label is required";
    if (!addr.street.trim()) addrErrors.street = "Street is required";
    if (!addr.city.trim()) addrErrors.city = "City is required";
    if (!addr.state.trim()) addrErrors.state = "State is required";

    if (!addr.zipcode.trim()) addrErrors.zipcode = "Zipcode is required";
    else if (!/^[0-9]{5,6}$/.test(addr.zipcode.trim()))
      addrErrors.zipcode = "Enter valid zipcode";

    if (!addr.country.trim()) addrErrors.country = "Country is required";

    if (!addr.phone.trim()) addrErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(addr.phone.trim()))
      addrErrors.phone = "Enter valid 10-digit phone";

    if (Object.keys(addrErrors).length > 0)
      newErrors.addresses = [addrErrors];

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

        {/* VIEW MODE */}
        {!editMode && (
          <div className="space-y-3">
            <div><strong>First Name:</strong> {form.firstName}</div>
            <div><strong>Last Name:</strong> {form.lastName}</div>
            <div><strong>Mobile Number:</strong> {form.phone}</div>

            <div>
              <strong>Address:</strong>
              <div className="ml-4 mt-1 space-y-1">
                <div>No: {form.addresses[0].label}</div>
                <div>Street: {form.addresses[0].street}</div>
                <div>City: {form.addresses[0].city}</div>
                <div>State: {form.addresses[0].state}</div>
                <div>Zipcode: {form.addresses[0].zipcode}</div>
                <div>Country: {form.addresses[0].country}</div>
                <div>Phone Number: {form.addresses[0].phone}</div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
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

            <AppInput
              label="Mobile Number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
            />

            <label className="block font-medium">Address</label>

            <div className="space-y-2">

              <AppInput
                placeholder="Label (Home / Work)"
                value={form.addresses[0].label}
                onChange={(e) =>
                  handleChange("addresses", e.target.value, 0, "label")
                }
                error={errors.addresses?.[0]?.label}
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

              <AppInput
                placeholder="Zipcode"
                value={form.addresses[0].zipcode}
                onChange={(e) =>
                  handleChange("addresses", e.target.value, 0, "zipcode")
                }
                error={errors.addresses?.[0]?.zipcode}
              />

              <AppInput
                placeholder="Country"
                value={form.addresses[0].country}
                onChange={(e) =>
                  handleChange("addresses", e.target.value, 0, "country")
                }
                error={errors.addresses?.[0]?.country}
              />

              <AppInput
                placeholder="Phone Number"
                value={form.addresses[0].phone}
                onChange={(e) =>
                  handleChange("addresses", e.target.value, 0, "phone")
                }
                error={errors.addresses?.[0]?.phone}
              />
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
