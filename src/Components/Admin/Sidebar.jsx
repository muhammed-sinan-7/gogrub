const Sidebar = ({ items, activeTab, setActiveTab }) => (
  <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
    <div className="p-8 text-2xl font-black italic tracking-tighter text-slate-900">
      GO<span className="text-indigo-600">GRUB</span> ADMIN
    </div>

    <nav className="flex-1 px-4 space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center p-4 rounded-2xl font-bold text-sm transition-all ${
            activeTab === item.id
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <item.icon size={20} className="mr-3" />
          {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
