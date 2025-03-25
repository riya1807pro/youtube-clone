import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  {
    /*add search functionality */
  }
  return (
    <form className="flex w-full mx-[600]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="search"
          className="w-full pl-4 py-2 pr-12 rounded-full border focus-outline-none focus-border-blue-500"
        />
        {/*add remove search button */}
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-grey-100 border border-l-0 rounded-r-full hover:bg-grey-200 disabled:opacity-50
         disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
