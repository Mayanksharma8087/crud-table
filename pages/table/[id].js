"use client";
import Form from '@/Components/form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditTable() {
  const router = useRouter();
  const { id } = router.query;

  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState(editingUser);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/users?user_id=${id}`)
      .then(res => res.json())
      .then(data => {
        setEditingUser(data);
      });
  }, [id]);

  return (
    <Form
      editingUser={editingUser}
      setEditingUser={setEditingUser}
      setUsers={() => {}}
    />
  );
}
