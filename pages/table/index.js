import Table from '@/Components/table'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function EditTableUpdate() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  console.log(users, "users")
  useEffect(() => {
    fetch(`/api/users?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      })
  }, [page, limit])
  return (
    <div className='max-w-[90%] mx-auto pt-10 '>
      <div className='py-5'>
        <Link href={"/"}
          className='bg-blue-500 text-white py-1 px-4 rounded-[5px]'>back</Link>
      </div>
      <Table
        users={users}
        setUsers={setUsers}
      />

      <div className="flex justify-between items-center mt-4">
        {/* Page Size Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Rows:</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* Pagination Buttons */}
        {totalPage > 1 && (
          <div className="flex gap-2">
            {[...Array(totalPage)].map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded 
              ${page === pageNumber
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  )
}
