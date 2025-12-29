// import Table from '@/Components/table';
// import React from 'react'

// export default function list({users}) {
//     console.log(users,"users")
//   return (
//     <div className="container mx-auto">
//             <Table
//               // users={filteredUsers}
//               users={users}
//             //   setUsers={setUsers}
//             //   setEditingUser={setEditingUser}
//             />
//           </div>
//   )
// }

import Table from "@/Components/table";
import WelcomeModal from "@/Components/welcomemodal";
import Form from "@/Components/form";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Home({ users, page, totalPages, search, limit }) {
    console.log(users,"users")
  const [newUser, setIsNewUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  return (
    <div className="container mx-auto py-5">

      <div className="flex justify-between items-center">

        <WelcomeModal users={users} />

        {/* 🔎 SEARCH (SSR form submit) */}
        <form method="GET" className="flex gap-2 items-center px-4 py-2 
              border rounded-full shadow-sm bg-white">

          <FaSearch className="text-gray-400" />

          <input
            name="search"
            placeholder="Search..."
            defaultValue={search || ""}
            className="w-full outline-none text-sm"
          />

          {/* keep page reset + limit */}
          <input type="hidden" name="page" value={1} />
          <input type="hidden" name="limit" value={limit} />
        </form>

        <button
          onClick={() => setIsNewUser(!newUser)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {!newUser ? "Create User" : "Hide Form"}
        </button>
      </div>

      {/* 🟢 CREATE / EDIT FORM */}
      {newUser && (
        <div className="mt-4">
          <Form
            editingUser={editingUser}
            setEditingUser={setEditingUser}
          />
        </div>
      )}

      {/* 🟢 USERS TABLE */}
      <div className="container mx-auto mt-4">
        <Table
          users={users}
          setEditingUser={setEditingUser}
        />
      </div>

      {/* 🟡 FOOTER CONTROL BAR */}
      <div className="flex justify-between items-center mt-6">

        {/* 🔽 LIMIT DROPDOWN (SSR) */}
        <form method="GET" className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows per page:</span>

          <select
            name="limit"
            defaultValue={limit}
            className="border rounded px-2 py-1 text-sm"
          > 
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

          {/* reset to page 1 but preserve search */}
          <input type="hidden" name="page" value={1} />
          <input type="hidden" name="search" value={search} />

          <button className="hidden" />
        </form>

        {/* 🔷 PAGINATION BUTTONS (SSR links) */}
        {totalPages > 1 && (
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const n = i + 1;
              return (
                <Link
                  key={n}
                  href={`/?page=${n}&limit=${limit}&search=${search || ""}`}
                  className={`px-3 py-1 rounded ${
                    page === n
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {n}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// export async function getServerSideProps() {
//   const res = await fetch("http://localhost:3000/api/users");
//   const data = await res.json();
// console.log(data ,"data")
//   return {
//     props: {
//       users: data.users || data,
//     },
//   };
// }


export async function getServerSideProps(context) {

  const page = parseInt(context.query.page) || 1;
  const limit = parseInt(context.query.limit) || 5;
  const search = context.query.search || "";

  const res = await fetch(
    `http://localhost:3000/api/users?page=${page}&limit=${limit}&search=${search}`
  );

  const data = await res.json();

  return {
    props: {
      users: data.users || [],
      totalPages: data.totalPages || 1,
      page,
      limit,
      search,
    },
  };
}
