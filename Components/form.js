"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const DEFAULT_AVATAR = "/avatar.png";
export default function Form({ editingUser, setEditingUser, setUsers }) {
    const router = useRouter();
    console.log(editingUser, "editingUsereditingUsereditingUser")
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        status: "",
        image: null,
    });

    const [preview, setPreview] = useState(DEFAULT_AVATAR);

    const resetForm = () => {
        setFormData({
            username: "",
            email: "",
            phone: "",
            status: "",
            image: null,
        });
        setPreview(DEFAULT_AVATAR);
    };

    const isFormValid = () => {
        if (!formData.username || formData.username.length > 30) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return false;

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) return false;

        if (!formData.status) return false;

        return true;
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // if (name === "image") {
        //     const file = files[0];
        //     if (file) {
        //         setFormData((prev) => ({ ...prev, image: file }));
        //         setPreview(URL.createObjectURL(file));
        //     }
        // }
        //  else {
        setFormData(prev => ({ ...prev, [name]: value }));
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingUser) {
            const isNothingChanged =
                formData.username === editingUser.username &&
                formData.email === editingUser.email &&
                formData.phone === editingUser.phone &&
                formData.status === editingUser.status &&
                !formData.image;

            if (isNothingChanged) {
                alert("Please update at least one field");
                return;
            }
        }
        if (formData.username.length > 30) {
            alert("username must be max 30 character");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Email format is invalid");
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Phone number must be 10 digits");
            return;
        }

        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("status", formData.status);

        if (formData.image) {
            data.append("image", formData.image);
        }
        const url = editingUser
            ? `/api/users/${editingUser._id}`
            : "/api/users";

        const method = editingUser ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            body: data,
        });


        if (!res.ok) {
            const err = await res.json();
            alert(err.message);
            return;
        }

        const savedUser = await res.json();

        setUsers(prev =>
            editingUser
                ? prev.map(u => (u._id === savedUser._id ? savedUser : u))
                : [...prev, savedUser]
        );

        setEditingUser(null);
        resetForm();
        router.push('/table')
    };

    useEffect(() => {
        if (editingUser) {
            setFormData({
                username: editingUser.username,
                email: editingUser.email,
                phone: editingUser.phone,
                status: editingUser.status,
                image: null,
            });
            setPreview(editingUser.image || DEFAULT_AVATAR);
        }
    }, [editingUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 rounded-md">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center text-gray-700">
                    User Form 🧾
                </h2>

                {/* Avatar */}
                <div className="flex flex-col items-center">
                    <img
                        src={preview}
                        alt="avatar"
                        className="w-24 h-24 rounded-full border mb-2 object-cover"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-1 py-1 rounded-lg bg-blue-50 text-blue-700  border border-blue-200 hover:bg-blue-100 transition text-sm">

                        📷 Upload Image

                        <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setFormData(prev => ({ ...prev, image: file }));
                            setPreview(URL.createObjectURL(file));
                        }}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        maxLength={28}
                        placeholder="Enter Username..."
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email..."
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        pattern="\d{10}"
                        name="phone"
                        placeholder="Enter number..."
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                    >
                        <option value="">Select status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <button
                    disabled={!isFormValid()}
                    className={`w-full py-2 rounded-md text-white ${!isFormValid() ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"}`}
                >
                    {editingUser ? "Update User" : "Create User"}
                </button>

            </form>
        </div>
    );
}