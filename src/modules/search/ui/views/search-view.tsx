<<<<<<< HEAD
import CategorySection from "../sections/categories-section";
import { ResultSection } from "../sections/result-search";

interface PageProps{
        query: string|undefined ;
        categoryId: string | undefined;
}

export const SearchViews = ({
    query,
    categoryId
}:PageProps)=>{
 return(
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-5">
    <CategorySection categoryId={categoryId || ""}/>
    <ResultSection query ={query} categoryId={categoryId}/>
</div>
 )
}
=======
import { CategoriesSection } from "../sections/categories-section";
import { ResultsSection } from "../sections/results-section";

interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const SearchView = ({ query, categoryId }: PageProps) => {
  return (
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </div>
  );
};
>>>>>>> 9f21a4b (internal structure improvements)
