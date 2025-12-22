import Form from "@/Components/form";
import Table from "@/Components/table";
import WelcomeModal from "@/Components/welcomemodal";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";



export default function Home() {
  const router = useRouter()
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [newUser, setIsNewUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const isFirstRender = useRef(true);
  const limit = 5;

  // const totalPages = Math.ceil(users.length / limit);
  // const start = (page - 1) * limit;
  // const paginatedUsers = users.slice(start, start + limit);

  // const filteredUsers = users.filter((user) => {
  //   const keyword = search.toLowerCase();

  //   return (
  //     user.username?.toLowerCase().includes(keyword) ||
  //     user.email?.toLowerCase().includes(keyword) ||
  //     user.phone?.includes(keyword)
  //   );
  // });
  useEffect(() => {
    if (!router.isReady) return;
    const urlPage = Number(router.query.page) || 1;
    setPage(urlPage);
  }, [router.isReady, router.query.page]);
  useEffect(() => {
    if (!router.isReady) return;

    if (Number(router.query.page) !== page) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, page },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [page]);

  

  useEffect(() => {
    fetch(`/api/users?page=${page}&limit=5&search=${search}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      });
  }, [page, search]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [search]);


  return (
    <div className="container mx-auto py-5">
      <div className="flex justify-between items-center ">
        <WelcomeModal
          users={users}
          setUsers={setUsers}
        />

        <div className="flex items-center gap-3 px-4 py-2 w-full max-w-sm 
                    border rounded-full bg-white shadow-sm
                    focus-within:ring-2 focus-within:ring-blue-500">

          <FaSearch className="text-gray-400" />

          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            value={search}
            placeholder="Search..."
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <button onClick={() => setIsNewUser(!newUser)} className="bg-blue-600 right-10 text-white px-4 py-2 rounded">{!newUser ? "Create User" : "Hide Form"}</button>
      </div>
      <div className="container mx-auto py-5">
        {newUser &&
          <Form
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            setUsers={setUsers}
          />
        }
      </div>
      <div className="container mx-auto">
        <Table
          // users={filteredUsers}
          users={users}
          setUsers={setUsers}
          setEditingUser={setEditingUser}
        />
      </div>

      {totalPage > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}>
            prev
          </button>
          {/* <span className="font-semibold"> page{page} of {totalPage}</span> */}
            <div className="flex justify-center gap-2 mt-1">
  {[...Array(totalPage)].map((_, i) => (
    <button
      key={i}
      onClick={() => setPage(i + 1)}
      className={`px-3 py-1 rounded
        ${page === i + 1
          ? "bg-gray-800 text-white"
          : "bg-gray-200"
        }`}
    >
      {i + 1}
    </button>
  ))}
</div>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === totalPage}>
            next
          </button>

        </div>
      )}
    


    </div>
  );
}