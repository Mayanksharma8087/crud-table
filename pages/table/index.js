import Table from '@/Components/table'
import React, { useEffect, useState } from 'react';

export default function EditTableUpdate() {
   const [users, setUsers] = useState([]);
       console.log(users,"users")
         useEffect(()=>{
               fetch(`/api/users?page=1&limit=10`)
               .then(res => res.json())
               .then(data=>{
                   setUsers(data.users);
               } )
           },[])
  return (
    <Table
    users={users}
    setUsers={setUsers}
  
    />
  )
}
