// src/components/admin/UserManagementView.jsx
import React from 'react';
import { Eye, UserX, UserCheck } from 'lucide-react';

const UserManagementView = ({ users, onToggle }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">User Directory</h2>
          <p className="text-slate-500">Manage customer access and monitor account status.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              {["User Profile", "Role", "Status", "Activity", "Actions"].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {user.name}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
                    user.isAdmin ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-slate-50 text-slate-500 border border-slate-100"
                  }`}>
                    {user.isAdmin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.isBlock ? "bg-red-500" : "bg-emerald-500"}`} />
                    <span className="text-sm font-medium text-slate-600">{user.isBlock ? "Blocked" : "Active"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                  {user.cart?.length || 0} items in cart
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onToggle(user.id, user.isBlock)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        user.isBlock
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                      }`}
                    >
                      {user.isBlock ? <UserCheck size={14}/> : <UserX size={14}/>}
                      {user.isBlock ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;