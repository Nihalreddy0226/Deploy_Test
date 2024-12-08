import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    phone_number: "",
    store_address: "",
    store_name: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    ifsc_code: "",
    bank_name: "",
    id_proof_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null); // For previewing the uploaded image
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/vendor/profile/");
        setProfile(data);

        // If an image exists in the backend, set it as the preview image
        if (data.id_proof_image) {
          setPreviewImage(data.id_proof_image); // Ensure this is a valid URL
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in profile) {
        formData.append(key, profile[key]);
      }

      const { data } = await api.put("/api/vendor/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data);

      // Update preview image after successful upload
      if (data.id_proof_image) {
        setPreviewImage(data.id_proof_image);
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, id_proof_image: file });

    // Set the preview for the newly uploaded image
    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewImage(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Address</label>
            <textarea
              name="store_address"
              value={profile.store_address}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              name="store_name"
              value={profile.store_name}
              onChange={handleChange}
              required
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Holder Name</label>
            <input
              type="text"
              name="bank_account_holder_name"
              value={profile.bank_account_holder_name}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              value={profile.bank_account_number}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
            <input
              type="text"
              name="ifsc_code"
              value={profile.ifsc_code}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={profile.bank_name}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Proof Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover border border-gray-300 rounded-md"
              />
            )}
            <input
              type="file"
              name="id_proof_image"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
