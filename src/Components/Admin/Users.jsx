// src/components/admin/UserManagementView.jsx
import React from "react";
import {
  Eye,
  UserX,
  UserCheck,
  Users as UsersIcon,
  Search,
} from "lucide-react";

const UserManagementView = ({ users, onToggle, searchTerm, onSearch }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            User Directory
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Manage customer access and monitor account status
          </p>
        </div>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={16}
          />
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <UsersIcon size={18} />
          </div>
          <span className="text-sm font-bold text-slate-700">
            {users.length} Total Users
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                User Profile
              </th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                Role
              </th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                Status
              </th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {/* User Profile Info */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar box matches Product Image box */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg group-hover:scale-105 transition-transform duration-300">
                      {(user.fullname || user.name || "U")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-slate-900 leading-none mb-1">
                        {user.fullname || user.name}
                      </span>
                      <span className="text-sm text-slate-500 font-medium tracking-tight">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                      user.is_staff
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200/50"
                    }`}
                  >
                    {user.is_staff ? "Admin" : "Customer"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        user.is_active ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-bold ${
                        user.is_active ? "text-emerald-600" : "text-red-400"
                      }`}
                    >
                      {user.is_active ? "Active" : "Blocked"}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-5">
                  <div className="flex justify-end items-center gap-2">
                    <button
                      onClick={() => onToggle(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                        user.is_active
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-red-400 text-white hover:bg-red-600"
                      }`}
                    >
                      {user.is_active ? (
                        <UserCheck size={14} />
                      ) : (
                        <UserX size={14} />
                      )}
                      {user.is_active ? "Block" : "Unblock"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="py-20 text-center">
            <UsersIcon className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium text-lg">
              No users found in the directory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementView;
