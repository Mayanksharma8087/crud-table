"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiEdit, BiTrashAlt } from "react-icons/bi";

export default function Table({ users = [], setUsers, setEditingUser }) {
    const router =useRouter();
    // const [page, setPage] = useState(1);
    // const [totalPage, setTotalPages] = useState(1);
    // const limit = 5;

    // const totalPages = Math.ceil(users.length / limit);
    // const start = (page - 1) * limit;
    // const paginatedUsers = users.slice(start, start + limit);

    //     useEffect(() => {
    //   fetch(`/api/users`)
    // //   fetch(`/api/users?page=${page}&limit=5`)
    //     .then(res => res.json())
    //     .then(data => {
    //       setUsers(data.users);
    //     //   setTotalPages(data.totalPages);
    //     });
    // }, []
    // [page]
    // );
    const deleteUser = async (id) => {
        if (!confirm("Delete user?")) return;
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        setUsers(prev => prev.filter(u => u._id !== id));
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="px-8 py-4 text-white">Image</th>
                            <th className="px-8 py-4 text-white">Username</th>
                            <th className="px-8 py-4 text-white">Email</th>
                            <th className="px-8 py-4 text-white">Phone</th>
                            <th className="px-8 py-4 text-white">Status</th>
                            <th className="px-8 py-4 text-white">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-gray-100">
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="text-center border-b hover:bg-gray-50"
                            >
                                {/* Image */}
                                <td className="px-6 py-4 flex items-center justify-center gap-2">
                                    <img
                                        src={user.image || "/avatar.png"}
                                        alt="avatar"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                </td>

                                {/* Username */}
                                <td className="px-6 py-4 font-semibold">
                                    {user.username}
                                </td>

                                {/* Email */}
                                <td className="px-6 py-4">
                                    {user.email}
                                </td>

                                {/* Phone */}
                                <td className="px-6 py-4">
                                    {user.phone}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`${user.status === "Active"
                                            ? "bg-green-500"
                                            : "bg-rose-500"
                                            } text-white px-4 py-1 rounded-full text-sm`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => router.push(`/table/${user._id}`)}>
                                            <BiEdit size={22} className="text-green-500" />
                                        </button>

                                        <button onClick={() => deleteUser(user._id)}>
                                            <BiTrashAlt size={22} className="text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" className="py-6 text-gray-500 text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* // pagination of table  */}

            {/* {totalPage > 1 && (
                <div  className="flex justify-center items-center gap-4 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}>
                        prev
                    </button>
                    <span className="font-semibold"> page{page} of {totalPage}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        disabled={page === totalPage}>
                        next
                    </button>

                </div>
            )} */}
        </>


    );
}