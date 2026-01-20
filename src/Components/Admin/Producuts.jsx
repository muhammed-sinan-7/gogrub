import React from "react";
import { Plus, ChevronRight } from "lucide-react";

const ProductManagementView = ({ products, onView }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">Product Inventory</h2>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
        <Plus size={18} /> Add New
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
              Product Name
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
              Price
            </th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {products.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="px-6 py-4">
                <button
                  onClick={() => onView(p.id)}
                  className="font-bold text-slate-700 hover:text-indigo-600 text-left"
                >
                  {p.name}
                </button>
              </td>

              <td className="px-6 py-4 text-sm text-slate-500">{p.category}</td>

              <td className="px-6 py-4 font-bold text-slate-900">₹{p.price}</td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onView(p.id)}
                  className="text-slate-300 group-hover:text-indigo-600"
                >
                  <ChevronRight size={20} />
                </button>
              </td>
              <td className="px-6 py-4 text-right flex gap-3 justify-end">
                <button
                  onClick={() => onView(p.id)}
                  className="text-indigo-600 font-bold text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => onView(p.id)}
                  className="text-slate-500 hover:text-indigo-600 text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductManagementView;
