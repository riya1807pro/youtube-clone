"use client"

import { Button } from "@/components/ui/button";
import { APP_URL} from "@/modules/videos/constant";
import { CategoryNames } from "@/script/seedCategory";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const SearchInput = () => {
  const router = useRouter();
  const SearchParams = useSearchParams();

  const Query = SearchParams.get("query") || "";
  const categoryId = SearchParams.get("categoryId") ||  "";

  const [query, setQuery] = useState(Query);


  
  const handleSearch = (e: React.FormEvent) => {
  //   console.log(query? query : "no");
    
  //   e.preventDefault();

  //   if (query.trim()) {
  //     router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  //   }
  // };
    const url = new URL("/search", APP_URL);  
      const newQuery = query.trim();

    url.searchParams.set("query", encodeURIComponent(newQuery))
    if(categoryId){
      url.searchParams.set("categoryId", categoryId)
    } 
    if(newQuery==""){
      url.searchParams.delete("query")
    } 
    console.log("app url:", APP_URL)
    setQuery(newQuery)
    router.push(url.toString())
  };
  return (
    <form onSubmit={handleSearch} className="flex w-full mx-[600]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 py-2 pr-12 rounded-full border focus-outline-none focus-border-blue-500"
        />
        {/*add remove search button */}
        {query && (
          <Button 
             type="button"
             variant="ghost"
             size="icon"
             onClick={()=>setQuery("")}
             className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-grey-500"/>
          </Button>
        )}
      </div>
      <button
      disabled={!query.trim()}
        type="submit"
        className="px-5 py-2.5 bg-grey-100 border border-l-0 rounded-r-full hover:bg-grey-200 disabled:opacity-50
         disabled:cursor-not-allowed"
      >
        <SearchIcon   onClick={()=>{
        console.log("moving to search");
      }} className="size-5" />
      </button>
    </form>
  );
};
