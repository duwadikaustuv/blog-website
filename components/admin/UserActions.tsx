"use client";

import { useState } from "react";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

interface UserActionsProps {
  userId: string;
  currentRole: string;
  userEmail: string;
  isSuperAdmin: boolean;
  isCurrentUser: boolean;
}

export default function UserActions({
  userId,
  currentRole,
  userEmail,
  isSuperAdmin,
  isCurrentUser,
}: UserActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (confirm(`Change ${userEmail}'s role to ${newRole}?`)) {
      setIsUpdating(true);
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update role");
        }

        toast.success(`Role updated to ${newRole}`);
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update role");
      } finally {
        setIsUpdating(false);
        setShowMenu(false);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${userEmail}? This action cannot be undone.`
      )
    ) {
      setIsUpdating(true);
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to delete user");
        }

        toast.success("User deleted");
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete user");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!isSuperAdmin) {
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
          currentRole === "superadmin"
            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            : currentRole === "admin"
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        {currentRole}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={isUpdating}
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            currentRole === "superadmin"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
              : currentRole === "admin"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          } ${isCurrentUser ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {currentRole}
          {!isCurrentUser && <FiChevronDown className="w-3 h-3" />}
        </button>

        {showMenu && !isCurrentUser && (
          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
            <div className="py-1">
              {["user", "admin", "superadmin"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  disabled={role === currentRole}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    role === currentRole
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isCurrentUser && (
        <button
          onClick={handleDeleteUser}
          disabled={isUpdating}
          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          title="Delete user"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
