"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const { data: users, error } = await authClient.admin.listUsers({
        query: {
          searchValue: "some name",
          searchField: "name",
          searchOperator: "contains",
          limit: 100,
          offset: 100,
          sortBy: "name",
          sortDirection: "desc",
          filterField: "email",
          filterValue: "hello@example.com",
          filterOperator: "eq",
        },
      });
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  );
}
