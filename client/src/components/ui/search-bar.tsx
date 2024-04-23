import { useSearchStore } from "@/store/useSearchStore";
import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  const { updateSearch } = useSearchStore();

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearch(event.target.value)
  };

  return (
    <div className="flex items-center gap-x-2 shadow-sm lg:w-[40%] w-[60%] rounded-md border leading-none border-slate-200 bg-transparent px-3 py-1.5 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300">
      <Search size={16} className="text-slate-700 inline" />
      <input
        onChange={searchHandler}
        placeholder="Search..."
        className="h-full w-full text-xs focus-visible:ring-0 focus-visible:outline-none px-2 py-0.5 focus-visible:border-b"
      />
    </div>
  );
};

export default SearchBar;
