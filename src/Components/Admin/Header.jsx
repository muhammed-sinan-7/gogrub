import { Search, Bell } from "lucide-react";

const Header = () => (
  <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        type="text" 
        placeholder="Search everything..." 
        className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-indigo-500/10"
      />
    </div>
    <div className="flex items-center gap-4">
      <div className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl relative cursor-pointer">
        <Bell size={20} />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900 leading-none">Admin</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">Manager</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">A</div>
      </div>
    </div>
  </header>
);

export default Header;