import React from "react";
// import { handleDeleteProduct } from "./AdminPanel";
import {
  Plus,
  ChevronRight,
  ShoppingBag,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";

const ProductManagementView = ({ products, onView, onDelete, onAddClick }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    {/* ... Header Section (Unchanged) */}
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Inventory
        </h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Manage and monitor your product stock
        </p>
      </div>
      <button
        onClick={onAddClick} // This prop comes from AdminPanel
        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg shadow-orange-100 active:scale-95"
      >
        <Plus size={18} />
        <span>Add Product</span>
      </button>
    </div>

    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        {/* ... Table Head (Unchanged) */}
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
              Product Details
            </th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
              Category
            </th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
              Price
            </th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {products.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              {/* ... Product Info & Price (Unchanged) */}
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <button
                    onClick={() => onView(p.id)}
                    className="font-bold text-slate-800 hover:text-orange-500 transition-colors text-left leading-tight"
                  >
                    {p.name}
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">
                      ID: {p.id}
                    </p>
                  </button>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                  {p.category_name || p.category}
                </span>
              </td>
              <td className="px-8 py-5">
                <span className="font-black text-slate-900 text-base">
                  ₹{p.price}
                </span>
              </td>

              <td className="px-8 py-5">
                <div className="flex justify-end items-center gap-2">
                  <button
                    onClick={() => onView(p.id)}
                    className="p-2 text-slate-400 hover:text-black hover:bg-white hover:shadow-sm rounded-xl transition-all"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onView(p.id)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 transition-all active:scale-95 shadow-sm"
                  >
                    <Edit3 size={14} /> Edit
                  </button>

                  {/* FIX 4: Corrected the onClick handler */}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this product?",
                        )
                      ) {
                        onDelete(p.id); // Just pass the ID directly to the handler
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-1"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ... Empty State (Unchanged) */}
    </div>
  </div>
);

export default ProductManagementView;
